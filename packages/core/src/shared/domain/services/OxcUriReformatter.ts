import * as path from "path";
import resolve from "oxc-resolver";
import type { UriReformatter } from "../interfaces/UriReformatter";
import { RelativeSpecifier } from "../valueObjects/RelativeSpecifier";

export class OxcUriReformatter implements UriReformatter {
	reformat(absoluteSourceUri: string, relativeRefUri: string): string {
		const absoluteSourceDirUri = path.dirname(absoluteSourceUri);

		const { path: absoluteResolvedUri } = resolve.sync(
			path.dirname(absoluteSourceUri),
			relativeRefUri,
		);

		if (!absoluteResolvedUri) {
			return relativeRefUri;
		}

		return new RelativeSpecifier(
			path.relative(absoluteSourceDirUri, absoluteResolvedUri),
		).uri;
	}
}
