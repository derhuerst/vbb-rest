'use strict'

const parse = require('parse-messy-time')
const hafas = require('vbb-hafas')



const isNumber = /^\d+$/

const departures = (req, res, next) => {
	const opt = {}
	if ('when' in req.query) opt.when = isNumber.exec(req.query.when)
		? new Date(req.query.when * 1000)
		: parse(req.query.when)
	if ('direction' in req.query) opt.direction = +req.query.direction
	if ('duration' in req.query) opt.duration = +req.query.duration
	hafas.departures(+req.params.id, opt)
	.then((deps) => {
		for (let dep of deps) {
			dep.when /= 1000
			if (dep.delay) dep.delay /= 1000
		}
		res.json(deps)
		next()
	}, (err) => next(err))
}

module.exports = departures
