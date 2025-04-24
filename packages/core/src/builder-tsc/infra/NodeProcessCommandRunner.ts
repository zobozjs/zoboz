import * as child_process from "child_process";
import { logger } from "@shared/supporting/logger.js";
import type { CommandRunner } from "../domain/interfaces/CommandRunner.js";

export class NodeProcessCommandRunner implements CommandRunner {
	run(command: string) {
		logger.debug(`Running command: ${command}`);
		try {
			child_process.execSync(command, { stdio: "pipe" });
		} catch (error) {
			const [, stderr] = error.output;
			throw new Error(`${error.message} -- ${stderr.toString()}`);
		}
	}
}
