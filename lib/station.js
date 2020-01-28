'use strict'

const oldToNew = require('vbb-translate-ids/old-to-new')
const stations = require('vbb-stations')
const shorten  = require('vbb-short-station-name')
const linesAt  = require('vbb-lines-at')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const ibnr = /^\d{6,}$/

const route = (req, res, next) => {
	let id = req.params.id.trim()
	if (!ibnr.test(id)) return next()
	id = oldToNew[id] || id
	const stop = stations(id)[0]
	if (!stop) return next(err400('Stop not found.'))

	stop.name = shorten(stop.name)
	stop.lines = linesAt[stop.id]
	res.json(stop)
	// todo: how to ignore/skip the next handler for the same route?
	next('/stops/:id') // this doesn't work
}

module.exports = route
