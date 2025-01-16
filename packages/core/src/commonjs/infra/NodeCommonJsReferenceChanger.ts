import { UriReformatter } from "../../main/domain/services/UriReformatter";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository";
import type { CommonJsReferenceChanger } from "../domain/interfaces/CommonJsReferenceChanger";

export class NodeCommonJsReferenceChanger implements CommonJsReferenceChanger {
	constructor(private readonly filesRepository: FilesRepository) {}

	private async traverseDirAndReturnUris(dir: string): Promise<string[]> {
		const children = await this.filesRepository.children(dir);
		const uris = await Promise.all(
			children.map(async (uri) =>
				(await this.filesRepository.isDir(uri))
					? this.traverseDirAndReturnUris(uri)
					: uri,
			),
		);

		return uris.flat();
	}

	async changeReferencesInDir(cjsdir: string): Promise<void> {
		const uris = await this.traverseDirAndReturnUris(cjsdir);
		const uriReformatter = new UriReformatter(uris);
		const executer = new Executer(this.filesRepository, uriReformatter);
		return executer.changeReferencesInDir(uris);
	}
}

class Executer {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly uriReformatter: UriReformatter,
	) {}

	async changeReferencesInDir(uris: string[]): Promise<void> {
		await Promise.all(uris.map((uri) => this.changeReferencesInNode(uri)));
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
