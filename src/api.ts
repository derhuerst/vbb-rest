import { join as pathJoin } from "path";
import { to as parse } from "cli-native";

import createHafas from "vbb-hafas";
import createHealthCheck from "hafas-client-health-check";

import Redis from "ioredis";
import withCache from "cached-hafas-client";
import redisStore from "cached-hafas-client/stores/redis";

import createApi from "hafas-rest-api";
import serveStatic from "serve-static";

import { 
	lineRoute,
	linesRoute,
	mapsRoute,
	shapeRoute,
	stationRoute,
	stationsRoute  
} from "./routes";

const docsRoot = pathJoin(__dirname, "docs");

const berlinFriedrichstr = "900000100001";

let hafas = createHafas(
	// seems like `vbb-rest` is being redirected
	// pkg.name,
	// seems like these are being blocked
	// require('crypto').randomBytes(10).toString('hex'),
	"App/4.5.1 (iPhone; iOS 15.2; Scale/3.00)",
);
let healthCheck = createHealthCheck(hafas, berlinFriedrichstr);

if (process.env.REDIS_URL) {
	const redis = new Redis(process.env.REDIS_URL || null);
	hafas = withCache(hafas, redisStore(redis));

	const checkHafas = healthCheck;
	const checkRedis = () => new Promise((resolve, reject) => {
		setTimeout(reject, 1000, new Error("didn't receive a PONG"));
		redis.ping().then(
			res => resolve(res === "PONG"),
			reject,
		);
	});
	healthCheck = async () => (
		(await checkHafas()) === true &&
		(await checkRedis()) === true
	);
}

const modifyRoutes = (routes) => ({
	...routes,
	"/stations": stationsRoute,
	"/stations/:id": stationRoute,
	"/lines": linesRoute,
	"/lines/:id": lineRoute,
	"/shapes/:id": shapeRoute,
	"/maps/:type": mapsRoute,
});

const addHafasOpts = (opt, method, req) => {
	if (method === "journeys" && ("transferInfo" in req.query)) {
		opt.transferInfo = parse(req.query.transferInfo);
	}
};

const pkg = {
	description: "My TS version of VBB transport api",
	version: "1",
	homepage: "transport.robin.beer/"
};

export const config = {
	hostname: process.env.HOSTNAME || "localhost",
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: "test",
	description: pkg.description,
	version: pkg.version,
	homepage: pkg.homepage,
	docsLink: "https://github.com/derhuerst/vbb-rest/blob/5/docs/readme.md",
	openapiSpec: true,
	logging: true,
	aboutPage: false,
	addHafasOpts,
	etags: "strong",
	csp: "default-src 'none' style-src 'self' 'unsafe-inline' img-src https:",
	modifyRoutes,
	healthCheck,
};

export const api = createApi(hafas, config, (api) => {
	api.use("/", serveStatic(docsRoot, {
		extensions: ["html", "htm"],
	}));
});

