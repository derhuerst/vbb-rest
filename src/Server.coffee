hapi =				require 'hapi'
httpBasicAuth =		require 'hapi-auth-basic'
hafas =				require 'vbb-hafas'

services =			require './services'





auth = (req, user, pw, cb) ->
	cb null, true,
		apiKey: user


module.exports =



	server:			null
	hafas:			null   # VBB api client

	logger:			null

	onOptions:		(req, reply) ->
		response = reply 'GET'
		response.header 'Accept', 'GET'



	init: (cert, key, port, logger) ->
		@hafas = hafas()

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
			handler:	services.hafas.locations

		@server.route
			method:		'GET'
			path:		'/routes/{from}/{to}'
			handler:	services.hafas.routes

		@server.route
			method:		'GET'
			path:		'/{method}/{id}'
			handler:	services.static.byId

		@server.route
			method:		'GET'
			path:		'/stations/{id}/departures'
			handler:	services.static.departures

		@server.route
			method:		'GET'
			path:		'/stations/autocomplete'
			handler:	services.static.autocomplete

		@server.route
			method:		'GET'
			path:		'/{method}'
			handler:	services.static.filter

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
