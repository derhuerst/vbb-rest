'use strict'

const parse  = require('cli-native').to
const lines  = require('vbb-lines')
const ndjson = require('ndjson')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const route = (req, res, next) => {
	const props = ['name', 'agencyId', 'type']
		.reduce((acc, prop) => {
			if (prop in req.query) acc[prop] = parse(req.query[prop])
			return acc
		}, {})
	if (Object.keys(props).length === 0)
		return next(err400('Missing properties.'))
	lines(props)
	.on('error', (err) => next(err))
	.pipe(ndjson.stringify())
	.pipe(res)
	.on('finish', () => next())
}

module.exports = route
