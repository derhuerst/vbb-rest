'use strict'

const fs           = require('fs')
const redis        = require('redis')
const express      = require('express')
const hsts         = require('hsts')
const morgan       = require('morgan')
const corser       = require('corser')
const nocache      = require('nocache')
const limiter      = require('express-limiter')
const config       = require('config')
const https        = require('https')

const stations     = require('./lib/stations')
const departures   = require('./lib/departures')
const routes       = require('./lib/routes')

const ssl = {
	  key:  fs.readFileSync(config.key)
	, cert: fs.readFileSync(config.cert)
	, ca:   fs.readFileSync(config.ca)
}



const api = express()
const server = https.createServer(ssl, api)

api.use(hsts({maxAge: 24 * 60 * 60 * 1000}))
api.use(morgan(':remote-addr :method :url :status :response-time ms'))
api.use(corser.create()) // CORS
const noCache = nocache()

const limit = ((tracker) => (amount) => tracker({
	  lookup: 'connection.remoteAddress'
	, total:  amount
	, expire: 10 * 60 * 1000 // 10min
}))(limiter(api, redis.createClient()))



api.get('/stations', limit(1000), stations)
api.get('/stations/:id/departures', noCache, limit(250), departures)
api.get('/routes', noCache, limit(100), routes)

api.use((err, req, res, next) => {
	// todo: move this to vbb-util?
	     if (err.code === 'R5000') err.statusCode = 401
	else if (err.code === 'R0002') err.statusCode = 400
	else if (err.code === 'H890')  err.statusCode = 404
	else if (err.code === 'H9240') err.statusCode = 404
	else if (!err.statusCode)      err.statusCode = 502
	res.status(err.statusCode || 500).json({error: true, msg: err.message})
	next()
})



server.listen(config.port, () => console.log(`Listening on ${config.port}.`))
