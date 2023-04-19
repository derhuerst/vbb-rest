#!/usr/bin/env node

import {dirname, join} from 'node:path'
import {pipeline} from 'node:stream/promises'
import {createReadStream, createWriteStream} from 'node:fs'
import {copyFile} from 'node:fs/promises'
import _technicalDocsCli from '@derhuerst/technical-docs-cli'
const {
	createMarkdownRenderer,
	determineSyntaxStylesheetPath,
} = _technicalDocsCli
import {generateMarkdownApiDocs} from './api-docs.js'

const BASE_URL = new URL('..', import.meta.url).href
const API_DOCS_DEST = 'docs/api.md'
const DOCS_TO_RENDER = [
	['docs/readme.md', 'docs/index.html'],
	['docs/getting-started.md', 'docs/getting-started.html'],
	['docs/api.md', 'docs/api.html'],
]
const SYNTAX_STYLESHEET_URL = '/syntax.css'
const SYNTAX_STYLESHEET_SRC = determineSyntaxStylesheetPath('github')
const SYNTAX_STYLESHEET_DEST = 'docs/syntax.css'

{
	console.info('writing Markdown API docs to ' + API_DOCS_DEST)

	const destPath = new URL(API_DOCS_DEST, BASE_URL).pathname
	await pipeline(
		generateMarkdownApiDocs(),
		createWriteStream(destPath),
	)
}

const markdownRenderingCfg = {
	syntaxStylesheetUrl: SYNTAX_STYLESHEET_URL,
}
for (const [src, dest] of DOCS_TO_RENDER) {
	console.info(`rendering Markdown file ${src} to HTML file ${dest}`)

	const srcPath = new URL(src, BASE_URL).pathname
	const destPath = new URL(dest, BASE_URL).pathname
	// unfortunately, we can't use stream.pipeline right now
	// see https://github.com/unifiedjs/unified-stream/issues/1
	await new Promise((resolve, reject) => {
		createReadStream(srcPath)
		.once('error', reject)
		.pipe(createMarkdownRenderer(markdownRenderingCfg))
		.once('error', reject)
		.pipe(createWriteStream(destPath))
		.once('error', reject)
		.once('finish', resolve)
	})
}

{
	const srcPath = SYNTAX_STYLESHEET_SRC
	const destPath = new URL(SYNTAX_STYLESHEET_DEST, BASE_URL).pathname
	console.info(`copying syntax stylesheet from ${srcPath} to ${destPath}`)
	await copyFile(srcPath, destPath)
}
