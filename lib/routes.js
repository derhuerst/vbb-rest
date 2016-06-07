'use strict'

const time = require('parse-messy-time')
const parse  = require('cli-native').to
const hafas  = require('vbb-hafas')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const route = (req, res, next) => {
	if (!req.query.from) return next(err400('Missing origin station.'))
	if (!req.query.to) return next(err400('Missing destination station.'))

	const opt = {}
	if ('when' in req.query) opt.when = time(req.query.when)
	if ('results' in req.query) opt.results = +req.query.results
	if ('via' in req.query) opt.via = +req.query.via
	if ('passedStations' in req.query)
		opt.passedStations = parse(req.query.passedStations)
	if ('transfers' in req.query) opt.transfers = +req.query.transfers
	if ('transferTime' in req.query)
		opt.transferTime = +req.query.transferTime
	if ('accessibility' in req.query)
		opt.accessibility = req.query.accessibility
	if ('bike' in req.query) opt.bike = parse(req.query.bike)

	const products =
		['suburban', 'subway', 'tram', 'bus', 'ferry', 'express', 'regional']
	.reduce((acc, type) => {
		if (type in req.query) acc[type] = parse(req.query[type])
		return acc
	}, {})
	if (Object.keys(products)) opt.products = products

	hafas.routes(+req.query.from, +req.query.to, opt)
	.then((routes) => {
		for (let route of routes) {
			route.start = +route.start
			route.end = +route.end
			for (let part of route.parts) {
				part.start = +part.start
				part.end = +part.end
			}
		}
		res.json(routes)
		next()
	}, (err) => next(err))
}

module.exports = route
