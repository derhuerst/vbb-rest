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

const pkg = require('./package.json')
const deprecationWarning = require('./lib/deprecation-warning')
const stations     = require('./lib/stations')
const allStations  = require('./lib/all-stations')
const station      = require('./lib/station')
const lines        = require('./lib/lines')
const line         = require('./lib/line')
const shape        = require('./lib/shape')
const nearby       = require('./lib/nearby')
const departures   = require('./lib/departures')
const journeys = require('./lib/journeys')
const journeyPart = require('./lib/journey-part')
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

api.use((req, res, next) => {
	if (!res.headersSent)
		res.setHeader('X-Powered-By', pkg.name + ' ' + pkg.homepage)
	next()
})

api.use(deprecationWarning)



const logosDir = path.dirname(require.resolve('vbb-logos/package.json'))
api.use('/logos', serve(logosDir, {index: false}))

const noCache = nocache()

api.get('/stations', stations)
api.get('/stations/all', allStations)
api.get('/stations/nearby', nearby)
api.get('/stations/:id', station)
api.get('/stations/:id/departures', noCache, departures)
api.get('/lines', lines)
api.get('/lines/:id', line)
api.get('/shapes/:id', shape)
api.get('/journeys', noCache, journeys)
api.get('/journeys/parts/:ref', noCache, journeyPart)
api.get('/locations', locations)
api.get('/maps/:type', maps)
api.get('/radar', noCache, radar)



api.use((err, req, res, next) => {
	if (process.env.NODE_ENV === 'dev') console.error(err)
	if (res.headersSent) return next()

	let msg = err.message, code = null
	if (err.isHafasError) {
		msg = 'VBB error: ' + msg
		code = 502
	}
	res.status(code || 500).json({error: true, msg})
	next()
})
