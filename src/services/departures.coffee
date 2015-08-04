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

	@client.departures req.params.id, options
	.then (results) ->
		for result in results
			result.when = result.when.getTime()   # unix timestamp
			result.realtime = result.realtime.getTime()   # unix timestamp

		response = reply results
		response.type 'application/json'
