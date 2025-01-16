import { UriReformatter } from "../../main/domain/services/UriReformatter";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository";
import type { CommonJsReferenceChanger } from "../domain/interfaces/CommonJsReferenceChanger";

export class NodeCommonJsReferenceChanger implements CommonJsReferenceChanger {
	private readonly uriReformatter = new UriReformatter(
		{ ".js": ".cjs" },
		".cjs",
	);

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
			(match, p1, p2) =>
				`require(${p1}${this.uriReformatter.reformat(p2)}${p1})`,
		);
	}
}
