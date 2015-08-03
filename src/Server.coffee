hapi =			require 'hapi'
vbb =			require 'vbb'

onLocations =	require './services/locations'
onRoutes =		require './services/routes'
onDepartures =	require './services/departures'





module.exports =



	accessId:		null
	server:			null

	client:			null   # VBB api client

	onLocations:	onLocations
	onRoutes:		onRoutes
	onDepartures:	onDepartures

	onOptions:		(req, reply) ->
		response = reply 'GET'
		response.header 'Accept', 'GET'



	init: (accessId, port) ->
		if not accessId? then throw new Error 'Missing `accessId` parameter'
		@client = vbb accessId

		if not port? then throw new Error 'Missing `port` parameter'
		@server = new hapi.Server()
		@server.connection
			port:	port
		@server.bind this

		# todo: `bind` option
		# todo: `auth` option
		# todo: `cors` option
		# todo: `validate` option?

		@server.route
			method:		'GET'
			path:		'/locations'
			handler:	@onLocations

		@server.route
			method:		'GET'
			path:		'/routes/{from}/{to}'
			handler:	@onRoutes

		@server.route
			method:		'GET'
			path:		'/departures/{id}'
			handler:	@onDepartures

		@server.route
			method:		'OPTIONS'
			path:		'/'
			handler:	@onOptions

		return this



	listen: (cb) ->
		@server.start cb

		return this
