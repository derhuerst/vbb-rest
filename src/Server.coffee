hapi =			require 'hapi'
vbb =			require 'vbb'
httpBasicAuth =	require 'hapi-auth-basic'

onLocations =	require './services/locations'
onRoutes =		require './services/routes'
onDepartures =	require './services/departures'





auth = (req, user, pw, cb) ->
	cb null, true,
		apiKey: user


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



	init: (cert, key, port, logger) ->
		@client = vbb()

		if not cert? then throw new Error 'Missing `cert` parameter'
		if not key? then throw new Error 'Missing `key` parameter'
		if not port? then throw new Error 'Missing `port` parameter'
		@server = new hapi.Server()
		@server.connection
			tls:
				cert:	cert
				key:	key
			port:		port
		@server.bind this
		@server.register httpBasicAuth, (err) =>
			@server.auth.strategy 'api-token', 'basic', true,
				validateFunc: auth

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
