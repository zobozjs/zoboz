import type { FileNode } from "../../shared/domain/entities/FileNode.js";
import type { Builder } from "../../shared/domain/interfaces/Builder.js";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository.js";
import type { CommandRunner } from "../domain/interfaces/CommandRunner.js";
import { TscBinary } from "./TscBinary.js";

export class TscModuleBuilder implements Builder {
	private readonly tscBinary: TscBinary = new TscBinary();

	constructor(
		private readonly commandRunner: CommandRunner,
		private readonly filesRepository: FilesRepository,
	) {}

	async build(packageDir: FileNode, outDir: string): Promise<void> {
		let tsConfigPath: string | null = null;
		try {
			tsConfigPath = await this.writeTsConfigFile(packageDir, outDir);
			this.commandRunner.run(`${this.tscBinary.path} -p ${tsConfigPath}`);
		} finally {
			if (tsConfigPath) {
				await this.filesRepository.remove(tsConfigPath);
			}
		}
	}

	private async writeTsConfigFile(
		packageDir: FileNode,
		outDir: string,
	): Promise<string> {
		const tsConfig = await this.generateTsConfig(packageDir, outDir);
		const tsConfigPath = `${packageDir.uri}/tsconfig.${this.generateRandomString()}.json`;

		await this.filesRepository.write(
			tsConfigPath,
			JSON.stringify(tsConfig, null, 2),
		);

		return tsConfigPath;
	}

	private async generateTsConfig(packageDir: FileNode, outDir: string) {
		const relativeOutDir = await packageDir.getRelativeUriOf(outDir);

		return {
			extends: "./tsconfig.json",
			include: ["src/**/*"],
			compilerOptions: {
				noEmit: false,
				declaration: false,
				module: "es2020",
				moduleResolution: "node",
				outDir: relativeOutDir,
			},
		};
	}

	private generateRandomString() {
		return Math.random().toString(36).substring(7);
	}
}
