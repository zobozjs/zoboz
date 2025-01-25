export class RelativeSpecifier {
	public readonly uri: string;

	constructor(uri: string) {
		this.uri = this.reformat(uri);
	}

	private reformat(uri: string) {
		const posixUri = uri.split("\\").join("/");
		return posixUri.startsWith("./") || posixUri.startsWith("../")
			? posixUri
			: `./${posixUri}`;
	}
}
