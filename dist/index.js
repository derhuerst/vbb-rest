"use strict";
// import {api, config} = require("./api");
Object.defineProperty(exports, "__esModule", { value: true });
// api.listen(config.port, (err: Error) => {
// 	const {logger} = api.locals;
// 	if (err) {
// 		logger.error(err);
// 		process.exit(1);
// 	}
// 	logger.info(`Listening on ${config.hostname}:${config.port}.`);
// });
const vbb_lines_1 = require("./lib/vbb-lines");
console.log(vbb_lines_1.lines.length);
