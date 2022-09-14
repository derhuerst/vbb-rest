import { lines } from "../lib/vbb-lines";
import { Request, Response, NextFunction } from "express";
import { sendError400 } from "../error-handling";

export async function lineRoute (req: Request, res: Response, next: NextFunction) {
	const id = req.params.id.trim();

	if(!id) sendError400(res, "Missing line ID");
	
	const line = lines.find(l => l.id === id);
	if (!line) sendError400(res, "Line not found");

	try {
		res.json(line);
	} catch(err) {
		next(err);
	}	
}

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
