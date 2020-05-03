'use strict'

const {data: lines, timeModified} = require('../lib/vbb-lines')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const lineRoute = (req, res, next) => {
	const id = req.params.id.trim()
	const line = lines.find(l => l.id === id)
	if (!line) return next(err400('Line not found.'))

	res.json(line)
	.catch((err) => {
		next(err)
		throw err
	})
}

module.exports = lineRoute
