'use strict'

const createApi = require('./api')

const config = {
	hostname: process.env.HOSTNAME || '2.vbb.transport.rest',
	port: process.env.PORT || 3000,
	name: 'vbb-rest', // todo: use pkg.name
	homepage: 'https://github.com/derhuerst/vbb-rest', // todo: use pkg.homepage
	logging: true
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
