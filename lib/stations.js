'use strict'

const parse = require('cli-native').to
const autocomplete = require('vbb-stations-autocomplete')
const stations = require('vbb-stations')
const map = require('through2-map')
const ndjson       = require('ndjson')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const allStations = stations()

// todo: merge this with db-rest#new-hafas-client/lib/stations
const complete = (req, res, next) => {
	const limit = req.query.results && parseInt(req.query.results) || 3
	const fuzzy = parse(req.query.fuzzy) === true
	const completion = parse(req.query.completion) !== false
	const results = autocomplete(req.query.query, limit, fuzzy, completion)

	const data = []
	for (let result of results) {
		// todo: make this more efficient
		const [station] = stations(result.id)
		if (!station) continue

		data.push(Object.assign({}, result, station))
	}

	res.json(data)
	next()
}

const filter = (req, res, next) => {
	if (Object.keys(req.query).length === 0) {
		return next(err400('Missing properties.'))
	}

	const props = Object.create(null)
	for (let prop in req.query) {
		if (prop.slice(0, 12) === 'coordinates.') { // derhuerst/vbb-rest#20
			prop = 'location.' + prop.slice(12)
		}
		props[prop] = parse(req.query[prop])
	}
	let filter = () => true
	if (Object.keys(props).length > 0) {
		filter = (item) => {
			for (let key in props) {
				if (item[key] !== props[key]) return false
			}
			return true
		}
	}

	res.type('application/x-ndjson')
	const out = ndjson.stringify()
	out
	.once('error', next)
	.pipe(res)
	.once('finish', () => next())

	for (let station of allStations) {
		if (filter(station)) out.write(station)
	}
	out.end()
}

const route = (req, res, next) => {
	if (req.query.query) complete(req, res, next)
	else filter(req, res, next)
}

module.exports = route
