import { RustExtensionChanger as RustExtensionChanger_ } from "zoboz_core_napi";
import type { ExtensionChanger } from "../domain/interfaces/ExtensionChanger";

export class RustExtensionChanger implements ExtensionChanger {
	private readonly extensionChanger: RustExtensionChanger_;

	constructor() {
		this.extensionChanger = RustExtensionChanger_.create();
	}

	async changeInDir(
		dir: string,
		fromExtension: string,
		toExtension: string,
	): Promise<void> {
		this.extensionChanger.changeInDir(dir, fromExtension, toExtension);
	}
}
