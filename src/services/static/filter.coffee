boom =			require 'boom'
vbbStatic =		require 'vbb-static'





module.exports = (req, reply) ->

	if not vbbStatic[req.params.method]
		reply boom.badRequest 'Invalid `method`.'

	filter = {}
	for key, value in req.query
		if req.query.hasOwnProperty key
			filter[key] = value

	vbbStatic[req.params.method] true, filter
	.then (results) ->
		response = reply results
		response.type 'application/json'
