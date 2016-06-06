'use strict'

const parse    = require('cli-native').to
const stations = require('vbb-stations')
const shorten  = require('vbb-short-station-name')
const linesAt  = require('vbb-lines-at')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const route = (req, res, next) => {
	const id = parse(req.params.id)
	stations(true, id)
	.catch((err) => {next(err);return err})
	.then((results) => {
		const station = results[0]
		station.name = shorten(station.name)
		if (!station) return next(err400('Station not found.'))
		station.lines = linesAt[station.id]
		res.json(station)
		next()
	})
}

module.exports = route
