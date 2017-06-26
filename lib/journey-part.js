'use strict'

const parseTime = require('parse-messy-time')
const hafas  = require('vbb-hafas')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const isNumber = /^\d+$/

const journeyPart = (req, res, next) => {
	const ref = req.params.ref.trim()

	const lineName = req.query.lineName
	if (!lineName) return next(err400('Missing lineName.'))

	const opt = {}
	if ('when' in req.query) {
		const w = req.query.when
		opt.when = isNumber.test(w) ? new Date(w * 1000) : parseTime(w)
	}

	hafas.journeyPart(ref, lineName, opt)
	.then((journeyPart) => {
		res.json(journeyPart)
		next()
	}, (err) => next(err))
}

module.exports = journeyPart
