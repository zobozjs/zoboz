import { spawnSync } from "child_process";

export type SpecifiersReformatterConfig = {
	absoluteSourceDir: string;
	absoluteOutputDir: string;
	outputFormat: "dts" | "esm" | "cjs";
};

export class ZobozRs {
	constructor(private readonly absolutePackageDir: string) {}

	reformatSpecifiers(config: SpecifiersReformatterConfig): void {
		spawnSync(
			"/Users/dariush/repos/zoboz/packages/zoboz_rs/target/release/zoboz_rs",
			[
				"reformat-specifiers",
				"--absolute-package-dir",
				this.absolutePackageDir,
				"--absolute-source-dir",
				config.absoluteSourceDir,
				"--absolute-output-dir",
				config.absoluteOutputDir,
				"--output-format",
				config.outputFormat,
			],
			{ stdio: "inherit" },
		);
	}
}
