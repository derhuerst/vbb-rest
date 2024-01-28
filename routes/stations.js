// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module'
const require = createRequire(import.meta.url)

import computeEtag from 'etag'
import serveBuffer from 'serve-buffer'
import autocomplete from 'vbb-stations-autocomplete'
import _cliNative from 'cli-native'
const {to: parse} = _cliNative
import _vbbStations from 'vbb-stations'
const {filterByKeys: createFilter} = _vbbStations
import {data as stations, timeModified} from '../lib/vbb-stations.js'
import {toNdjsonBuf} from '../lib/to-ndjson-buf.js'

const autocompletePkg = require('vbb-stations-autocomplete/package.json')
const stationsPkg = require('vbb-stations/package.json')

// todo: DRY with vbb-rest/routes/stations.js?

const JSON_MIME = 'application/json'
const NDJSON_MIME = 'application/x-ndjson'

const asJson = Buffer.from(JSON.stringify(stations), 'utf8')
const asJsonEtag = computeEtag(asJson)
const asNdjson = toNdjsonBuf(Object.entries(stations))
const asNdjsonEtag = computeEtag(asNdjson)

const err = (msg, statusCode = 500) => {
	const err = new Error(msg)
	err.statusCode = statusCode
	return err
}

const complete = (req, res, next, q, onStation, onEnd) => {
	const limit = q.results && parseInt(q.results) || 3
	const fuzzy = parse(q.fuzzy) === true
	const completion = parse(q.completion) !== false
	const results = autocomplete(q.query, limit, fuzzy, completion)

	for (const result of results) {
		const station = stations[result.id]
		if (!station) continue

		Object.assign(result, station)
		onStation(result)
	}
	onEnd()
}

const filter = (req, res, next, q, onStation, onEnd) => {
	const selector = Object.create(null)
	for (const prop in q) selector[prop] = parse(q[prop])
	const filter = createFilter(selector)

	for (const station of Object.values(stations)) {
		if (filter(station)) onStation(station)
	}
	onEnd()
}

const stationsRoute = (req, res, next) => {
	const t = req.accepts([JSON_MIME, NDJSON_MIME])
	if (t !== JSON_MIME && t !== NDJSON_MIME) {
		return next(err(JSON + ' or ' + NDJSON_MIME, 406))
	}

	res.setHeader('Last-Modified', timeModified.toUTCString())
	res.setHeader('Content-Type', t)

	const head = t === JSON_MIME ? '{\n' : ''
	const sep = t === JSON_MIME ? ',\n' : '\n'
	const tail = t === JSON_MIME ? '\n}\n' : '\n'
	let i = 0
	const onStation = (s) => {
		const j = JSON.stringify(s)
		const field = t === JSON_MIME ? `"${s.id}":` : ''
		res.write(`${i++ === 0 ? head : sep}${field}${j}`)
	}
	const onEnd = () => {
		if (i > 0) res.end(tail)
		else res.end(head + tail)
	}

	const q = req.query
	if (Object.keys(q).length === 0) {
		const data = t === JSON_MIME ? asJson : asNdjson
		const etag = t === JSON_MIME ? asJsonEtag : asNdjsonEtag
		serveBuffer(req, res, data, {
			timeModified,
			etag,
			contentType: t,
		})
	} else if (q.query) {
		complete(req, res, next, q, onStation, onEnd)
	} else {
		filter(req, res, next, q, onStation, onEnd)
	}
}

stationsRoute.openapiPaths = {
	'/stations': {
		get: {
			summary: 'Autocompletes stops/stations by name or filters stops/stations.',
			description: `\
If the \`query\` parameter is used, it will use [\`vbb-stations-autocomplete@${autocompletePkg.version}\`](https://github.com/derhuerst/vbb-stations-autocomplete/tree/${autocompletePkg.version}) to autocomplete stops/stations by name. Otherwise, it will filter the stops/stations in [\`vbb-stations@${stationsPkg.version}\`](https://github.com/derhuerst/vbb-stations/tree/${stationsPkg.version}).

Instead of receiving a JSON response, you can request [newline-delimited JSON](http://ndjson.org) by sending \`Accept: application/x-ndjson\`.`,
			parameters: [{
				name: 'query',
				in: 'query',
				description: `Find stations by name using [\`vbb-stations-autocomplete@${autocompletePkg.version}\`](https://github.com/derhuerst/vbb-stations-autocomplete/tree/${autocompletePkg.version}).`,
				schema: {
					type: 'string',
				},
			}, {
				name: 'limit',
				in: 'query',
				description: '*If `query` is used:* Return at most `n` stations.',
				schema: {
					type: 'integer',
					default: 3,
				},
			}, {
				name: 'fuzzy',
				in: 'query',
				description: '*If `query` is used:* Find stations despite typos.',
				schema: {
					type: 'boolean',
					default: false,
				},
			}, {
				name: 'completion',
				in: 'query',
				description: '*If `query` is used:* Autocomplete stations.',
				schema: {
					type: 'boolean',
					default: true,
				},
			}],
			responses: {
				'2XX': {
					description: `An object of stops/stations in the [\`vbb-stations@${stationsPkg.version}\` format](https://github.com/derhuerst/vbb-stations/blob/${stationsPkg.version}/readme.md), with their IDs as the keys.`,
					content: {
						'application/json': {
							schema: {
								// todo
								type: 'object',
							},
							// todo: example(s)
						},
					},
				},
			},
		},
	},
}

stationsRoute.queryParameters = {
	query: {
		description: `Find stations by name using [\`vbb-stations-autocomplete@${autocompletePkg.version}\`](https://github.com/derhuerst/vbb-stations-autocomplete/tree/${autocompletePkg.version}).`,
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

export {
	stationsRoute as route,
}
