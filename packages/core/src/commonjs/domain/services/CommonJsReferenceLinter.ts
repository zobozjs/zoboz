import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository";
import { UriReformatter } from "../../../shared/domain/services/UriReformatter";

export class CommonJsReferenceLinter {
	private readonly uriReformatter: UriReformatter;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly fileUris: string[],
	) {
		this.uriReformatter = new UriReformatter(fileUris);
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
		return uri.endsWith(".js") || uri.endsWith(".cjs");
	}

	private replaceContent(sourceUri: string, content: string): string {
		return content.replace(
			/require\((['"])(\..+?)\1\)/g,
			(match, p1, p2) =>
				`require(${p1}${this.uriReformatter.reformat(sourceUri, p2)}${p1})`,
		);
	}
}
