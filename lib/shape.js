'use strict'

const shapes = require('vbb-shapes')



const route = (req, res, next) => {
	const id = req.params.id

	shapes(id)
	.then((shape) => {
		res.json(shape)
		next()
	})
	.catch(() => {
		const err = new Error('Shape not found.')
		err.statusCode = 404
		next(err)
	})
}

module.exports = route
