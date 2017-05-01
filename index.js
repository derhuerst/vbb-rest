'use strict'

const http = require('http')

const api = require('./api')
const server = http.createServer(api)

const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME || ''

server.listen(port, (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.info(`Listening on ${hostname}:${port}.`)
})
