export interface ExtensionChanger {
	changeInDir(
		dir: string,
		fromExtension: string,
		toExtension: string,
	): Promise<void>;
}
