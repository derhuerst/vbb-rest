boom =			require 'boom'
parse =			require('underscore.parse').parse





module.exports = (req, reply) ->

	if not req.query.query?
		reply boom.badRequest 'Missing `query` parameter'

	options = {}
	if req.query.results?
		options.results = parseInt req.query.results
	if req.query.stations?
		options.stations = parse req.query.stations
	if req.query.addresses?
		options.addresses = parse req.query.addresses
	if req.query.pois?
		options.pois = parse req.query.pois

	if req.auth.credentials and req.auth.credentials.apiKey
		options.apiKey = req.auth.credentials.apiKey
	@hafas.locations req.query.query, options
	.then (results) ->
		response = reply results
		response.type 'application/json'
