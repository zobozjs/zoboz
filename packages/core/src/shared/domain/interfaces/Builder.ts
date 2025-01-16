import type { FileNode } from "../entities/FileNode.js";

export interface Builder {
	build(packageDir: FileNode, outDir: string): Promise<void>;
}
