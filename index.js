'use strict'

const express      = require('express')
const autocomplete = require('vbb-stations-autocomplete')
const search       = require('vbb-find-stations')
const ndjson       = require('ndjson')
const hafas        = require('vbb-hafas')
const config       = require('config')

const api = express()

const onError = (req, res, err) => {
	console.error(err.message)
	res.status(500).json({error: true, msg: err.message})
	return err
}



api.get('/stations', (req, res) => {
	if (!req.query.query) return res.status(400).end('Missing query.')
	if (req.query.completion === 'true')
		return res.json(autocomplete(req.query.query)
			.map((r) => Object.assign({}, r, r.__proto__)))
	else {
		res.type('application/x-ndjson')
		search(req.query.query)
		.on('error', (err) => onError(req, res, err))
		.pipe(ndjson.stringify())
		.pipe(res)
	}
})

api.get('/stations/:id/departures', (req, res) => {
	hafas.departures(config.vbbKey, req.params.id)
	.catch((err) => (err) => onError(req, res, err))
	.then((deps) => res.json(deps))
})

api.get('/routes', (req, res) => {
	if (!req.query.from) return res.status(400).end('Missing origin station.')
	if (!req.query.to) return res.status(400).end('Missing destination station.')
	hafas.routes(config.vbbKey, req.query.from, req.query.to)
	.catch((err) => (err) => onError(req, res, err))
	.then((routes) => res.json(routes))
})



api.listen(3000)
