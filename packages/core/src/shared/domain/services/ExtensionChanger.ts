import { FileNode } from "../entities/FileNode.js";
import type { FilesRepository } from "../interfaces/FilesRepository.js";

export class ExtensionChanger {
	constructor(private readonly filesRepository: FilesRepository) {}

	async changeInDir(
		dir: string,
		fromExtension: string,
		toExtension: string,
	): Promise<void> {
		const rootNode = FileNode.fromUri(dir, this.filesRepository);
		const children = await rootNode.children();
		await Promise.all(
			children.map((node) => this.changeNode(node, fromExtension, toExtension)),
		);
	}

	private async changeNode(
		node: FileNode,
		from: string,
		to: string,
	): Promise<void> {
		if (await node.isDir()) {
			return this.changeInDir(node.uri, from, to);
		}

		if (this.hasMatchingFileExtension(node, from)) {
			return node.move(this.getUriWithNewExtension(node, from, to));
		}
	}

	private getUriWithNewExtension(
		node: FileNode,
		from: string,
		to: string,
	): string {
		const regex = new RegExp(`\\.${from}(\\.map)?$`);
		return node.uri.replace(regex, `.${to}$1`);
	}

	private hasMatchingFileExtension(node: FileNode, from: string) {
		return node.uri.endsWith(`.${from}`) || node.uri.endsWith(`.${from}.map`);
	}
}
