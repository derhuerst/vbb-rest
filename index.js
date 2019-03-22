'use strict'

const {readFileSync} = require('fs')
const {join} = require('path')
const parse  = require('cli-native').to
const createHafas = require('vbb-hafas')
const createApi = require('hafas-rest-api')
const createHealthCheck = require('hafas-client-health-check')

const pkg = require('./package.json')
const attachMiddleware = require('./api')

const docsAsMarkdown = readFileSync(join(__dirname, 'docs', 'index.md'), {encoding: 'utf8'})

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
	docsLink: '/docs',
	logging: true,
	aboutPage: true,
	docsAsMarkdown,
	addHafasOpts
}
const berlinFriedrichstr = '900000100001'

pHafas
.then((hafas) => {
	const cfg = Object.assign(Object.create(null), config)
	cfg.healthCheck = createHealthCheck(hafas, berlinFriedrichstr)

	const api = createApi(hafas, cfg, attachMiddleware)
	api.listen(config.port, (err) => {
		if (err) {
			api.locals.logger.error(err)
			process.exitCode = 1
		} else api.locals.logger.info(`Listening on ${config.hostname}:${config.port}.`)
	})
})
.catch((err) => {
	console.error(err)
	process.exitCode = 1
})
