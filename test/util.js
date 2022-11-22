'use strict'

const createApi = require('hafas-rest-api')
const getPort = require('get-port')
const {createServer} = require('http')
const {promisify} = require('util')
const axios = require('axios')
const pkg = require('../package.json')
const {config, hafas} = require('../api')

// adapted from https://github.com/derhuerst/db-rest/blob/5fc72f098e2a7b55f775ec9b1b87703f60de0d84/test/util.js#L11-L44
const createTestApi = async (cfg) => {
	cfg = {
		...config,
		hostname: 'localhost',
		name: 'test',
		version: '1.2.3a',
		homepage: 'http://example.org',
		description: 'test API',
		docsLink: 'https://example.org',
		logging: false,
		...cfg,
	}

	const api = createApi(hafas, cfg, () => {})
	const server = createServer(api)

	const port = await getPort()
	await promisify(server.listen.bind(server))(port)

	const stop = () => promisify(server.close.bind(server))()
	const fetch = (path, opt = {}) => {
		opt = Object.assign({
			method: 'get',
			baseURL: `http://localhost:${port}/`,
			url: path,
			timeout: 5000
		}, opt)
		return axios(opt)
	}
	return {stop, fetch}
}

const fetchWithTestApi = async (cfg, path, opt = {}) => {
	const {fetch, stop} = await createTestApi(cfg)
	const res = await fetch(path, opt)
	await stop()
	return res
}

module.exports = {
	createTestApi,
	fetchWithTestApi,
}
