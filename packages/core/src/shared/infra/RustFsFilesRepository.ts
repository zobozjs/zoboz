import { RustFsFilesRepository as RustFsFilesRepository_ } from "zoboz_core_napi";
import type { FilesRepository } from "../domain/interfaces/FilesRepository";

export class RustFsFilesRepository implements FilesRepository {
	private readonly filesRepository: RustFsFilesRepository_;

	constructor() {
		this.filesRepository = RustFsFilesRepository_.create();
	}

	async getPackageDir(): Promise<string> {
		return this.filesRepository.getPackageDir();
	}

	async isDir(uri: string): Promise<boolean> {
		return this.filesRepository.isDir(uri);
	}

	async mv(fromUri: string, toUri: string): Promise<void> {
		return this.filesRepository.mv(fromUri, toUri);
	}

	async remove(uri: string): Promise<void> {
		return this.filesRepository.remove(uri);
	}

	async children(uri: string): Promise<string[]> {
		return this.filesRepository.children(uri);
	}

	async read(uri: string): Promise<string> {
		return this.filesRepository.read(uri);
	}

	async write(uri: string, content: string): Promise<void> {
		return this.filesRepository.write(uri, content);
	}
}
