export const nodeVersion = Number(process.version.slice(1).split(".")[0]);

if (nodeVersion < 14) {
	console.error(
		`Node version ${nodeVersion} is not supported. Please use Node.js 14 or later.`,
	);
	process.exit(1);
}

export function doesNodeSupportTsConfig() {
	return nodeVersion >= 16;
}

export function doesNodeSupportModuleRegister() {
	return nodeVersion >= 22;
}
