'use strict'

const map = require('through2-map')
const omit = require('lodash.omit')
const parse = require('cli-native').to
const lines  = require('vbb-lines')
const ndjson = require('ndjson')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const noVariants = (line) => omit(line, ['variants'])



const route = (req, res, next) => {
	const props = {}
	if ('name' in req.query) props.name = req.query.name
	if ('agencyId' in req.query) props.agencyId = req.query.agencyId
	if ('type' in req.query) props.type = req.query.type
	if (Object.keys(props).length === 0)
		return next(err400('Missing properties.'))

	let s = lines(props).on('error', (err) => next(err))
	if (!parse(req.query.variants)) s = s.pipe(map.obj(noVariants))

	s.pipe(ndjson.stringify())
	.pipe(res)
	.on('finish', () => next())
}

module.exports = route
