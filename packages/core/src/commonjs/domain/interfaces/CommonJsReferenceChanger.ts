export interface CommonJsReferenceChanger {
	changeReferencesInDir(cjsdir: string): Promise<void>;
}
