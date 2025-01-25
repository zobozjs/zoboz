import * as path from "path";
import type { UriReformatter } from "../interfaces/UriReformatter";
import { RelativeSpecifier } from "../valueObjects/RelativeSpecifier";

const pathCandidates = ["", "index"];
const extCandidates = ["", ".js", ".mjs", ".cjs", ".json"];

export class NodeUriReformatter implements UriReformatter {
	constructor(private readonly absoluteUris: string[]) {}

	reformat(sourceUri: string, refUri: string): string {
		const absoluteRefUri = this.makeAbsoluteRefUri(sourceUri, refUri);

		for (const pathCandidate of pathCandidates) {
			const combinedPath = path.join(absoluteRefUri, pathCandidate);
			for (const extCandidate of extCandidates) {
				const uriWithExtension = `${combinedPath}${extCandidate}`;
				if (this.isAbsoluteUriValid(uriWithExtension)) {
					return new RelativeSpecifier(
						`${path.join(refUri, pathCandidate)}${extCandidate}`,
					).uri;
				}
			}
		}

		return refUri;
	}

	private isAbsoluteUriValid(absoluteRefUri: string) {
		return this.absoluteUris.includes(absoluteRefUri);
	}

	private makeAbsoluteRefUri(sourceUri: string, refUri: string) {
		const sourceDirUri = path.dirname(sourceUri);
		return path.join(sourceDirUri, refUri);
	}
}
