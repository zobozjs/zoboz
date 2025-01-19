import type { OutDir } from "../valueObjects/OutDir";
import type { SrcDir } from "../valueObjects/SrcDir";

export interface Builder {
	build(srcDir: SrcDir, outDir: OutDir): Promise<void>;
}
