import child_process from "node:child_process";
import fs from "node:fs";
import {
	type IWorldOptions,
	setWorldConstructor,
	World,
} from "@cucumber/cucumber";
import tmp from "tmp";
import { PackageManager } from "./PackageManager.js";

type ParametersType = {
	zobozCoreTarballPath: string;
};

export class ZobozCoreWorld extends World {
	private stderr: null | string = null;
	private readonly packageDir: string;
	private readonly packageManager: PackageManager;

	constructor(public readonly options: IWorldOptions<ParametersType>) {
		super(options);

		if (!options.parameters.zobozCoreTarballPath) {
			throw new Error("zobozCoreTarballPath is not set");
		}

		tmp.setGracefulCleanup();
		this.packageDir = tmp.dirSync({ unsafeCleanup: true }).name;

		this.packageManager = new PackageManager(this.packageDir);
	}

	initPackage() {
		this.packageManager.init();
		this.packageManager.installTypescript();
		this.packageManager.installZobozCore(this.parameters.zobozCoreTarballPath);
	}

	runBuildWithUpdatePackageJson() {
		child_process.execSync("npm run build", { cwd: this.packageDir });
	}

	writeFile(filePath: string, fileContent: string) {
		this.createDirectoryIfAbsent(filePath);
		fs.writeFileSync(`${this.packageDir}/${filePath}`, fileContent);
	}

	readFile(filePath: string) {
		return fs.readFileSync(`${this.packageDir}/${filePath}`, {
			encoding: "utf-8",
		});
	}

	private createDirectoryIfAbsent(filePath: string) {
		const dir = filePath.split("/").slice(0, -1).join("/");
		if (dir) {
			fs.mkdirSync(`${this.packageDir}/${dir}`, { recursive: true });
		}
	}

	assertFilesExist(files: string[]) {
		for (const file of files) {
			const filePath = `${this.packageDir}/${file}`;
			if (!fs.existsSync(filePath)) {
				throw new Error(`File ${filePath} does not exist`);
			}
		}
	}

	setPackageJsonContent(key: string, value: string) {
		child_process.execSync(`npm pkg set "${key}"="${value}"`, {
			cwd: this.packageDir,
		});
	}

	runCommand(command: string) {
		try {
			child_process.execSync(command, { cwd: this.packageDir, stdio: "pipe" });
		} catch (error) {
			const [_stdinput, _stdout, stderr] = error.output;
			this.stderr = stderr.toString();
			console.log(this.stderr);
		}
	}

	getStderr() {
		return this.stderr;
	}
}

setWorldConstructor(ZobozCoreWorld);
