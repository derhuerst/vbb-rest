'use strict'

const parse  = require('cli-native').to

const pkg = require('./package.json')
const createApi = require('./api')

const addHafasOpts = (opt, method, req) => {
	if (method === 'journeys' && ('transferInfo' in req.query)) {
		opt.transferInfo = parse(req.query.transferInfo)
	}
}

let hafasClientNodes = null
if (process.env.HAFAS_CLIENT_NODES) {
	hafasClientNodes = process.env.HAFAS_CLIENT_NODES.split(',')
	console.info('Using these hafas-client-rpc nodes:', hafasClientNodes)
}

const config = {
	hafasClientNodes,
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

const showError = (err) => {
	console.error(err)
	process.exitCode = 1
}

createApi(config, (err, api) => {
	if (err) return showError(err)

	api.listen(config.port, (err) => {
		if (err) return showError(err)
		else console.info(`Listening on ${config.hostname}:${config.port}.`)
	})
})
