'use strict'

const parse = require('parse-messy-time')
const oldToNew = require('vbb-translate-ids/old-to-new')
const hafas = require('vbb-hafas')
const depsInDirection = require('vbb-departures-in-direction')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const isNumber = /^\d+$/

const departures = (req, res, next) => {
	let id = req.params.id.trim()
	id = oldToNew[id] || id

	const opt = {}
	if ('when' in req.query) {
		opt.when = isNumber.exec(req.query.when)
			? new Date(req.query.when * 1000)
			: parse(req.query.when)
	}

	let task
	if ('nextStation' in req.query) {
		const nS = req.query.nextStation
		if (!isNumber.exec(nS)) return next(err400('Invalid nextStation parameter.'))

		if ('results' in req.query) {
			const r = +req.query.results
			if (Number.isNaN(r)) return next(err400('Invalid results parameter.'))
			opt.results = Math.max(0, Math.min(r, 20))
		}
		if ('maxQueries' in req.query) {
			const mQ = +req.query.maxQueries
			if (Number.isNaN(mQ)) return next(err400('Invalid maxQueries parameter.'))
			opt.maxQueries = Math.max(0, Math.min(mQ, 30))
		}

		task = depsInDirection(id, nS, opt)
	} else {
		if ('direction' in req.query) opt.direction = req.query.direction
		if ('duration' in req.query) opt.duration = +req.query.duration
		task = hafas.departures(id, opt)
	}

	task
	.then((deps) => {
		res.json(deps)
		next()
	})
	.catch(next)
}

module.exports = departures
