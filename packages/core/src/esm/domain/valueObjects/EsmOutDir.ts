import * as path from "path";
import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository";
import type { DistDir } from "@shared/domain/valueObjects/DistDir";
import { OutDir } from "@shared/domain/valueObjects/OutDir";

export class EsmOutDir extends OutDir {
	constructor(distDir: DistDir) {
		super(path.join(distDir.uri, "esm"));
	}
}
