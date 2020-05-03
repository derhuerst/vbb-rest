'use strict'

const stations = require('./routes/stations')
const allStations  = require('./routes/all-stations')
const station = require('./routes/station')
const lines = require('./routes/lines')
const line = require('./routes/line')
const shape = require('./routes/shape')
const maps = require('./routes/maps')

const attachMiddleware = (api) => {
	api.get('/stations', stations)
	api.get('/stations/all', allStations)
	api.get('/stations/:id', station)
	api.get('/lines', lines)
	api.get('/lines/:id', line)
	api.get('/shapes/:id', shape)
	api.get('/maps/:type', maps)
}

module.exports = attachMiddleware
