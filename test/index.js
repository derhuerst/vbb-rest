import tape from 'tape'
import {parse as ndjsonParser} from 'ndjson'
import {fetchWithTestApi} from './util.js'
import {data as allStations} from '../lib/vbb-stations.js'

tape.test('/stations works', async (t) => {
	const someStationId = Object.keys(allStations)[0]

	{
		const {headers, data} = await fetchWithTestApi({}, '/stations', {
			headers: {
				'accept': 'application/json',
			},
		})
		t.equal(headers['content-type'], 'application/json')
		t.equal(typeof data, 'object')
		t.ok(data)
		t.ok(data[someStationId])
		t.equal(Object.keys(data).length, Object.keys(allStations).length)
	}

	{
		const {headers, data} = await fetchWithTestApi({}, '/stations', {
			headers: {
				'accept': 'application/x-ndjson',
			},
		})
		t.equal(headers['content-type'], 'application/x-ndjson')

		let nrOfStations = 0
		const parser = ndjsonParser()
		parser.end(data)
		for await (const station of parser) nrOfStations++

		t.equal(nrOfStations, Object.keys(allStations).length)
	}
})

tape.test('/stations?query=hauptbah works', async (t) => {
	const BERLIN_HBF = 'de:11000:900003201'

	{
		const {headers, data} = await fetchWithTestApi({}, '/stations?query=hauptbah', {
			headers: {
				'accept': 'application/json',
			},
		})
		t.equal(headers['content-type'], 'application/json')
		t.equal(typeof data, 'object')
		t.ok(data)
		t.ok(data[BERLIN_HBF])
		t.ok(Object.keys(data).length > 0)
	}

	{
		const {headers, data} = await fetchWithTestApi({}, '/stations?query=hauptbah', {
			headers: {
				'accept': 'application/x-ndjson',
			},
		})
		t.equal(headers['content-type'], 'application/x-ndjson')

		const stations = []
		const parser = ndjsonParser()
		parser.end(data)
		for await (const station of parser) stations.push(station)

		t.ok(stations.find(s => s.id === BERLIN_HBF))
		t.ok(Object.keys(stations).length > 0)
	}
})
