const toNdjsonBuf = (items) => {
	const chunks = []
	let i = 0, bytes = 0
	for (const item of items) {
		const sep = i++ === 0 ? '' : '\n'
		const buf = Buffer.from(sep + JSON.stringify(item), 'utf8')
		chunks.push(buf)
		bytes += buf.length
	}
	return Buffer.concat(chunks, bytes)
}

export {
	toNdjsonBuf,
}
