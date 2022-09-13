import shapes from "vbb-shapes";

export const shapeRoute = (req, res, next) => {
	const id = req.params.id;

	shapes(id)
		.then((shape) => {
			res.json(shape);
			next();
		})
		.catch(() => {
			const err = new Error("Shape not found.");
			next(err);
		});
};

shapeRoute.openapiPaths = {
	"/shapes/{id}": {
		get: {
			summary: "Returns a shape from `vbb-shapes`.",
			description: "\
Output from [`require('vbb-shapes')(id)`](https://github.com/derhuerst/vbb-shapes#usage).",
			parameters: [{
				name: "id",
				in: "path",
				description: "Shape ID.",
				required: true,
				schema: {
					type: "string",
				},
			}],
			responses: {
				"2XX": {
					description: "A shape, in the [`vbb-shapes` format](https://github.com/derhuerst/vbb-shapes/blob/master/readme.md).",
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
