// biome-ignore lint/style/useNodejsImportProtocol: backward-compatibility
import { register } from "module";
// biome-ignore lint/style/useNodejsImportProtocol: backward-compatibility
import * as path from "path";
// biome-ignore lint/style/useNodejsImportProtocol: backward-compatibility
import { pathToFileURL } from "url";

register(
	path.resolve(import.meta.dirname, "../bin/tsload.mjs"),
	pathToFileURL("."),
);
