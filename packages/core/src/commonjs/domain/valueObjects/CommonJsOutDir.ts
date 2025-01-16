import * as path from "node:path";

export class CommonJsOutDir {
	public readonly uri: string;
	constructor(private readonly distDirUri: string) {
		this.uri = path.join(this.distDirUri, "cjs");
	}
}
