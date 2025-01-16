import * as path from "node:path";

export class DeclarationOutDir {
	public readonly uri: string;
	constructor(private readonly distDirUri: string) {
		this.uri = path.join(this.distDirUri, "dts");
	}
}
