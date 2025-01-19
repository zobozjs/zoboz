import type { Builder } from "../../shared/domain/interfaces/Builder.js";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository.js";
import type { ExportsConfig } from "../../shared/domain/valueObjects/ExportsConfig.js";
import type { OutDir } from "../../shared/domain/valueObjects/OutDir.js";
import type { SrcDir } from "../../shared/domain/valueObjects/SrcDir.js";
import type { CommandRunner } from "../domain/interfaces/CommandRunner.js";
import { TscBinary } from "./TscBinary.js";

export class TscDeclarationBuilder implements Builder {
	private readonly tscBinary: TscBinary = new TscBinary();

	constructor(
		private readonly commandRunner: CommandRunner,
		private readonly filesRepository: FilesRepository,
	) {}

	async build(
		srcDir: SrcDir,
		exportsConfig: ExportsConfig,
		outDir: OutDir,
	): Promise<void> {
		let tsConfigPath: string | null = null;
		try {
			tsConfigPath = await this.writeTsConfigFile(srcDir, outDir.uri);
			this.commandRunner.run(`${this.tscBinary.path} -p ${tsConfigPath}`);
		} finally {
			if (tsConfigPath) {
				await this.filesRepository.remove(tsConfigPath);
			}
		}
	}

	private async writeTsConfigFile(
		srcDir: SrcDir,
		outDir: string,
	): Promise<string> {
		const tsConfig = await this.generateTsConfig(srcDir, outDir);
		const tsConfigFilename = `tsconfig.dts.${this.generateRandomString()}.json`;
		const tsConfigPath = `${this.filesRepository.getPackageDir()}/${tsConfigFilename}`;

		await this.filesRepository.write(
			tsConfigPath,
			JSON.stringify(tsConfig, null, 2),
		);

		return tsConfigPath;
	}

	private async generateTsConfig(srcDir: SrcDir, outDir: string) {
		return {
			extends: "./tsconfig.json",
			include: [`${srcDir.uri}/**/*`],
			compilerOptions: {
				noEmit: false,
				declaration: true,
				emitDeclarationOnly: true,
				outDir: outDir,
			},
		};
	}

	private generateRandomString() {
		return Math.random().toString(36).substring(7);
	}
}
