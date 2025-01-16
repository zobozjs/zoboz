import { FileNode } from "../../../shared/domain/entities/FileNode.js";
import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository.js";

export class DeclarationReferenceChanger {
	constructor(private readonly filesRepository: FilesRepository) {}

	async changeReferencesInDir(mjsdir: string): Promise<void> {
		const node = FileNode.fromUri(mjsdir, this.filesRepository);
		const children = await node.children();
		await Promise.all(
			children.map((child) => this.changeReferencesInNode(child)),
		);
	}

	private async changeReferencesInNode(child: FileNode): Promise<void> {
		if (await child.isDir()) {
			return this.changeReferencesInDir(child.uri);
		}

		if (child.uri.endsWith(".d.ts")) {
			await child.replaceContent((x) =>
				x
					.replace(
						/from\s+(['"])(\..+?)\1/g,
						(match, p1, p2) => `from ${p1}${this.formattedUri(p2)}${p1}`,
					)
					.replace(
						/import\(['"](\..+?)\1\)/g,
						(match, p1, p2) => `import(${p1}${this.formattedUri(p2)}${p1})`,
					),
			);
		}
	}

	private formattedUri(uri: string) {
		if (uri.endsWith(".cjs")) {
			return uri.slice(0, -4);
		}

		if (uri.endsWith(".mjs")) {
			return uri.slice(0, -4);
		}

		if (uri.endsWith(".js")) {
			return uri.slice(0, -3);
		}

		return uri;
	}
}
