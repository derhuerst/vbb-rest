const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const urls = {
	// eslint-disable-next-line no-mixed-spaces-and-tabs
	  'bvg': 'https://www.bvg.de/de/index.php?section=downloads&cmd=58&download=399'
	, 'bvg-tram': 'https://www.bvg.de/de/index.php?section=downloads&cmd=58&download=401'
	, 'bvg-night': 'https://www.bvg.de/de/index.php?section=downloads&cmd=58&download=398'
	, 'bvg-refugees': 'https://www.bvg.de/index.php?section=downloads&download=1842'
	, 'vbb': 'http://images.vbb.de/assets/downloads/file/362037.pdf'
	, 'brb': 'http://images.vbb.de/assets/downloads/file/2000.pdf'
	, 'cb': 'http://images.vbb.de/assets/downloads/file/2004.pdf'
	, 'cb-night': 'http://images.vbb.de/assets/downloads/file/2002.pdf'
	, 'ff': 'http://images.vbb.de/assets/downloads/file/2018.pdf'
	, 'p': 'http://images.vbb.de/assets/downloads/file/3721.pdf'
	, 'p-night': 'http://images.vbb.de/assets/downloads/file/2038.pdf'
}



const mapsRoute = (req, res, next) => {
	const type = req.params.type
	if (!(type in urls)) return next(err400('Invalid type.'))
	res.redirect(urls[type])
	res.end(urls[type])
}

mapsRoute.openapiPaths = {
	'/maps/{type}': {
		get: {
			summary: 'Redirects to PDF public transport maps.',
			description: `\
**Redirects to PDF public transport maps.**`,
			parameters: [{
				name: 'type',
				in: 'path',
				description: 'map type',
				required: true,
				schema: {
					type: 'string',
					enum: Object.keys(urls),
				},
			}],
		},
	},
}

export {
	mapsRoute as route,
}
