import * as fs from "node:fs";
import * as path from "node:path";
import { FileNode } from "../domain/entities/FileNode.js";
import type { FilesRepository } from "../domain/interfaces/FilesRepository.js";

export class NodeFsFilesRepository implements FilesRepository {
	async getPackageDir(): Promise<FileNode> {
		return FileNode.fromUri(process.cwd(), this);
	}

	async isDir(node: FileNode): Promise<boolean> {
		const stat = await fs.promises.stat(node.uri);
		return stat.isDirectory();
	}

	async move(node: FileNode, newUri: string): Promise<void> {
		return fs.promises.rename(node.uri, newUri);
	}

	async remove(node: FileNode): Promise<void> {
		return fs.promises.rm(node.uri, { recursive: await node.isDir() });
	}

	async children(node: FileNode): Promise<FileNode[]> {
		const dir = await fs.promises.readdir(node.uri);
		return dir.map((file) => FileNode.fromUri(path.join(node.uri, file), this));
	}

	async read(node: FileNode): Promise<string> {
		return fs.readFileSync(node.uri, "utf8");
	}

	async write(node: FileNode, content: string): Promise<void> {
		return fs.promises.writeFile(node.uri, content);
	}
}
