// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)

import {dirname, join as pathJoin} from 'node:path'
import {fileURLToPath} from 'node:url'
import _cliNative from 'cli-native'
const {to: parse} = _cliNative
import createHafas from 'vbb-hafas'
import createHealthCheck from 'hafas-client-health-check'
import Redis from 'ioredis'
import withCache from 'cached-hafas-client'
import redisStore from 'cached-hafas-client/stores/redis.js'
import createApi from 'hafas-rest-api'
import serveStatic from 'serve-static'

const pkg = require('./package.json')
import {route as stations} from './routes/stations.js'
import {route as station} from './routes/station.js'
import {route as lines} from './routes/lines.js'
import {route as line} from './routes/line.js'
import {route as shape} from './routes/shape.js'
import {route as maps} from './routes/maps.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsRoot = pathJoin(__dirname, 'docs')

const berlinFriedrichstr = '900000100001'

let hafas = createHafas(
	// seems like `vbb-rest` is being redirected
	// pkg.name,
	// seems like these are being blocked
	// require('crypto').randomBytes(10).toString('hex'),
	'App/4.5.1 (iPhone; iOS 15.2; Scale/3.00)',
)
let healthCheck = createHealthCheck(hafas, berlinFriedrichstr)

if (process.env.REDIS_URL) {
	const redis = new Redis(process.env.REDIS_URL || null)
	hafas = withCache(hafas, redisStore(redis))

	const checkHafas = healthCheck
	const checkRedis = () => new Promise((resolve, reject) => {
		setTimeout(reject, 1000, new Error('didn\'t receive a PONG'))
		redis.ping().then(
			res => resolve(res === 'PONG'),
			reject,
		)
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
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: pkg.name,
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/vbb-rest/blob/5/docs/readme.md',
	openapiSpec: true,
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

export {
	hafas,
	config,
	api,
}
