import { FileNode } from "../../shared/domain/entities/FileNode";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository";
import type { CommonJsReferenceChanger } from "../domain/interfaces/CommonJsReferenceChanger";

export class NodeCommonJsReferenceChanger implements CommonJsReferenceChanger {
	constructor(private readonly filesRepository: FilesRepository) {}

	async changeReferencesInDir(cjsdir: string): Promise<void> {
		const node = FileNode.fromUri(cjsdir, this.filesRepository);
		const children = await node.children();
		await Promise.all(
			children.map((child) => this.changeReferencesInNode(child)),
		);
	}

	private async changeReferencesInNode(child: FileNode): Promise<void> {
		if (await child.isDir()) {
			return this.changeReferencesInDir(child.uri);
		}

		if (child.uri.endsWith(".cjs")) {
			await child.replaceContent((x) =>
				x.replace(
					/require\((['"])(\..+?)\1\)/g,
					(match, p1, p2) => `require(${p1}${this.formattedUri(p2)}${p1})`,
				),
			);
		}
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
