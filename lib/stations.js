'use strict'

const autocomplete = require('vbb-stations-autocomplete')
const search       = require('vbb-find-stations')
const stations     = require('vbb-stations')
const ndjson       = require('ndjson')
const parse        = require('cli-native').to

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const flatten = (r) => Object.assign({}, r, r.__proto__)
const complete = (req, res, next) => {
	res.json(autocomplete(req.query.query).map(flatten))
	next()
}

const findByName = (req, res, next) => {
	res.type('application/x-ndjson')
	search(req.query.query)
	.on('error', (err) => next(err))
	.pipe(ndjson.stringify())
	.pipe(res)
	.on('finish', () => next())
}

const filter = (req, res, next) => {
	const props = ['name', 'latitude', 'longitude', 'weight']
		.reduce((acc, prop) => {
			if (prop in req.query) acc[prop] = parse(req.query[prop])
			return acc
		}, {})
	if (Object.keys(props).length === 0)
		return next(err400('Missing properties.'))
	stations(props)
	.on('error', (err) => next(err))
	.pipe(ndjson.stringify())
	.pipe(res)
	.on('finish', () => next())
}

const route = (req, res, next) => {
	if (req.query.query) {
		if (req.query.completion === 'true') complete(req, res, next)
		else findByName(req, res, next)
	} else filter(req, res, next)
}

module.exports = route
