'use strict'

const redis        = require('redis')
const express      = require('express')
const corser       = require('corser')
const limiter      = require('express-limiter')
const autocomplete = require('vbb-stations-autocomplete')
const search       = require('vbb-find-stations')
const ndjson       = require('ndjson')
const hafas        = require('vbb-hafas')
const config       = require('config')

const db = redis.createClient()
const api = express()
api.use(corser.create()) // CORS

const limit = ((tracker) => (amount) => tracker({
	  lookup: 'connection.remoteAddress'
	, total:  amount
	, expire: 10 * 60 * 1000 // 10min
}))(limiter(api, db))

const onError = (req, res, err) => {
	console.error(err.message)
	res.status(500).json({error: true, msg: err.message})
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

api.get('/stations/:id/departures', limit(250), (req, res) => {
	hafas.departures(config.vbbKey, req.params.id)
	.catch((err) => onError(req, res, err))
	.then((deps) => res.json(deps))
})

api.get('/routes', limit(100), (req, res) => {
	if (!req.query.from) return res.status(400).end('Missing origin station.')
	if (!req.query.to) return res.status(400).end('Missing destination station.')
	hafas.routes(config.vbbKey, req.query.from, req.query.to)
	.catch((err) => onError(req, res, err))
	.then((routes) => res.json(routes))
})



api.listen(config.port)
