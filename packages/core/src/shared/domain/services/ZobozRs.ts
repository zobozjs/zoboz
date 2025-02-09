import { type ChildProcessByStdio, spawn } from "child_process";
import type { Readable, Writable } from "stream";

export type SpecifiersReformatterConfig = {
	absoluteSourceDir: string;
	absoluteOutputDir: string;
	outputFormat: "dts" | "esm" | "cjs";
};

export type PackageJsonVerifierConfig = {
	canUpdatePackageJson: boolean;
};

type ZobozRsProcess = ChildProcessByStdio<Writable, Readable, null>;

export class ZobozRs {
	private zobozRsProcessPromise: null | Promise<ZobozRsProcess>;

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
		this.zobozRsProcessPromise = null;
	}

	private async runCommand(args: string[]): Promise<void> {
		const handleReady = (zobozRsProcess) => {
			const promise = new Promise((resolve, reject) => {
				const commandString = `${args.join(" ")}\n`;
				zobozRsProcess.stdin.write(commandString);

				let response = "";
				const onData = (chunk) => {
					response += chunk.toString();
					// based on zoboz_rs, it means it's ready for the next command
					if (response.endsWith("zoboz $ ")) {
						zobozRsProcess.stdout.off("data", onData);
						resolve(null);
					}
				};

				zobozRsProcess.stdout.on("data", onData);
			});

			return promise.then(
				() => zobozRsProcess,
				() => zobozRsProcess,
			);
		};

		this.zobozRsProcessPromise = this.getProcess().then(handleReady);

		return this.zobozRsProcessPromise.then(() => {});
	}

	private getProcess(): Promise<ZobozRsProcess> {
		if (this.zobozRsProcessPromise) {
			return this.zobozRsProcessPromise;
		}

		this.zobozRsProcessPromise = new Promise<ZobozRsProcess>(
			(resolve, reject) => {
				const zobozRsProcess = spawn(
					"/Users/dariush/repos/zoboz/packages/zoboz_rs/target/release/zoboz_rs",
					[],
					{
						stdio: ["pipe", "pipe", "inherit"],
					},
				);

				zobozRsProcess.on("error", (error) => {
					this.zobozRsProcessPromise = null;
					reject(error);
				});

				zobozRsProcess.on("exit", (code) => {
					this.zobozRsProcessPromise = null;
					if (code !== 0) {
						reject(new Error(`Zoboz exited with code ${code}`));
					}
				});

				resolve(zobozRsProcess);
			},
		);

		return this.zobozRsProcessPromise;
	}
}
