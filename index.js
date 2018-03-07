'use strict'

const pkg = require('./package.json')
const createApi = require('./api')

const config = {
	hostname: process.env.HOSTNAME || '2.vbb.transport.rest',
	port: process.env.PORT || 3000,
	name: pkg.name,
	description: pkg.description,
	homepage: pkg.homepage,
	docsLink: 'https://github.com/derhuerst/vbb-rest/blob/2/docs/index.md',
	logging: true,
	aboutPage: true
}

const api = createApi(config)

api.listen(config.port, (err) => {
	if (err) {
		console.error(err)
		process.exitCode = 1
	} else {
		console.info(`Listening on ${config.hostname}:${config.port}.`)
	}
})
