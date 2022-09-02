import { lines } from "../lib/vbb-lines";
import * as express from "express";

const lineRoute = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	const id = req.params.id.trim();
	const line = lines.find(l => l.id === id);
	if (!line) return next(err400("Line not found."));

	res.json(line)
		.catch((err) => {
			next(err);
			throw err;
		});
};

lineRoute.openapiPaths = {
	"/lines/{id}": {
		get: {
			summary: "Returns a line from `vbb-lines`.",
			description: "\
Returns a **line from [`vbb-lines`](https://npmjs.com/package/vbb-lines)**.",
			parameters: [{
				name: "id",
				in: "path",
				description: "Line ID.",
				required: true,
				schema: {
					type: "string",
				},
			}],
			responses: {
				"2XX": {
					description: "A line, in the [`vbb-lines` format](https://github.com/derhuerst/vbb-lines/blob/master/readme.md).",
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

module.exports = lineRoute;
