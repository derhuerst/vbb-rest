'use strict'

const fs           = require('fs')
const redis        = require('redis')
const express      = require('express')
const hsts         = require('hsts')
const morgan       = require('morgan')
const corser       = require('corser')
const nocache      = require('nocache')
const limiter      = require('express-limiter')
const autocomplete = require('vbb-stations-autocomplete')
const search       = require('vbb-find-stations')
const ndjson       = require('ndjson')
const hafas        = require('vbb-hafas')
const config       = require('config')
const https        = require('https')

const ssl = {
	  key:  fs.readFileSync(config.key)
	, cert: fs.readFileSync(config.cert)
	, ca:   fs.readFileSync(config.ca)
}


const db = redis.createClient()
const api = express()
api.use(hsts({maxAge: 24 * 60 * 60 * 1000}))
api.use(morgan(':remote-addr :method :url :status :response-time ms'))
api.use(corser.create()) // CORS
const noCache = nocache()

const limit = ((tracker) => (amount) => tracker({
	  lookup: 'connection.remoteAddress'
	, total:  amount
	, expire: 10 * 60 * 1000 // 10min
}))(limiter(api, db))

const onError = (req, res, err) => {
	// todo: move this to vbb-util?
	     if (err.code === 'R5000') err.statusCode = 401
	else if (err.code === 'R0002') err.statusCode = 400
	else if (err.code === 'H890')  err.statusCode = 404
	else if (err.code === 'H9240') err.statusCode = 404
	else err.statusCode = 502
	res.status(err.statusCode || 500)
		.json({error: true, msg: err.message})
	return err
}



api.get('/stations', limit(1000), (req, res) => {
	if (!req.query.query) return res.status(400).end('Missing query.')
	if (req.query.completion === 'true')
		return res.json(autocomplete(req.query.query)
			.map((r) => Object.assign({}, r, r.__proto__)))
	else {
		res.type('application/x-ndjson')
		search(req.query.query)
		.on('error', (err) => onError(req, res, err))
		.pipe(ndjson.stringify())
		.pipe(res)
	}
})



api.get('/stations/:id/departures', noCache, limit(250), (req, res) => {
	const key = req.headers['x-vbb-api-key'] || config.vbbKey
	hafas.departures(key, req.params.id)
	.catch((err) => onError(req, res, err))
	.then((deps) => res.json(deps))
})



api.get('/routes', noCache, limit(100), (req, res) => {
	const key = req.headers['x-vbb-api-key'] || config.vbbKey
	if (!req.query.from) return res.status(400).end('Missing origin station.')
	if (!req.query.to) return res.status(400).end('Missing destination station.')
	hafas.routes(key, req.query.from, req.query.to)
	.catch((err) => onError(req, res, err))
	.then((routes) => res.json(routes))
})



https.createServer(ssl, api).listen(config.port, () =>
	console.log(`Server listening on ${config.port}.`))
