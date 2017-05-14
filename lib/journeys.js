'use strict'

const time = require('parse-messy-time')
const parse  = require('cli-native').to
const hafas  = require('vbb-hafas')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const location = (q, t) => {
	if (q[t]) return q[t] // station id
	else if (q[t + '.latitude'] && q[t + '.longitude']) {
		const l = {
			type: 'address',
			name: 'foo bar', // todo
			latitude: +q[t + `.latitude`],
			longitude: +q[t + `.longitude`]
		}
		if (q[t + '.name']) l.name = q[t + '.name']
		if (q[t + '.id']) {
			l.type = 'poi'
			l.id = q[t + '.id']
		}
		return l
	}
	else return null
}

const isNumber = /^\d+$/

const journeys = (req, res, next) => {
	const from = location(req.query, 'from')
	if (!from) return next(err400('Missing origin.'))
	const to = location(req.query, 'to')
	if (!to) return next(err400('Missing destination.'))

	const opt = {}
	if ('when' in req.query) opt.when = isNumber.test(req.query.when)
		? new Date(req.query.when * 1000)
		: time(req.query.when)
	if ('results' in req.query) opt.results = +req.query.results
	if ('via' in req.query) opt.via = req.query.via
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

	hafas.journeys(from, to, opt)
	.then((journeys) => {
		res.json(journeys)
		next()
	}, (err) => next(err))
}

module.exports = journeys
