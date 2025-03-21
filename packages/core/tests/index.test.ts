import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";

async function main() {
	const { runConfiguration } = await loadConfiguration();
	const { success } = await runCucumber(runConfiguration);
	console.log(success);
}

main();
