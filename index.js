'use strict'

const parse  = require('cli-native').to
const createHafas = require('vbb-hafas')
const createApi = require('hafas-rest-api')

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
	port: process.env.PORT || 3000,
	name: pkg.name,
	description: pkg.description,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/vbb-rest/blob/2/docs/index.md',
	logging: true,
	aboutPage: true,
	addHafasOpts
}

const api = createApi(config)

pHafas
.then((hafas) => {
	const api = createApi(hafas, config, attachMiddleware)

	api.listen(config.port, (err) => {
		if (err) return showError(err)
		else console.info(`Listening on ${config.hostname}:${config.port}.`)
	})
})
.catch(showError)
