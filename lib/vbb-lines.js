'use strict'

const {statSync} = require('fs')
const lines = require('vbb-lines/data.json')

// We don't have access to the publish date+time of the npm package,
// so we use the ctime of vbb-lines/data.json as an approximation.
// todo: this is brittle, find a better way, e.g. a build script
const timeModified = statSync(require.resolve('vbb-lines/data.json')).ctime

module.exports = {
	data: lines,
	timeModified,
}
