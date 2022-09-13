import computeEtag from "etag";
import serveBuffer from "serve-buffer";
import { filterByKeys as createFilter } from "vbb-stations";
import { stations, timeModified } from "../lib/vbb-stations";
import { toNdjsonBuf } from "../lib/to-ndjson-buf";
import { to as parse } from "cli-native";

import autocomplete from "vbb-stations-autocomplete";
import { NextFunction, Request, Response } from "express";
import { Station } from "../models/stations";


const JSON_MIME = "application/json";
const NDJSON_MIME = "application/x-ndjson";

const asJson = Buffer.from(JSON.stringify(stations), "utf8");
const asJsonEtag = computeEtag(asJson);
const asNdjson = toNdjsonBuf(Object.entries(stations));
const asNdjsonEtag = computeEtag(asNdjson);


const complete = (req: Request, res: Response, next: NextFunction, q, onStation, onEnd) => {

	req.query;
	let limit = 3;
	if (q.limit) {
		limit = parseInt(q.limit, 10);
	}
	limit = q.results && parseInt(q.results) || 3;
	const fuzzy = parse(q.fuzzy) === true;
	const completion = parse(q.completion) !== false;
	const results = autocomplete(q.query, limit, fuzzy, completion);

	for (const result of results) {
		const station = stations[result.id];
		if (!station) continue;

		Object.assign(result, station);
		onStation(result);
	}
	onEnd();
};

const filter = (req, res, next, q, onStation, onEnd) => {
	const selector = Object.create(null);
	for (const prop in q) selector[prop] = parse(q[prop]);
	const filter = createFilter(selector);

	for (const station of Object.values(stations)) {
		if (filter(station)) onStation(station);
	}
	onEnd();
};

export const stationsRoute = (req: Request, res: Response, next: NextFunction) => {
	const t = req.accepts([JSON_MIME, NDJSON_MIME]);
	if (t !== JSON_MIME && t !== NDJSON_MIME) {
		return next(`${JSON} or  ${NDJSON_MIME}`);
	}

	res.setHeader("Last-Modified", timeModified.toUTCString());

	const head = t === JSON_MIME ? "{\n" : "";
	const sep = t === JSON_MIME ? ",\n" : "\n";
	const tail = t === JSON_MIME ? "\n}\n" : "\n";
	let i = 0;
	const onStation = (s: Station) => {
		const j = JSON.stringify(s);
		const field = t === JSON_MIME ? `"${s.id}":` : "";
		res.write(`${i++ === 0 ? head : sep}${field}${j}`);
	};
	const onEnd = () => {
		if (i > 0) res.end(tail);
		else res.end(head + tail);
	};

	const q = req.query;
	if (Object.keys(q).length === 0) {
		const data = t === JSON_MIME ? asJson : asNdjson;
		const etag = t === JSON_MIME ? asJsonEtag : asNdjsonEtag;
		serveBuffer(req, res, data, {timeModified, etag});
	} else if (q.query) {
		complete(req, res, next, q, onStation, onEnd);
	} else {
		filter(req, res, next, q, onStation, onEnd);
	}
};

stationsRoute.openapiPaths = {
	"/stations": {
		get: {
			summary: "Autocompletes stops/stations by name or filters stops/stations.",
			description: `\
If the \`query\` parameter is used, it will use [\`vbb-stations-autocomplete\`](https://npmjs.com/package/vbb-stations-autocomplete) to autocomplete stops/stations by name. Otherwise, it will filter the stops/stations in [\`vbb-stations\`](https://npmjs.com/package/vbb-stations).

Instead of receiving a JSON response, you can request [newline-delimited JSON](http://ndjson.org) by sending \`Accept: application/x-ndjson\`.`,
			parameters: [{
				name: "query",
				in: "query",
				description: "Find stations by name using [`vbb-stations-autocomplete`](https://npmjs.com/package/vbb-stations-autocomplete).",
				schema: {
					type: "string",
				},
			}, {
				name: "limit",
				in: "query",
				description: "*If `query` is used:* Return at most `n` stations.",
				schema: {
					type: "integer",
					default: 3,
				},
			}, {
				name: "fuzzy",
				in: "query",
				description: "*If `query` is used:* Find stations despite typos.",
				schema: {
					type: "boolean",
					default: false,
				},
			}, {
				name: "completion",
				in: "query",
				description: "*If `query` is used:* Autocomplete stations.",
				schema: {
					type: "boolean",
					default: true,
				},
			}],
			responses: {
				"2XX": {
					description: "An array of stops/stations, in the [`vbb-stations` format](https://github.com/derhuerst/vbb-stations/blob/master/readme.md).",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {type: "object"}, // todo
							},
							// todo: example(s)
						},
					},
				},
			},
		},
	},
};

stationsRoute.queryParameters = {
	query: {
		description: "Find stations by name using [`vbb-stations-autocomplete`](https://npmjs.com/package/vbb-stations-autocomplete).",
		type: "string",
		defaultStr: "–",
	},
	limit: {
		description: "*If `query` is used:* Return at most `n` stations.",
		type: "number",
		default: 3,
	},
	fuzzy: {
		description: "*If `query` is used:* Find stations despite typos.",
		type: "boolean",
		default: false,
	},
	completion: {
		description: "*If `query` is used:* Autocomplete stations.",
		type: "boolean",
		default: true,
	},
};