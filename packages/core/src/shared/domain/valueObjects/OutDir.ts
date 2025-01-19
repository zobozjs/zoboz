import * as path from "path";
import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository";

export class OutDir {
	public readonly absoluteUri: string;
	public readonly uri: string;
	constructor(filesRepository: FilesRepository, uri: string) {
		this.uri = path.join(uri);
		this.absoluteUri = path.join(filesRepository.getPackageDir(), this.uri);
	}
}
