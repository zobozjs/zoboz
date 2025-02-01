import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository";
import type { SrcDistMapper } from "@shared/domain/interfaces/SrcDistMapper";
import type { UriReformatter } from "@shared/domain/interfaces/UriReformatter";
import { OxcUriReformatter } from "@shared/domain/services/OxcUriReformatter";
import type { CjsOutDir } from "../valueObjects/CjsOutDir";

export class CjsSpecifierFormatter {
	private readonly uriReformatter: UriReformatter;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly fileUris: string[],
		outDir: CjsOutDir,
		srcDistMapper: SrcDistMapper,
	) {
		this.uriReformatter = new OxcUriReformatter(outDir, srcDistMapper);
	}

	async format(): Promise<void> {
		for (const uri of this.fileUris) {
			await this.changeReferencesInNode(uri);
		}
	}

	private async changeReferencesInNode(uri: string): Promise<void> {
		if (this.isJs(uri)) {
			const content = await this.filesRepository.read(uri);
			const newContent = this.replaceContent(uri, content);
			await this.filesRepository.write(uri, newContent);
		}
	}

	private isJs(uri: string) {
		return uri.endsWith(".js") || uri.endsWith(".cjs");
	}

	private replaceContent(sourceUri: string, content: string): string {
		return content.replace(
			/require\((['"])(.+?)\1\)/g,
			(match, p1, p2) =>
				`require(${p1}${this.uriReformatter.reformat(sourceUri, p2)}${p1})`,
		);
	}
}
