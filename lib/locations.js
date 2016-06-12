'use strict'

const parse = require('cli-native').to
const hafas = require('vbb-hafas')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const route = (req, res, next) => {
	if (!req.query.query) return next(err400('Missing query.'))

	const opt = {}
	if ('results' in req.query) opt.results = +req.query.results
	if ('stations' in req.query) opt.stations = parse(req.query.stations)
	if ('addresses' in req.query) opt.addresses = parse(req.query.addresses)
	if ('poi' in req.query) opt.poi = parse(req.query.poi)

	hafas.locations(req.query.query, opt)
	.then((locations) => {
		res.json(locations)
		next()
	}, (err) => next(err))
}

module.exports = route
