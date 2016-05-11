'use strict'

const autocomplete = require('vbb-stations-autocomplete')
const search       = require('vbb-find-stations')
const ndjson       = require('ndjson')



const stations = (req, res, next) => {
	if (!req.query.query) return res.status(400).end('Missing query.')
	if (req.query.completion === 'true') {
		res.json(autocomplete(req.query.query)
			.map((r) => Object.assign({}, r, r.__proto__)))
		next()
	} else {
		res.type('application/x-ndjson')
		search(req.query.query)
		.on('error', (err) => onError(req, res, err))
		.pipe(ndjson.stringify())
		.pipe(res)
		.on('finish', () => next())
	}
}

module.exports = stations
