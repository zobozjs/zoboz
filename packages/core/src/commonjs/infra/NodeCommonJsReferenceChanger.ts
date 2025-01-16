import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository";
import type { CommonJsReferenceChanger } from "../domain/interfaces/CommonJsReferenceChanger";

export class NodeCommonJsReferenceChanger implements CommonJsReferenceChanger {
	constructor(private readonly filesRepository: FilesRepository) {}

	async changeReferencesInDir(cjsdir: string): Promise<void> {
		const children = await this.filesRepository.children(cjsdir);
		await Promise.all(children.map((uri) => this.changeReferencesInNode(uri)));
	}

	private async changeReferencesInNode(uri: string): Promise<void> {
		if (await this.filesRepository.isDir(uri)) {
			return this.changeReferencesInDir(uri);
		}

		if (uri.endsWith(".cjs")) {
			const content = await this.filesRepository.read(uri);
			const newContent = this.replaceContent(content);
			await this.filesRepository.write(uri, newContent);
		}
	}

	private replaceContent(content: string): string {
		return content.replace(
			/require\((['"])(\..+?)\1\)/g,
			(match, p1, p2) => `require(${p1}${this.formattedUri(p2)}${p1})`,
		);
	}

	private formattedUri(uri: string) {
		if (uri.endsWith(".cjs")) {
			return uri;
		}

		if (uri.endsWith(".js")) {
			return `${uri.slice(0, -3)}.cjs`;
		}

		return `${uri}.cjs`;
	}
}
