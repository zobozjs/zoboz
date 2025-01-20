import * as path from "path";
import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository";
import { RelativeSpecifier } from "./RelativeSpecifier";

export class OutDir {
	public readonly absoluteUri: string;
	public readonly uri: string;
	constructor(filesRepository: FilesRepository, uri: string) {
		this.uri = new RelativeSpecifier(path.join(uri)).uri;
		this.absoluteUri = path.join(filesRepository.getPackageDir(), this.uri);
	}
}
