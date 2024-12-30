import type { FileNode } from "../entities/FileNode.js";

export interface Builder {
	readonly outdir: string;
	build(packageDir: FileNode): Promise<void>;
}
