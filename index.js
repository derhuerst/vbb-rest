'use strict'

const spdy = require('spdy')
const fs = require('fs')
const config = require('config')

const api = require('./api')
const server = spdy.createServer({
	  key:  fs.readFileSync(config.key)
	, cert: fs.readFileSync(config.cert)
	, ca:   fs.readFileSync(config.ca)
}, api)

server.listen(config.port, (e) => {
	if (e) return console.error(e)
	console.log(`Listening on ${config.port}.`)
})
