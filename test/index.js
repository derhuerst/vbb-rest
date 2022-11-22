'use strict'

const tape = require('tape')
const {fetchWithTestApi} = require('./util')

tape.test('/stations works', async (t) => {
	{
		const {headers} = await fetchWithTestApi({}, '/stations', {
			headers: {
				'accept': 'application/json',
			},
		})
		t.equal(headers['content-type'], 'application/json')
	}

	{
		const {headers} = await fetchWithTestApi({}, '/stations', {
			headers: {
				'accept': 'application/x-ndjson',
			},
		})
		t.equal(headers['content-type'], 'application/x-ndjson')
	}
})

tape.test('/stations?query=hauptbah works', async (t) => {
	{
		const {headers} = await fetchWithTestApi({}, '/stations?query=hauptbah', {
			headers: {
				'accept': 'application/json',
			},
		})
		t.equal(headers['content-type'], 'application/json')
	}

	{
		const {headers} = await fetchWithTestApi({}, '/stations?query=hauptbah', {
			headers: {
				'accept': 'application/x-ndjson',
			},
		})
		t.equal(headers['content-type'], 'application/x-ndjson')
	}
})
