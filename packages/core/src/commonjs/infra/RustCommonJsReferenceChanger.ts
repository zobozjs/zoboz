import { RustCommonJsReferenceChanger as RustCommonJsReferenceChanger_ } from "zoboz_core_napi";
import type { CommonJsReferenceChanger } from "../domain/interfaces/CommonJsReferenceChanger";

export class RustCommonJsReferenceChanger implements CommonJsReferenceChanger {
	private readonly commonJsReferenceChanger: RustCommonJsReferenceChanger_;

	constructor() {
		this.commonJsReferenceChanger = RustCommonJsReferenceChanger_.create();
	}

	async changeReferencesInDir(cjsdir: string): Promise<void> {
		return this.commonJsReferenceChanger.changeReferencesInDir(cjsdir);
	}
}
