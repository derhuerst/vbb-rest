'use strict'

const hafas  = require('vbb-hafas')
const config = require('config')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const route = (req, res, next) => {
	const key = req.headers['x-vbb-api-key'] || config.vbbKey
	if (!req.query.from) return next(err400('Missing origin station.'))
	if (!req.query.to) return next(err400('Missing destination station.'))
	const opt = {
		  results:            parse(req.query.results)
		, transferTimeFactor: parse(req.query.transferTimeFactor)
	}
	opt.products = [
		'	suburban', 'subway', 'tram', 'bus', 'ferry', 'express', 'regional'
	].reduce((acc, type) => {
		if (type in req.query) acc[type] = parse(req.query[type])
		return acc
	}, {})

	hafas.routes(key, req.query.from, req.query.to)
	.catch((err) => {next(err);return err})
	.then((routes) => {
		res.json(routes)
		next()
	})
}

module.exports = route
