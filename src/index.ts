// import {api, config} = require("./api");

// api.listen(config.port, (err: Error) => {
// 	const {logger} = api.locals;
// 	if (err) {
// 		logger.error(err);
// 		process.exit(1);
// 	}
// 	logger.info(`Listening on ${config.hostname}:${config.port}.`);
// });


import { lines } from "./lib/vbb-lines";

console.log(lines.length);