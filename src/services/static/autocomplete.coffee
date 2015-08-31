boom =			require 'boom'
Autocomplete =	require 'vbb-stations-autocomplete'
vbbStatic =		require 'vbb-static'
Q =				require 'q'





autocomplete = Autocomplete()

module.exports = (req, reply) ->

	if not req.query.input
		reply boom.badRequest 'Missing `input` parameter.'

	autocomplete.suggest req.query.input
	.then (results) ->
		return Q.all results.map (result) ->
			return vbbStatic.stations true, result.id
			.then (results) -> results[0]
	.then (results) ->
		response = reply results
		response.type 'application/json'
