import * as path from "path";
import * as process from "process";
import * as typescript from "typescript";

export class TsConfig {
	public readonly compilerOptions: {
		baseUrl: string;
		paths: Record<string, string[]>;
	};

	constructor(compilerOptions: {
		baseUrl: string;
		paths: Record<string, string[]>;
	}) {
		this.compilerOptions = compilerOptions;
	}

	static fromCurrentProject(): TsConfig {
		const tsConfigPath = path.resolve(process.cwd(), "tsconfig.json");

		const configFile = typescript.readConfigFile(
			tsConfigPath,
			typescript.sys.readFile,
		);

		const parsedCommandLine = typescript.parseJsonConfigFileContent(
			configFile.config,
			typescript.sys,
			path.dirname(tsConfigPath),
		);

		return new TsConfig({
			baseUrl: parsedCommandLine.options.baseUrl || "",
			paths: parsedCommandLine.options.paths || {},
		});
	}
}
