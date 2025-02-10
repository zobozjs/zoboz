import { type ChildProcessByStdio, spawn } from "child_process";
import { createRequire } from "module";
import type { Readable, Writable } from "stream";
import { execPath } from "process";

export type SpecifiersReformatterConfig = {
	absoluteSourceDir: string;
	absoluteOutputDir: string;
	outputFormat: "dts" | "esm" | "cjs";
};

export type PackageJsonVerifierConfig = {
	canUpdatePackageJson: boolean;
};

type ZobozBamProcess = ChildProcessByStdio<Writable, Readable, null>;

export class ZobozBam {
	private zobozBamProcessPromise: null | Promise<ZobozBamProcess>;

	constructor(private readonly absolutePackageDir: string) {}

	reformatSpecifiers(config: SpecifiersReformatterConfig): Promise<void> {
		return this.runCommand([
			"reformat-specifiers",
			"--absolute-package-dir",
			this.absolutePackageDir,
			"--absolute-source-dir",
			config.absoluteSourceDir,
			"--absolute-output-dir",
			config.absoluteOutputDir,
			"--output-format",
			config.outputFormat,
		]);
	}

	async verifyPackageJson(config: PackageJsonVerifierConfig): Promise<void> {
		return this.runCommand(
			[
				"verify-package-json",
				"--absolute-package-dir",
				this.absolutePackageDir,
				config.canUpdatePackageJson ? "--can-update-package-json" : "",
			].filter(Boolean),
		);
	}

	async exit(): Promise<void> {
		await this.runCommand(["exit"]);
		this.zobozBamProcessPromise = null;
	}

	private async runCommand(args: string[]): Promise<void> {
		const handleReady = (zobozBamProcess) => {
			const readyPromise = this.getReadyPromise(zobozBamProcess);
			zobozBamProcess.stdin.write(this.formatCommand(args));

			return readyPromise.then(
				() => zobozBamProcess,
				() => zobozBamProcess,
			);
		};

		this.zobozBamProcessPromise = this.getProcess().then(handleReady);

		return this.zobozBamProcessPromise.then(() => {});
	}

	private formatCommand(args: string[]): string {
		return `${args.join(" ").replace(/\\/g, "\\\\")}\n`;
	}

	private async getProcess(): Promise<ZobozBamProcess> {
		if (this.zobozBamProcessPromise) {
			return this.zobozBamProcessPromise;
		}

		const requireFunc =
			typeof require !== "undefined"
				? require
				: // @ts-ignore
					createRequire(import.meta.url);

		const zobozBamProcess = spawn(
			execPath,
			[requireFunc.resolve("@zoboz/bam")],
			{
				stdio: ["pipe", "pipe", "inherit"],
			},
		);

		this.zobozBamProcessPromise = this.getReadyPromise(zobozBamProcess).then(
			() => zobozBamProcess,
		);

		return this.zobozBamProcessPromise;
	}

	private getReadyPromise(zobozBamProcess: ZobozBamProcess): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			let response = "";
			const onData = (chunk) => {
				response += chunk.toString();
				// based on zoboz-bam, it means it's ready for the next command
				if (response.endsWith("zoboz $ ")) {
					zobozBamProcess.stdout.removeListener("data", onData);
					resolve();
				}
			};

			zobozBamProcess.stdout.addListener("data", onData);
		});
	}
}
