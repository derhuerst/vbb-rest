'use strict'

const file = require.resolve('vbb-stations/full.json')

const route = (req, res, next) => {
	res.sendFile(file, {
		maxAge: 10 * 24 * 3600 * 1000 // 10 days
	}, next)
}

module.exports = route
