import * as path from "path";
import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository";
import type { DistDir } from "@shared/domain/valueObjects/DistDir";
import { OutDir } from "@shared/domain/valueObjects/OutDir";

export class DeclarationOutDir extends OutDir {
	constructor(filesRepository: FilesRepository, distDir: DistDir) {
		super(filesRepository, path.join(distDir.uri, "dts"));
	}
}
