'use strict'

const {join: pathJoin} = require('path')
const parse = require('cli-native').to
const createHafas = require('vbb-hafas')
const createHealthCheck = require('hafas-client-health-check')
const {createClient: createRedis} = require('redis')
const withCache = require('cached-hafas-client')
const redisStore = require('cached-hafas-client/stores/redis')
const createApi = require('hafas-rest-api')
const serveStatic = require('serve-static')

const pkg = require('./package.json')
const stations = require('./routes/stations')
const station = require('./routes/station')
const lines = require('./routes/lines')
const line = require('./routes/line')
const shape = require('./routes/shape')
const maps = require('./routes/maps')

const docsRoot = pathJoin(__dirname, 'docs')

const berlinFriedrichstr = '900000100001'

let hafas = createHafas('hafas-rest-api: ' + pkg.name)
let healthCheck = createHealthCheck(hafas, berlinFriedrichstr)

if (process.env.REDIS_URL) {
	const redis = createRedis({
		url: process.env.REDIS_URL,
	})
	redis.on('error', (err) => {
		api.locals.logger.error(err)
	})
	hafas = withCache(hafas, redisStore(redis))

	const checkHafas = healthCheck
	const checkRedis = () => new Promise((resolve, reject) => {
		setTimeout(reject, 1000, new Error('didn\'t receive a PONG'))
		redis.ping((err, res) => {
			if (err) reject(err)
			else resolve(res === 'PONG')
		})
	})
	healthCheck = async () => (
		(await checkHafas()) === true &&
		(await checkRedis()) === true
	)
}

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
	aboutPage: false,
	addHafasOpts,
	etags: 'strong',
	csp: `default-src 'none' style-src 'self' 'unsafe-inline' img-src https:`,
	modifyRoutes,
	healthCheck,
}

const api = createApi(hafas, config, (api) => {
	api.use('/', serveStatic(docsRoot, {
		extensions: ['html', 'htm'],
	}))
})

module.exports = {
	config,
	api,
}
