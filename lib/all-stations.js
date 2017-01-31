'use strict'

// const shorten  = require('vbb-short-station-name')
// const linesAt  = require('vbb-lines-at')

const file = require.resolve('vbb-stations/data.json')

const route = (req, res, next) => {
	res.sendFile(file, {
		maxAge: 10 * 24 * 3600 * 1000 // 10 days
	}, next)
}

module.exports = route
