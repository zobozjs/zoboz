import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";
import path from "node:path";
import child_process from "node:child_process";
import { fileURLToPath } from "node:url";

async function main() {
  let zobozCoreTarballPath = "";

  try {
    const zobozCoreDir = getZobozDirectory();
    buildZobozProject(zobozCoreDir);
    zobozCoreTarballPath = createTarball(zobozCoreDir);

    const { runConfiguration } = await loadConfiguration({
      provided: {
        worldParameters: {
          zobozCoreTarballPath,
        },
      },
    });

    const { success } = await runCucumber(runConfiguration);

    console.log(success);
  } finally {
    deleteTarball(zobozCoreTarballPath);
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
