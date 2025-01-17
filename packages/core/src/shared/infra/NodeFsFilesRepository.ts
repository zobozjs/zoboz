import * as fs from "fs";
import * as path from "path";
import type { FilesRepository } from "../domain/interfaces/FilesRepository";

export class NodeFsFilesRepository implements FilesRepository {
	async getPackageDir(): Promise<string> {
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
}
