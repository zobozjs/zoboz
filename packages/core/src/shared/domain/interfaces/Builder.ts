import type { ExportsConfig } from "../valueObjects/ExportsConfig";
import type { OutDir } from "../valueObjects/OutDir";
import type { SrcDir } from "../valueObjects/SrcDir";

export interface Builder {
	build(
		srcDir: SrcDir,
		exportsConfig: ExportsConfig,
		outDir: OutDir,
	): Promise<void>;
}
