import * as path from "node:path";
import { OutDir } from "../../../main/domain/valueObjects/OutDir";

export class CommonJsOutDir extends OutDir {
	constructor(distDirUri: string) {
		super(path.join(distDirUri, "cjs"));
	}
}
