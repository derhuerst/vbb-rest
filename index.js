'use strict'

const parse  = require('cli-native').to
const createHafas = require('vbb-hafas')
const createApi = require('hafas-rest-api')
const createHealthCheck = require('hafas-client-health-check')

const pkg = require('./package.json')
const attachMiddleware = require('./api')

const pHafas = (() => {
	const hafas = createHafas('hafas-rest-api: ' + pkg.name)
	if (!process.env.HAFAS_CLIENT_NODES) return Promise.resolve(hafas)

	const createRoundRobin = require('@derhuerst/round-robin-scheduler')
	const createRpcClient = require('hafas-client-rpc/client')

	const nodes = process.env.HAFAS_CLIENT_NODES.split(',')
	console.info('Using these hafas-client-rpc nodes:', nodes)

	return new Promise((resolve, reject) => {
		createRpcClient(createRoundRobin, nodes, (err, rpcHafas) => {
			if (err) return reject(err)
			rpcHafas.profile = hafas.profile
			resolve(rpcHafas)
		})
	})
})()

const addHafasOpts = (opt, method, req) => {
	if (method === 'journeys' && ('transferInfo' in req.query)) {
		opt.transferInfo = parse(req.query.transferInfo)
	}
}

const config = {
	hostname: process.env.HOSTNAME || '2.vbb.transport.rest',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: pkg.name,
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/vbb-rest/blob/2/docs/index.md',
	logging: true,
	aboutPage: true,
	addHafasOpts
}
const berlinFriedrichstr = '900000100001'

const api = createApi(config)

pHafas
.then((hafas) => {
	const cfg = Object.assign(Object.create(null), config)
	cfg.healthCheck = createHealthCheck(hafas, berlinFriedrichstr)

	const api = createApi(hafas, cfg, attachMiddleware)
	api.listen(config.port, (err) => {
		if (err) return showError(err)
		else console.info(`Listening on ${config.hostname}:${config.port}.`)
	})
})
.catch(showError)
