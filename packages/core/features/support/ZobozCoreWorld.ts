import child_process from "node:child_process";
import fs from "node:fs";
import {
	type IWorldOptions,
	World,
	setWorldConstructor,
} from "@cucumber/cucumber";
import tmp from "tmp";
import { PackageManager } from "./PackageManager.js";

export class ZobozCoreWorld extends World {
	private stderr: null | string = null;
	private readonly packageDir: string;
	private readonly packageManager: PackageManager;

	constructor(options: IWorldOptions) {
		super(options);

		tmp.setGracefulCleanup();
		this.packageDir = tmp.dirSync({ unsafeCleanup: true }).name;

		this.packageManager = new PackageManager(this.packageDir);
	}

	initPackage(zobozCoreTarballPath: string) {
		this.packageManager.init(zobozCoreTarballPath);
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

	setInPackageJson(key: string, value: string) {
		this.packageManager.setInPackageJson(key, value);
	}

	runCommand(command: string) {
		try {
			child_process.execSync(command, { cwd: this.packageDir, stdio: "pipe" });
		} catch (error) {
			const [_stdinput, _stdout, stderr] = error.output;
			this.stderr = stderr.toString();
		}
	}

	getStderr() {
		return this.stderr;
	}
}

setWorldConstructor(ZobozCoreWorld);
