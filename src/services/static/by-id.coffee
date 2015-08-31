boom =			require 'boom'
vbbStatic =		require 'vbb-static'
parse =			require('underscore.parse').parse





module.exports = (req, reply) ->

	if not vbbStatic[req.params.method]
	 	reply boom.badRequest 'Invalid `method`.'
	if not req.params.id
	 	reply boom.badRequest 'Invalid `id`.'

	vbbStatic[req.params.method] true, parse req.params.id
	.then (results) ->
		response = reply results
		response.type 'application/json'
