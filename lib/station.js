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



const route = (req, res, next) => {
	let id = req.params.id.trim()
	id = oldToNew[id] || id
	const station = stations(id)[0]
	if (!station) return next(err400('Station not found.'))

	station.name = shorten(station.name)
	station.lines = linesAt[station.id]
	res.json(station)
	next()
}

module.exports = route
