import * as path from "path";
import type { DistDir } from "@shared/domain/valueObjects/DistDir";
import { OutDir } from "@shared/domain/valueObjects/OutDir";

export class CjsOutDir extends OutDir {
	constructor(distDir: DistDir) {
		super(path.join(distDir.uri, "cjs", "js"));
	}
}
