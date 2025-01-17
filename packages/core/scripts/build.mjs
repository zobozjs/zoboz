import { build } from "../src/index.js";
import buildConfig from "../zoboz.config.js";

// @ts-expect-error
build(buildConfig, true);
