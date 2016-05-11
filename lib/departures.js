'use strict'

const config = require('config')
const parse  = require('cli-native').to
const hafas  = require('vbb-hafas')



const route = (req, res, next) => {
	const key = req.headers['x-vbb-api-key'] || config.vbbKey
	const opt = {results: parse(req.query.results)}
	opt.products = [
		'suburban', 'subway', 'tram', 'bus', 'ferry', 'express', 'regional'
	].reduce((acc, type) => {
		if (type in req.query) acc[type] = parse(req.query[type])
		return acc
	}, {})

	hafas.departures(key, req.params.id, opt)
	.catch((err) => {next(err);return err})
	.then((deps) => {
		res.json(deps)
		next()
	})
}

module.exports = route
