import child_process from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";

async function main() {
	let zobozCoreTarballPath = "";

	try {
		const zobozCoreDir = getZobozDirectory();

		console.time("buildZobozProject");
		buildZobozProject(zobozCoreDir);
		console.timeEnd("buildZobozProject");

		console.time("createTarball");
		zobozCoreTarballPath = createTarball(zobozCoreDir);
		console.timeEnd("createTarball");

		console.time("cucumber:loadConfiguration");
		const { runConfiguration } = await loadConfiguration({
			provided: {
				worldParameters: {
					zobozCoreTarballPath,
				},
			},
		});
		console.timeEnd("cucumber:loadConfiguration");

		console.time("cucumber:runCucumber");
		const { success } = await runCucumber(runConfiguration);
		console.timeEnd("cucumber:runCucumber");

		console.log(success);
	} finally {
		console.time("deleteTarball");
		deleteTarball(zobozCoreTarballPath);
		console.timeEnd("deleteTarball");
	}
}

main();

function getZobozDirectory() {
	const __filename = fileURLToPath(import.meta.url);
	const zobozDir = path.resolve(path.dirname(__filename), "..");
	return zobozDir;
}

function buildZobozProject(zobozCoreDir: string) {
	child_process.execSync("npm run build", { cwd: zobozCoreDir });
}

function createTarball(zobozCoreDir: string): string {
	const tarballName = child_process
		.execSync("npm pack", {
			cwd: zobozCoreDir,
			stdio: "pipe",
		})
		.toString()
		.trim();

	return path.join(zobozCoreDir, tarballName);
}

function deleteTarball(tarballPath: string) {
	child_process.execSync(`rm ${tarballPath}`);
}
