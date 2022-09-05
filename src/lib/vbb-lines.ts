import { statSync } from "node:fs";
import l from "vbb-lines/data.json";
import { Lines } from "../models/lines";

export const lines = l as Lines;

export const timeModified = statSync(require.resolve("vbb-lines/data.json")).ctime;