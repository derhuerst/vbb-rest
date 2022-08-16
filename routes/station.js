import linesAt from 'vbb-lines-at'
import {data as stations} from '../lib/vbb-stations.js'

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
Returns a stop/station from [\`vbb-stations@7\`](https://github.com/derhuerst/vbb-stations/tree/7.3.2).`,
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
					description: 'A stop/station, in the [`vbb-stations@7` format](https://github.com/derhuerst/vbb-stations/blob/7.3.2/readme.md).',
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
