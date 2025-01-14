import type { FileNode } from "../../shared/domain/entities/FileNode.js";
import type { Builder } from "../../shared/domain/interfaces/Builder.js";
import type { CommandRunner } from "../domain/interfaces/CommandRunner.js";

export class TscModuleBuilder implements Builder {
	constructor(
		private readonly commandRunner: CommandRunner,
		public readonly outdir: string,
	) {}

	async build(packageDir: FileNode): Promise<void> {
		const outDir = await packageDir.getRelativeUriOf(this.outdir);

		const command = [
			"tsc",
			"--noEmit false",
			"--declaration false",
			"--module es2020",
			"--moduleResolution node",
			`--outDir ${outDir}`,
		].join(" ");

		this.commandRunner.run(command);
	}
}
