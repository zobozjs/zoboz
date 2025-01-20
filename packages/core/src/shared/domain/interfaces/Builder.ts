import type { logger } from "../../supporting/logger";
import type { ExportsConfig } from "../valueObjects/ExportsConfig";
import type { OutDir } from "../valueObjects/OutDir";
import type { SrcDir } from "../valueObjects/SrcDir";

export type BuildParams = {
	srcDir: SrcDir;
	exportsConfig: ExportsConfig;
	outDir: OutDir;
	logger: typeof logger;
};

export interface Builder {
	build(params: BuildParams): Promise<void>;
}
