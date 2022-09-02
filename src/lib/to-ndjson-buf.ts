
export const toNdjsonBuf = (items: unknown[]) => {
	let bytes = 0;

	const chunks = items.map((item: unknown, i: number) => {
		let sep = "\n";
		if(i === 0) {
			sep = "";
		}

		const buf = Buffer.from(sep + JSON.stringify(item), "utf8");

		bytes += buf.length;

		return buf;
	});
	
	return Buffer.concat(chunks, bytes);
};
	