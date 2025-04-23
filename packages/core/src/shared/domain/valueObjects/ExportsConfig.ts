import type { SrcDir } from "@shared/domain/valueObjects/SrcDir";

export class ExportsConfig {
	private readonly items: [string, string][];

	constructor(
		private readonly srcDir: SrcDir,
		private readonly value: Record<string, string>,
	) {
		if (!value["."]) {
			throw new Error(
				'"exports" in zoboz.config.ts must have a "." entry; e.g. { ".": "./src/index.ts" }.',
			);
		}

		const items = Object.entries(value);
		this.items = items;

		for (const [k, v] of items) {
			if (!k.startsWith("./") && k !== ".") {
				throw new Error(
					`"exports" in zoboz.config.(ts|mjs) must only have entries that start with "./"; e.g. { "./extend": "${this.srcDir.uri}/extend.ts" }`,
				);
			}

			if (!v.startsWith(this.srcDir.uri)) {
				throw new Error(
					`"exports" in zoboz.config.(ts|mjs) must only have entries that start with "${this.srcDir.uri}"; e.g. { ".": "${this.srcDir.uri}/index.ts" }`,
				);
			}
		}
	}

	entries(): [string, string][] {
		return this.items;
	}
}
