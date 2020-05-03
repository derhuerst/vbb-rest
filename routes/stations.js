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
		props[prop] = parse(req.query[prop])
	}
	const results = stations(props)

	res.type('application/x-ndjson')
	const out = ndjson.stringify()
	out
	.once('error', next)
	.pipe(res)
	.once('finish', () => next())

	for (const station of results) out.write(station)
	out.end()
}

const stationsRoute = (req, res, next) => {
	if (req.query.query) complete(req, res, next)
	else filter(req, res, next)
}

stationsRoute.queryParameters = {
	query: {
		description: 'Find stations by name using [`vbb-stations-autocomplete`](https://npmjs.com/package/vbb-stations-autocomplete).',
		type: 'string',
		defaultStr: '–',
	},
	limit: {
		description: '*If `query` is used:* Return at most `n` stations.',
		type: 'number',
		default: 3,
	},
	fuzzy: {
		description: '*If `query` is used:* Find stations despite typos.',
		type: 'boolean',
		default: false,
	},
	completion: {
		description: '*If `query` is used:* Autocomplete stations.',
		type: 'boolean',
		default: true,
	},
}

module.exports = stationsRoute
