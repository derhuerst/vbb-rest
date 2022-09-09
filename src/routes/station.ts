import { Lines } from "../models/lines";
import { linesAt } from "vbb-lines-at";
import { stations } from "../lib/vbb-stations";
import { Station } from "../models/stations";

interface StationResponse extends Station {
	lines: Lines;
}

export const stationRoute = (req, res, next) => {
	const id = req.params.id.trim();
	const station = stations[id] as StationResponse;
	if (!station) return next("Station not found.");

	station.lines = linesAt[station.id];
	res.json(station);
	// todo: how to ignore/skip the next handler for the same route?
	next("/stops/:id"); // this doesn't work
};

stationRoute.openapiPaths = {
	"/stations/{id}": {
		get: {
			summary: "Returns a stop/station from `vbb-stations`.",
			description: "\
Returns a stop/station from [`vbb-stations`](https://npmjs.com/package/vbb-stations).",
			parameters: [{
				name: "id",
				in: "path",
				description: "Stop/station ID.",
				required: true,
				schema: {
					type: "string",
				},
			}],
			responses: {
				"2XX": {
					description: "A stop/station, in the [`vbb-stations` format](https://github.com/derhuerst/vbb-stations/blob/master/readme.md).",
					content: {
						"application/json": {
							schema: {
								type: "object", // todo
							},
							// todo: example(s)
						},
					},
				},
			},
		},
	},
};
