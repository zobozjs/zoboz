import * as path from "path";
import type { FilesRepository } from "../interfaces/FilesRepository.js";

type ContentReplacer = (currentContent: string) => string;

export class FileNode {
	private constructor(
		public readonly uri: string,
		private readonly filesRepository: FilesRepository,
	) {}

	static fromUri(uri: string, filesRepository: FilesRepository): FileNode {
		return new FileNode(uri, filesRepository);
	}

	isDir(): Promise<boolean> {
		return this.filesRepository.isDir(this.uri);
	}

	async children(): Promise<FileNode[]> {
		const isDir = await this.isDir();
		if (!isDir) {
			throw new Error("Node is not a directory");
		}

		const uris = await this.filesRepository.children(this.uri);
		return uris.map((uri) => FileNode.fromUri(uri, this.filesRepository));
	}

	remove(): Promise<void> {
		return this.filesRepository.remove(this.uri);
	}

	mv(toUri: string): Promise<void> {
		return this.filesRepository.mv(this.uri, toUri);
	}

	async read(): Promise<string> {
		if (await this.isDir()) {
			throw new Error("This FileNode is a directory");
		}

		return this.filesRepository.read(this.uri);
	}

	async write(content: string): Promise<void> {
		if (await this.isDir()) {
			throw new Error("This FileNode is a directory");
		}

		return this.filesRepository.write(this.uri, content);
	}

	async getRelativeUriOf(uri: string): Promise<string> {
		if (!(await this.isDir())) {
			throw new Error("This FileNode is not a directory");
		}

		if (!uri.startsWith(this.uri)) {
			throw new Error("URI is not a child of this FileNode");
		}

		return `./${path.join("./", uri.replace(this.uri, ""))}`;
	}

	async replaceContent(replacer: ContentReplacer): Promise<void> {
		const content = await this.read();
		const newContent = replacer(content);
		await this.write(newContent);
	}
}
