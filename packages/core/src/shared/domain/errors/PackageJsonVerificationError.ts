export class PackageJsonVerificationError extends Error {
	constructor() {
		super(
			"Package.json does not match the expected values based on your zoboz.config.ts.",
		);
	}
}
