import type { FileNode } from "../entities/FileNode.js";

export interface FilesRepository {
	getPackageDir: () => Promise<FileNode>;
	isDir: (node: FileNode) => Promise<boolean>;
	move: (node: FileNode, newUri: string) => Promise<void>;
	remove: (node: FileNode) => Promise<void>;
	children(node: FileNode): Promise<FileNode[]>;
	read: (node: FileNode) => Promise<string>;
	write: (node: FileNode, content: string) => Promise<void>;
}
