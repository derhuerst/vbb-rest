parse =			require('underscore.parse').parse





module.exports = (req, reply) ->

	options = {}

	from = req.params.from
	if from.charAt(0) is '@'   # GPS notation
		from = from.substr(1).split '|'
		options.fromLatitude = parseFloat from[0]
		options.fromLongitude = parseFloat from[1]
	else options.from = parseInt from

	to = req.params.to
	if to.charAt(0) is '@'   # GPS notation
		to = to.substr(1).split '|'
		options.toLatitude = parseFloat to[0]
		options.toLongitude = parseFloat to[1]
	else options.to = parseInt to

	if req.query.via?
		options.via = parseInt req.query.via

	if req.query.results?
		options.results = parseInt req.query.results
	if req.query.when?
		options.when = new Date req.query.when
	if req.query.changeTimeFactor?
		options.changeTimeFactor = parseFloat req.query.changeTimeFactor
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
	@client.routes options
	.then (results) ->
		for result in results
			result.duration /= 1000
			for part in result.parts
				part.from.when = part.from.when.getTime()   # unix timestamp
				part.to.when = part.to.when.getTime()   # unix timestamp

		response = reply results
		response.type 'application/json'
