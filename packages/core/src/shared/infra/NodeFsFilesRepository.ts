import * as fs from "fs";
import * as path from "path";
import type { FilesRepository } from "../domain/interfaces/FilesRepository";

export class NodeFsFilesRepository implements FilesRepository {
	getAbsoluteUri(uri: string) {
		return path.join(this.getPackageDir(), uri);
	}

	getRelativeUri(uri: string): string {
		return path.join("./", uri.replace(this.getPackageDir(), ""));
	}

	getPackageDir(): string {
		return process.cwd();
	}

	async isDir(uri: string): Promise<boolean> {
		const stat = await fs.promises.stat(uri);
		return stat.isDirectory();
	}

	async mv(fromUri: string, toUri: string): Promise<void> {
		return fs.promises.rename(fromUri, toUri);
	}

	async remove(uri: string): Promise<void> {
		const recursive = await this.isDir(uri);
		return fs.promises.rm(uri, { recursive });
	}

	async children(uri: string): Promise<string[]> {
		const dir = await fs.promises.readdir(uri);
		return dir.map((file) => path.join(uri, file));
	}

	async read(uri: string): Promise<string> {
		return fs.readFileSync(uri, "utf8");
	}

	async write(uri: string, content: string): Promise<void> {
		return fs.promises.writeFile(uri, content);
	}

	async listFilesRecursively(rootDirUri: string): Promise<string[]> {
		const children = await this.children(rootDirUri);
		const uris = await Promise.all(
			children.map(async (uri) => {
				if (await this.isDir(uri)) {
					return this.listFilesRecursively(uri);
				}

				return this.getAbsoluteUri(uri);
			}),
		);

		return uris.flat();
	}
}
