import * as path from "path";
import type { DistDir } from "@shared/domain/valueObjects/DistDir";
import { OutDir } from "@shared/domain/valueObjects/OutDir";

export class DtsOutDir extends OutDir {
	constructor(moduleType: "cjs" | "esm", distDir: DistDir) {
		super(path.join(distDir.uri, moduleType, "dts"));
	}
}
