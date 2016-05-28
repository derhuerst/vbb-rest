'use strict'

const parse  = require('cli-native').to
const hafas  = require('vbb-hafas')



const route = (req, res, next) => {
	hafas.departures(+req.params.id)
	.then((deps) => {
		res.json(deps)
		next()
	}, (err) => next(err))
}

module.exports = route
