export class DistDir {
	constructor(public readonly uri: string) {
		if (!uri.startsWith("./")) {
			throw new Error('distDir must start with "./"');
		}
	}
}
