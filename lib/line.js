'use strict'

const parse  = require('cli-native').to
const lines  = require('vbb-lines')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const route = (req, res, next) => {
	const id = parse(req.params.id)
	lines(true, id)
	.catch((err) => {next(err);return err})
	.then((results) => {
		const line = results[0]
		if (!line) return next(err400('Line not found.'))
		line.lines = linesAt[line.id]
		res.json(line)
		next()
	})
}

module.exports = route
