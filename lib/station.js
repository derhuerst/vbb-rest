'use strict'

const parse    = require('cli-native').to
const stations = require('vbb-stations')

const flatten = (r) => Object.assign({}, r, r.__proto__)



const route = (req, res, next) => {
	const id = parse(req.params.id)
	stations(true, id)
	.catch((err) => {next(err);return err})
	.then((results) => {
		res.json(results[0])
		next()
	})
}

module.exports = route
