'use strict'

const omit = require('lodash.omit')
const lines  = require('vbb-lines')
const parse = require('cli-native').to
const map = require('through2-map')
const ndjson = require('ndjson')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const noVariants = (line) => omit(line, ['variants'])



const linesRoute = (req, res, next) => {
	const q = omit(req.query, ['variants'])
	const showVariants = parse(req.query.variants)

	let data = Object.keys(q).length === 0 ? lines('all') : lines(q)
	if (!showVariants) data = data.pipe(map.obj(noVariants))

	data
	.on('error', (err) => next(err))
	.pipe(ndjson.stringify())
	.pipe(res)
	.on('finish', () => next())
}

linesRoute.queryParameters = {
	'variants': {
		description: 'Return line variants?',
		type: 'boolean',
		default: true,
	},
}

module.exports = linesRoute
