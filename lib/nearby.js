'use strict'

const parse    = require('cli-native').to
const stations = require('vbb-stations')
const hifo     = require('hifo')
const distance = require('gps-distance')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const flatten = (r) => Object.assign({}, r, r.__proto__)

const sortByDistance = (latitude, longitude) => (a, b) =>
	  distance(latitude, longitude, a.latitude, a.longitude)
	- distance(latitude, longitude, b.latitude, b.longitude)



const route = (req, res, next) => {
	if (!req.query.latitude) return next(err400('Missing latitude.'))
	const lat = parse(req.query.latitude)
	if (!req.query.longitude) return next(err400('Missing longitude.'))
	const long = parse(req.query.longitude)
	const results = 'results' in req.query
		? Math.min(parse(req.query.results), 50) : 10

	const closest = hifo(sortByDistance(lat, long), results)

	stations('all')
	.on('data', (s) => closest.add(s))
	.on('end', () => {
		res.json(closest.data.map(flatten))
		next()
	})
}

module.exports = route
