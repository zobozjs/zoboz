// biome-ignore lint/style/useNodejsImportProtocol: backward-compatibility
import * as path from "path";
import { OutDir } from "../../../main/domain/valueObjects/OutDir";

export class DeclarationOutDir extends OutDir {
	constructor(distDirUri: string) {
		super(path.join(distDirUri, "dts"));
	}
}
