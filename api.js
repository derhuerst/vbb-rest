'use strict'

const express      = require('express')
const hsts         = require('hsts')
const morgan       = require('morgan')
const shorthash    = require('shorthash').unique
const corser       = require('corser')
const compression  = require('compression')
const nocache      = require('nocache')
const path         = require('path')
const serve        = require('serve-static')

const stations     = require('./lib/stations')
const station      = require('./lib/station')
const lines        = require('./lib/lines')
const line         = require('./lib/line')
const shape        = require('./lib/shape')
const nearby       = require('./lib/nearby')
const departures   = require('./lib/departures')
const routes       = require('./lib/routes')
const locations    = require('./lib/locations')
const radar        = require('./lib/radar')
const maps         = require('./lib/maps')



const api = express()
module.exports = api

api.use(hsts({maxAge: 24 * 60 * 60 * 1000}))

morgan.token('id', (req, res) => req.headers['x-identifier'] || shorthash(req.ip))
api.use(morgan(':date[iso] :id :method :url :status :response-time ms'))

const allowed = corser.simpleRequestHeaders.concat(['User-Agent', 'X-Identifier'])
api.use(corser.create({requestHeaders: allowed})) // CORS

api.use(compression())



const logosDir = path.dirname(require.resolve('vbb-logos/package.json'))
api.use('/logos', serve(logosDir, {index: false}))

const noCache = nocache()

api.get('/stations', stations)
api.get('/stations/nearby', nearby)
api.get('/stations/:id', station)
api.get('/stations/:id/departures', noCache, departures)
api.get('/lines', lines)
api.get('/lines/:id', line)
api.get('/shapes/:id', shape)
api.get('/routes', noCache, routes)
api.get('/locations', locations)
api.get('/maps/:type', maps)
api.get('/radar', noCache, radar)



api.use((err, req, res, next) => {
	if (res.headersSent) return next()
	// todo: move this to vbb-util?
	     if (err.code === 'R5000') err.statusCode = 401
	else if (err.code === 'R0002') err.statusCode = 400
	else if (err.code === 'H890')  err.statusCode = 404
	else if (err.code === 'H9240') err.statusCode = 404
	else if (!err.statusCode)      err.statusCode = 502
	res.status(err.statusCode || 500).json({error: true, msg: err.message})
	next()
})
