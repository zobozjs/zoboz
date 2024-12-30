import { register } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

register(
	path.resolve(import.meta.dirname, "../bin/tsload.mjs"),
	pathToFileURL("."),
);
