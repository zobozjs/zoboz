import child_process from "node:child_process";
import fs from "node:fs";
import {
	type IWorldOptions,
	World,
	setWorldConstructor,
} from "@cucumber/cucumber";
import tmp from "tmp";
import { ScenarioPackage } from "./ScenarioPackage.js";

type ParametersType = { pilotTarballPath: string };

export class Lab extends World<ParametersType> {
	private stderr: null | string = null;
	private readonly scenarioTempDir: string;
	private readonly scenarioPackage: ScenarioPackage;

	constructor(options: IWorldOptions<ParametersType>) {
		super(options);
		tmp.setGracefulCleanup();
		this.scenarioTempDir = tmp.dirSync({ unsafeCleanup: true }).name;
		this.scenarioPackage = new ScenarioPackage(this.scenarioTempDir);
	}

	initPackage() {
		this.scenarioPackage.init(this.parameters.pilotTarballPath);
	}

	runBuildWithUpdatePackageJson() {
		child_process.execSync("npm run build", { cwd: this.scenarioTempDir });
	}

	writeFile(filePath: string, fileContent: string) {
		this.createDirectoryIfAbsent(filePath);
		fs.writeFileSync(`${this.scenarioTempDir}/${filePath}`, fileContent);
	}

	readFile(filePath: string) {
		return fs.readFileSync(`${this.scenarioTempDir}/${filePath}`, {
			encoding: "utf-8",
		});
	}

	private createDirectoryIfAbsent(filePath: string) {
		const dir = filePath.split("/").slice(0, -1).join("/");
		if (dir) {
			fs.mkdirSync(`${this.scenarioTempDir}/${dir}`, { recursive: true });
		}
	}

	assertFilesExist(files: string[]) {
		for (const file of files) {
			const filePath = `${this.scenarioTempDir}/${file}`;
			if (!fs.existsSync(filePath)) {
				throw new Error(`File ${filePath} does not exist`);
			}
		}
	}

	setInPackageJson(key: string, value: string) {
		this.scenarioPackage.setInPackageJson(key, value);
	}

	runCommand(command: string) {
		try {
			child_process.execSync(command, {
				cwd: this.scenarioTempDir,
				stdio: "pipe",
			});
		} catch (error) {
			const [_stdinput, _stdout, stderr] = error.output;
			this.stderr = stderr.toString();
		}
	}

	getStderr() {
		return this.stderr;
	}
}

setWorldConstructor(Lab);
