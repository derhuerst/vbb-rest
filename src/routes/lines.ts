
import computeEtag from "etag";
import { Request, Response, NextFunction } from "express";

import serveBuffer from "serve-buffer";
import { filterByKeys as createFilter } from "vbb-lines";
import { lines, timeModified } from "../lib/vbb-lines";
import { toNdjsonBuf } from "../lib/to-ndjson-buf";
import { stringToBool } from "../lib/string-to-bool";

const JSON_MIME = "application/json";
const NDJSON_MIME = "application/x-ndjson";

const asJson = Buffer.from(JSON.stringify(lines), "utf8");
const asJsonEtag = computeEtag(asJson);
const asNdjson = toNdjsonBuf(Object.entries(lines));
const asNdjsonEtag = computeEtag(asNdjson);

export function linesRoute(req: Request, res: Response, next: NextFunction) {
	const { variants, ...query } = req.query;
	const includeVariants = stringToBool(variants as string | undefined | null);

	const acceptedTypes = req.accepts([JSON_MIME, NDJSON_MIME]);
	if (acceptedTypes !== JSON_MIME && acceptedTypes !== NDJSON_MIME) {
		return next(`${JSON_MIME} or ${NDJSON_MIME}`);
	}

	res.setHeader("Last-Modified", timeModified.toUTCString());

	if (Object.keys(query).length === 0) {
		const data = acceptedTypes === JSON_MIME ? asJson : asNdjson;
		const etag = acceptedTypes === JSON_MIME ? asJsonEtag : asNdjsonEtag;
		serveBuffer(req, res, data, {timeModified, etag});
		return;
	}
	const fulfillsQuery = createFilter(query);

	const head = acceptedTypes === JSON_MIME ? "[" : "";
	const sep = acceptedTypes === JSON_MIME ? "," : "";
	const tail = acceptedTypes === JSON_MIME ? "]" : "";

	let isResponseEmpty = true;
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];

		if (!fulfillsQuery(line)) continue;

		if (!includeVariants) line = { ...line, variants: undefined };

		const json = JSON.stringify(line);

		let prefix = sep;

		if(isResponseEmpty) { 
			prefix = head;
			isResponseEmpty = false;
		}

		res.write(`${prefix}${json}`);
	}

	if(isResponseEmpty) {
		res.end(head + tail);
		return;
	}
		
	res.end(tail);
}

linesRoute.openapiPaths = {
	"/lines": {
		get: {
			summary: "Filters the lines in `vbb-lines`.",
			description: `\
**Filters the lines in [\`vbb-lines\`](https://npmjs.com/package/vbb-lines).**

Instead of receiving a JSON response, you can request [newline-delimited JSON](http://ndjson.org) by sending \`Accept: application/x-ndjson\`.`,
			parameters: [{
				name: "id",
				in: "query",
				description: "Filter by ID.",
				schema: {
					type: "string",
				},
			}, {
				name: "name",
				in: "query",
				description: "Filter by name.",
				schema: {
					type: "string",
				},
			}, {
				name: "operator",
				in: "query",
				description: "Filter by operator id. See [`agency.txt`](https://vbb-gtfs.jannisr.de/latest/agency.txt).",
				schema: {
					type: "string",
				},
			}, {
				name: "variants",
				in: "query",
				description: "Return stops/stations along the line?",
				schema: {
					type: "boolean",
					default: true,
				},
			}, {
				name: "mode",
				in: "query",
				description: "Filter by mode of transport as in [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md).",
				schema: {
					type: "string",
				},
			}, {
				name: "product",
				in: "query",
				description: "Filter by [product](https://github.com/public-transport/hafas-client/blob/5/p/vbb/products.js).",
				schema: {
					type: "string",
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

linesRoute.queryParameters = {
	"id": {
		description: "Filter by ID.",
		type: "string",
		defaultStr: "–",
	},
	"name": {
		description: "Filter by name.",
		type: "string",
		defaultStr: "–",
	},
	"operator": {
		description: "Filter by operator id. See [`agency.txt`](https://vbb-gtfs.jannisr.de/latest/agency.txt).",
		type: "string",
		defaultStr: "–",
	},
	"variants": {
		description: "Return stops/stations along the line?",
		type: "boolean",
		default: true,
	},
	"mode": {
		description: "Filter by mode of transport as in [*Friendly Public Transport Format* `1.2.1`](https://github.com/public-transport/friendly-public-transport-format/blob/1.2.1/spec/readme.md).",
		type: "string",
		defaultStr: "–",
	},
	"product": {
		description: "Filter by [product](https://github.com/public-transport/hafas-client/blob/5/p/vbb/products.js).",
		type: "string",
		defaultStr: "–",
	},
};

