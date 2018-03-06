'use strict'

const msg = 'This API is deprecated, use https://2.vbb.transport.rest. Refer to https://github.com/derhuerst/vbb-rest/blob/2/docs/index.md for more info.'

const route = (req, res, next) => {
	if (!res.headersSent) res.set('Warning', msg)

	if (Math.random() < .2) {
		const err = new Error(msg)
		err.code = 400
		err.isDeprecationError = true
		res.status(400).json({error: true, msg})
	} else next()
}

module.exports = route
