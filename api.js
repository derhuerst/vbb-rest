'use strict'

const path = require('path')
const serve = require('serve-static')
const hafas = require('vbb-hafas')
const createBaseApi = require('hafas-rest-api')

const stations = require('./lib/stations')
const allStations  = require('./lib/all-stations')
const station = require('./lib/station')
const lines = require('./lib/lines')
const line = require('./lib/line')
const shape = require('./lib/shape')
const maps = require('./lib/maps')

const logosDir = path.dirname(require.resolve('vbb-logos/package.json'))

const attachMiddleware = (api) => {
	api.use('/logos', serve(logosDir, {index: false}))
	api.get('/stations', stations)
	api.get('/stations/all', allStations)
	api.get('/stations/:id', station)
	api.get('/lines', lines)
	api.get('/lines/:id', line)
	api.get('/shapes/:id', shape)
	api.get('/maps/:type', maps)
}

const createApi = (config) => {
	return createBaseApi(hafas, config, attachMiddleware)
}

module.exports = createApi
