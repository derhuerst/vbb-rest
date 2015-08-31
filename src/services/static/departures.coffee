parse =			require('underscore.parse').parse





module.exports = (req, reply) ->

	options = {}
	if req.query.results?
		options.results = parseInt req.query.results
	if req.query.when?
		options.when = new Date req.query.when
	if req.query.direction?
		options.direction = parseInt req.query.direction
	options.products = {}
	for product in [
		'suburban',
		'subway',
		'tram',
		'bus',
		'ferry',
		'express',
		'regional'
	]
		if req.query[product]?
			options.products[product] = parse req.query[product]

	if req.auth.credentials and req.auth.credentials.apiKey
		options.apiKey = req.auth.credentials.apiKey
	@hafas.departures parseInt(req.params.id), options
	.then (results) ->
		for result in results
			result.when = result.when.getTime()   # unix timestamp
			if result.realtime
				result.realtime = result.realtime.getTime()   # unix timestamp

		response = reply results
		response.type 'application/json'
