import * as path from "path";
import type { SrcDistMapper } from "@shared/domain/interfaces/SrcDistMapper";
import { RelativeSpecifier } from "@shared/domain/valueObjects/RelativeSpecifier";
import type { SrcDir } from "@shared/domain/valueObjects/SrcDir";
import type { EsmOutDir } from "../valueObjects/EsmOutDir";

export class EsmSrcDistMapper implements SrcDistMapper {
	constructor(
		private readonly srcDir: SrcDir,
		private readonly outDir: EsmOutDir,
	) {}

	distFromSrc(relativeSrcPath: string): string {
		const uri = this.replaceExtension(
			relativeSrcPath.replace(
				path.join(this.srcDir.uri),
				path.join(this.outDir.uri),
			),
			".js",
		);

		return new RelativeSpecifier(uri).uri;
	}

	private replaceExtension(uri: string, ext: string) {
		return uri.replace(/\.[^/.]+$/, ext);
	}
}
