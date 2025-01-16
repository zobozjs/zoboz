export interface ModuleReferenceChanger {
	changeReferencesInDir(mjsdir: string): Promise<void>;
}
