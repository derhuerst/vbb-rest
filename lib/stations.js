'use strict'

const autocomplete = require('vbb-stations-autocomplete')
const parse = require('cli-native').to
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
	if (Object.keys(req.query).length === 0) {
		return next(err400('Missing properties.'))
	}

	const props = {}
	for (let prop in req.query) props[prop] = parse(req.query[prop])

	res.json(stations(props))
	next()
}

const route = (req, res, next) => {
	if (req.query.query) complete(req, res, next)
	else filter(req, res, next)
}

module.exports = route
