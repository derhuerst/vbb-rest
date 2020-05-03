'use strict'

const parse = require('cli-native').to
const createHafas = require('vbb-hafas')
const createApi = require('hafas-rest-api')
const createHealthCheck = require('hafas-client-health-check')

const pkg = require('./package.json')
const stations = require('./routes/stations')
const station = require('./routes/station')
const lines = require('./routes/lines')
const line = require('./routes/line')
const shape = require('./routes/shape')
const maps = require('./routes/maps')

const berlinFriedrichstr = '900000100001'

const hafas = createHafas('hafas-rest-api: ' + pkg.name)

const modifyRoutes = (routes) => ({
	...routes,
	'/stations': stations,
	'/stations/:id': station,
	'/lines': lines,
	'/lines/:id': line,
	'/shapes/:id': shape,
	'/maps/:type': maps,
})

const addHafasOpts = (opt, method, req) => {
	if (method === 'journeys' && ('transferInfo' in req.query)) {
		opt.transferInfo = parse(req.query.transferInfo)
	}
}

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: pkg.name,
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/vbb-rest/blob/5/docs/readme.md',
	logging: true,
	aboutPage: true,
	addHafasOpts,
	etags: 'strong',
	modifyRoutes,
	healthCheck: createHealthCheck(hafas, berlinFriedrichstr),
}

const api = createApi(hafas, config, () => {})

module.exports = {
	config,
	api,
}
