export class ExportsConfig {
	constructor(private readonly value: Record<string, string>) {
		if (!value["."]) {
			throw new Error(
				'"exports" in zoboz.config.ts must have a "." entry; e.g. { ".": "./src/index.ts" }.',
			);
		}
	}

	getRootExport(): string {
		return this.value["."];
	}

	entries(): [string, string][] {
		return Object.entries(this.value);
	}
}
