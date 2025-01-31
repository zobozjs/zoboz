class NodeVersion {
	constructor() {
		const [major, minor, patch] = process.version
			.slice(1)
			.split(".")
			.map(Number);

		this.major = major;
		this.minor = minor;
		this.patch = patch;

		this.versionString = process.version;

		this.leastSupportedMajor = 14;
	}

	isSupported() {
		return this.major >= this.leastSupportedMajor;
	}

	doesSupportTsBasedConfig() {
		return this.major >= 16;
	}

	doesSupportModuleRegister() {
		return this.major >= 22;
	}
}

export const nodeVersion = new NodeVersion();

if (!nodeVersion.isSupported()) {
	const issue = `Node version ${nodeVersion.versionString} is not supported.`;
	const cta = `Please use Node.js ${nodeVersion.leastSupportedMajor} or later`;
	console.error([issue, cta].join("\n"));
	process.exit(1);
}
