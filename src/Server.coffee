hapi =			require 'hapi'
vbb =			require 'vbb'

onLocations =	require './services/locations'
onRoutes =		require './services/routes'
onDepartures =	require './services/departures'





module.exports =



	server:			null
	client:			null   # VBB api client

	logger:			null

	onLocations:	onLocations
	onRoutes:		onRoutes
	onDepartures:	onDepartures

	onOptions:		(req, reply) ->
		response = reply 'GET'
		response.header 'Accept', 'GET'



	init: (token, port, logger) ->
		if not token? then throw new Error 'Missing `token` parameter'
		@client = vbb token

		if not port? then throw new Error 'Missing `port` parameter'
		@server = new hapi.Server()
		@server.connection
			port:	port
		@server.bind this

		if not logger? then throw new Error 'Missing `logger` parameter'
		@logger = logger

		# todo: `bind` option
		# todo: `auth` option
		# todo: `cors` option
		# todo: `validate` option?

		# todo: API client timeouts
		# todo: http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#rate-limiting
		# todo: http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#authentication

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

	stop: (cb) ->
		@server.stop cb
		return this
