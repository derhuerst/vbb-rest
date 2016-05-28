'use strict'

const hafas  = require('vbb-hafas')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}



const route = (req, res, next) => {
	if (!req.query.latitude) return next(err400('Missing latitude.'))
	if (!req.query.longitude) return next(err400('Missing longitude.'))
	hafas.nearby(+req.query.latitude, +req.query.longitude)
	.then((nearby) => {
		res.json(nearby)
		next()
	}, (err) => next(err))
}

module.exports = route
