'use strict'

const hafas  = require('vbb-hafas')
const config = require('config')



const route = (req, res, next) => {
	const key = req.headers['x-vbb-api-key'] || config.vbbKey
	hafas.departures(key, req.params.id)
	.catch((err) => {next(err);return err})
	.then((deps) => {
		res.json(deps)
		next()
	})
}

module.exports = route
