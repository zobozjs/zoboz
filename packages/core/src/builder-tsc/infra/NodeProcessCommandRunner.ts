import * as child_process from "child_process";
import { logger } from "@shared/supporting/logger.js";
import type { CommandRunner } from "../domain/interfaces/CommandRunner.js";

export class NodeProcessCommandRunner implements CommandRunner {
	run(command: string) {
		logger.pending(`Running command: ${command}`);
		child_process.execSync(command, { stdio: "inherit" });
	}
}
