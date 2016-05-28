'use strict'

const parse = require('parse-messy-time')
const hafas = require('vbb-hafas')



const departures = (req, res, next) => {
	const opt = {}
	if ('when' in req.query) opt.when = parse(req.query.when)
	if ('direction' in req.query) opt.direction = +req.query.direction
	if ('duration' in req.query) opt.duration = +req.query.duration
	hafas.departures(+req.params.id, opt)
	.then((deps) => {
		res.json(deps)
		next()
	}, (err) => next(err))
}

module.exports = departures
