'use strict'

const hafas  = require('vbb-hafas')
const config = require('config')



const route = (req, res, next) => {
	const key = req.headers['x-vbb-api-key'] || config.vbbKey
	if (!req.query.from) return res.status(400).end('Missing origin station.')
	if (!req.query.to) return res.status(400).end('Missing destination station.')
	hafas.routes(key, req.query.from, req.query.to)
	.catch((err) => {next(err);return err})
	.then((routes) => {
		res.json(routes)
		next()
	})
}

module.exports = route
