'use strict'

const autocomplete = require('vbb-stations-autocomplete')
const parse = require('cli-native').to
const fromArray = require('from2-array').obj
const stations = require('vbb-stations')
const map = require('through2-map')
const ndjson       = require('ndjson')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const complete = (req, res, next) => {
	const fuzzy = req.query.fuzzy === 'true'
	const completion = req.query.completion !== 'false'

	res.json(autocomplete(req.query.query, fuzzy, completion))
	next()
}

const filter = (req, res, next) => {
	const props = ['name', 'latitude', 'longitude', 'weight']
		.reduce((acc, prop) => {
			if (prop in req.query) acc[prop] = parse(req.query[prop])
			return acc
		}, {})
	if (Object.keys(props).length === 0)
		return next(err400('Missing properties.'))

	fromArray(stations(props))
	.on('error', (err) => next(err))
	.pipe(map.obj(nice))
	.pipe(ndjson.stringify())
	.pipe(res)
	.on('finish', () => next())
}

const route = (req, res, next) => {
	if (req.query.query) complete(req, res, next)
	else filter(req, res, next)
}

module.exports = route
