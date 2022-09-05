
import { statSync } from "node:fs";
import s from "vbb-stations/full.json";
import { Stations } from "../models/stations";

export const stations = s as Stations;

export const timeModified = statSync(require.resolve("vbb-stations/full.json")).ctime;