import * as path from "path";
import { OutDir } from "../../../main/domain/valueObjects/OutDir";

export class ModuleOutDir extends OutDir {
	constructor(distDirUri: string) {
		super(path.join(distDirUri, "esm"));
	}
}
