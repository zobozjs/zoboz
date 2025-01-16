import * as path from "node:path";

export class ModuleOutDir {
	public readonly uri: string;
	constructor(private readonly distDirUri: string) {
		this.uri = path.join(this.distDirUri, "mjs");
	}
}
