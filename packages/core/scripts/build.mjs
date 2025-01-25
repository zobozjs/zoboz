import * as url from "url";

// @ts-expect-error It is still not available in the types, since it is only a Release Candidate
const { register } = await import("module");
register("./bin/deps/tsload.mjs", url.pathToFileURL("./"));

const { build } = await import("../src/index.js");
const buildConfig = await import("../zoboz.config.js");

// @ts-expect-error
build(buildConfig.default, true);
