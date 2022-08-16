// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)

import {statSync} from 'node:fs'
const lines = require('vbb-lines/data.json')

// We don't have access to the publish date+time of the npm package,
// so we use the ctime of vbb-lines/data.json as an approximation.
// todo: this is brittle, find a better way, e.g. a build script
const timeModified = statSync(require.resolve('vbb-lines/data.json')).ctime

export {
	lines as data,
	timeModified,
}
