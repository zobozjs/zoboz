import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository";
import type { SrcDistMapper } from "@shared/domain/interfaces/SrcDistMapper";
import type { UriReformatter } from "@shared/domain/interfaces/UriReformatter";
import { OxcUriReformatter } from "@shared/domain/services/OxcUriReformatter";
import type { ModuleOutDir } from "../valueObjects/ModuleOutDir";

export class ModuleReferenceLinter {
	private readonly uriReformatter: UriReformatter;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly fileUris: string[],
		outDir: ModuleOutDir,
		srcDistMapper: SrcDistMapper,
	) {
		this.uriReformatter = new OxcUriReformatter(outDir, srcDistMapper);
	}

	async lint(): Promise<void> {
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
		return uri.endsWith(".js") || uri.endsWith(".mjs");
	}

	private replaceContent(sourceUri: string, content: string): string {
		return content
			.replace(
				/from\s+(['"])(.+?)\1/g,
				(match, p1, p2) =>
					`from ${p1}${this.uriReformatter.reformat(sourceUri, p2)}${p1}`,
			)
			.replace(
				/import\(['"](.+?)\1\)/g,
				(match, p1, p2) =>
					`import(${p1}${this.uriReformatter.reformat(sourceUri, p2)}${p1})`,
			);
	}
}
