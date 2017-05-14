'use strict'

const parse = require('cli-native').to
const hafas = require('vbb-hafas')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const route = (req, res, next) => {
	if (!req.query.latitude) return next(err400('Missing latitude.'))
	if (!req.query.longitude) return next(err400('Missing longitude.'))

	const opt = {}
	if ('results' in req.query) opt.results = parseInt(req.query.results)
	if ('distance' in req.query) opt.distance = parseInt(req.query.distance)
	if ('stations' in req.query) opt.stations = parse(req.query.stations)
	if ('poi' in req.query) opt.poi = parse(req.query.poi)

	hafas.nearby(+req.query.latitude, +req.query.longitude, opt)
	.then((nearby) => {
		res.json(nearby)
		next()
	}, (err) => next(err))
}

module.exports = route
