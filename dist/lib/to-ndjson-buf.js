"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNdjsonBuf = void 0;
const toNdjsonBuf = (items) => {
    let bytes = 0;
    const chunks = items.map((item, i) => {
        let sep = "\n";
        if (i === 0) {
            sep = "";
        }
        const buf = Buffer.from(sep + JSON.stringify(item), "utf8");
        bytes += buf.length;
        return buf;
    });
    return Buffer.concat(chunks, bytes);
};
exports.toNdjsonBuf = toNdjsonBuf;
