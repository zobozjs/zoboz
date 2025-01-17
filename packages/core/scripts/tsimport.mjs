import { register } from "module";
import * as path from "path";
import { pathToFileURL } from "url";

register(
	path.resolve(import.meta.dirname, "../bin/deps/tsload.mjs"),
	pathToFileURL("."),
);
