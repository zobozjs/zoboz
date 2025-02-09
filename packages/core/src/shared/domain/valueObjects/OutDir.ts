import * as path from "path";
import { RelativeSpecifier } from "./RelativeSpecifier";

export class OutDir {
	public readonly uri: string;
	constructor(uri: string) {
		this.uri = new RelativeSpecifier(path.join(uri)).uri;
	}
}
