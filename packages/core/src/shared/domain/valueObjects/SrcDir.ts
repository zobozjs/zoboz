export class SrcDir {
	constructor(public readonly uri: string) {
		if (!uri.startsWith("./")) {
			throw new Error('srcDir must start with "./"');
		}
	}
}
