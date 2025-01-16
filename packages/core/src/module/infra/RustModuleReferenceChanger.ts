import { RustModuleReferenceChanger as RustModuleReferenceChanger_ } from "zoboz_core_napi";
import type { ModuleReferenceChanger } from "../domain/interfaces/ModuleReferenceChanger";

export class RustModuleReferenceChanger implements ModuleReferenceChanger {
	private readonly moduleReferenceChanger: RustModuleReferenceChanger_;

	constructor() {
		this.moduleReferenceChanger = RustModuleReferenceChanger_.create();
	}

	async changeReferencesInDir(mjsdir: string): Promise<void> {
		return this.moduleReferenceChanger.changeReferencesInDir(mjsdir);
	}
}
