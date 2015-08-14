boom =			require 'boom'





module.exports = (req, reply) ->

	if not req.query.query?
		reply boom.badRequest 'Missing `query` parameter'

	if req.query.results?
		limit = parseInt req.query.results

	@client.autocomplete req.query.query, limit
	.then (results) ->
		response = reply results
		response.type 'application/json'
