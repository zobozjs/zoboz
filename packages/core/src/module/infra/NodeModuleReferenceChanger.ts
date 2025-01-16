import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository";
import type { ModuleReferenceChanger } from "../domain/interfaces/ModuleReferenceChanger";

export class NodeModuleReferenceChanger implements ModuleReferenceChanger {
	constructor(private readonly filesRepository: FilesRepository) {}

	async changeReferencesInDir(mjsdir: string): Promise<void> {
		const children = await this.filesRepository.children(mjsdir);
		await Promise.all(children.map((uri) => this.changeReferencesInNode(uri)));
	}

	private async changeReferencesInNode(uri: string): Promise<void> {
		if (await this.filesRepository.isDir(uri)) {
			return this.changeReferencesInDir(uri);
		}

		if (uri.endsWith(".mjs")) {
			const content = await this.filesRepository.read(uri);
			const newContent = this.replaceContent(content);
			await this.filesRepository.write(uri, newContent);
		}
	}

	private replaceContent(content: string): string {
		return content
			.replace(
				/from\s+(['"])(\..+?)\1/g,
				(match, p1, p2) => `from ${p1}${this.formattedUri(p2)}${p1}`,
			)
			.replace(
				/import\(['"](\..+?)\1\)/g,
				(match, p1, p2) => `import(${p1}${this.formattedUri(p2)}${p1})`,
			);
	}

	private formattedUri(uri: string) {
		if (uri.endsWith(".mjs")) {
			return uri;
		}

		if (uri.endsWith(".js")) {
			return `${uri.slice(0, -3)}.mjs`;
		}

		return `${uri}.mjs`;
	}
}
