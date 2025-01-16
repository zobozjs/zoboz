type From = string;
type To = string;

export class UriReformatter {
	constructor(
		private readonly mapping: Record<From, To>,
		private readonly elseExt?: string | null,
	) {}

	reformat(uri: string): string {
		for (const [from, to] of Object.entries(this.mapping)) {
			if (!uri.endsWith(from)) {
				continue;
			}

			if (uri.endsWith(from)) {
				return `${uri.slice(0, -from.length)}${to}`;
			}
		}

		if (this.elseExt === undefined) {
			return uri;
		}

		if (this.elseExt === null) {
			const extensionRemover = new UriReformatter({
				".d.ts": "",
				".js": "",
				".mjs": "",
				".cjs": "",
				".json": "",
			});

			return extensionRemover.reformat(uri);
		}

		if (uri.endsWith(this.elseExt)) {
			return uri;
		}

		return `${uri}${this.elseExt}`;
	}
}
