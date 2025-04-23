export type PackageJsonExportsField = Record<
	string,
	Record<"require" | "import", Record<"default" | "types", string>>
>;
