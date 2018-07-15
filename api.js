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

const createApi = (config, cb) => {
	if (config && config.hafasClientNodes) {
		const {RoundRobin} = require('square-batman')
		const createRpcClient = require('hafas-client-rpc/client')

		// square-batman is not abstract-scheduler-compatible yet
		const createScheduler = (urls) => {
			const scheduler = new RoundRobin(urls)
			scheduler.get = scheduler.next
			return scheduler
		}

		const pool = createRpcClient(createScheduler, config.hafasClientNodes, (err, rpcHafas) => {
			if (err) return cb(err)
			rpcHafas.profile = hafas.profile
			config = Object.assign({}, config)
			config.hafas = rpcHafas
			cb(null, createBaseApi(rpcHafas, config, attachMiddleware))
		})
		pool.on('error', console.error)
	} else {
		setImmediate(cb, null, createBaseApi(hafas, config, attachMiddleware))
	}
}

module.exports = createApi
