// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module'
const require = createRequire(import.meta.url)

import linesAt from 'vbb-lines-at'
import {data as stations} from '../lib/vbb-stations.js'

const stationsPkg = require('vbb-stations/package.json')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const ibnr = /^\d{6,}$/

const stationRoute = (req, res, next) => {
	const id = req.params.id.trim()
	const station = stations[id]
	if (!station) return next(err400('Station not found.'))

	station.lines = linesAt[station.id]
	res.json(station)
	// todo: how to ignore/skip the next handler for the same route?
	next('/stops/:id') // this doesn't work
}

stationRoute.openapiPaths = {
	'/stations/{id}': {
		get: {
			summary: 'Returns a stop/station from `vbb-stations`.',
			description: `\
Returns a stop/station from [\`vbb-stations@${stationsPkg.version}\`](https://github.com/derhuerst/vbb-stations/tree/${stationsPkg.version}).`,
			parameters: [{
				name: 'id',
				in: 'path',
				description: 'Stop/station ID.',
				required: true,
				schema: {
					type: 'string',
				},
			}],
			responses: {
				'2XX': {
					description: `A stop/station, in the [\`vbb-stations@${stationsPkg.version}\` format](https://github.com/derhuerst/vbb-stations/blob/${stationsPkg.version}/readme.md).`,
					content: {
						'application/json': {
							schema: {
								type: 'object', // todo
							},
							// todo: example(s)
						},
					},
				},
			},
		},
	},
}

export {
	stationRoute as route,
}
