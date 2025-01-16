import type { ExtensionChanger } from "../domain/interfaces/ExtensionChanger";
import type { FilesRepository } from "../domain/interfaces/FilesRepository";

export class NodeExtensionChanger implements ExtensionChanger {
	constructor(private readonly filesRepository: FilesRepository) {}

	async changeInDir(
		dir: string,
		fromExtension: string,
		toExtension: string,
	): Promise<void> {
		const children = await this.filesRepository.children(dir);
		await Promise.all(
			children.map((uri) => this.changeNode(uri, fromExtension, toExtension)),
		);
	}

	private async changeNode(
		uri: string,
		fromExtension: string,
		toExtension: string,
	): Promise<void> {
		if (await this.filesRepository.isDir(uri)) {
			return this.changeInDir(uri, fromExtension, toExtension);
		}

		if (this.hasMatchingFileExtension(uri, fromExtension)) {
			return this.filesRepository.mv(
				uri,
				this.getUriWithNewExtension(uri, fromExtension, toExtension),
			);
		}
	}

	private getUriWithNewExtension(
		uri: string,
		fromExtension: string,
		toExtension: string,
	): string {
		const regex = new RegExp(`\\.${fromExtension}(\\.map)?$`);
		return uri.replace(regex, `.${toExtension}$1`);
	}

	private hasMatchingFileExtension(
		uri: string,
		fromExtension: string,
	): boolean {
		return (
			uri.endsWith(`.${fromExtension}`) || uri.endsWith(`.${fromExtension}.map`)
		);
	}
}
