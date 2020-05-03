'use strict'

const {statSync} = require('fs')
const computeEtag = require('etag')
const omit = require('lodash.omit')
const parse = require('cli-native').to
const serveBuffer = require('serve-buffer')
const {filterByKeys: createFilter} = require('vbb-lines')
const {data: lines, timeModified} = require('../lib/vbb-lines')
const toNdjsonBuf = require('../lib/to-ndjson-buf')

const JSON_MIME = 'application/json'
const NDJSON_MIME = 'application/x-ndjson'

const asJson = Buffer.from(JSON.stringify(lines), 'utf8')
const asJsonEtag = computeEtag(asJson)
const asNdjson = toNdjsonBuf(Object.entries(lines))
const asNdjsonEtag = computeEtag(asNdjson)

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const linesRoute = (req, res, next) => {
	const q = omit(req.query, ['variants'])
	const variants = req.query.variants && parse(req.query.variants)

	const t = req.accepts([JSON_MIME, NDJSON_MIME])
	if (t !== JSON_MIME && t !== NDJSON_MIME) {
		return next(err(JSON + ' or ' + NDJSON_MIME, 406))
	}

	res.setHeader('Last-Modified', timeModified.toUTCString())

	if (Object.keys(q).length === 0) {
		const data = t === JSON_MIME ? asJson : asNdjson
		const etag = t === JSON_MIME ? asJsonEtag : asNdjsonEtag
		serveBuffer(req, res, data, {timeModified, etag})
	} else {
		const filter = createFilter(q)

		const head = t === JSON_MIME ? '[\n' : ''
		const sep = t === JSON_MIME ? ',\n' : '\n'
		const tail = t === JSON_MIME ? '\n]\n' : '\n'
		let n = 0
		for (let i = 0; i < lines.length; i++) {
			let l = lines[i]
			if (!filter(l)) continue
			if (variants === false) l = {...l, variants: undefined}
			const j = JSON.stringify(l)
			res.write(`${n++ === 0 ? head : sep}${j}`)
		}
		if (n > 0) res.end(tail)
		else res.end(head + tail)
	}
}

linesRoute.queryParameters = {
	'variants': {
		description: 'Return line variants?',
		type: 'boolean',
		default: true,
	},
}

module.exports = linesRoute
