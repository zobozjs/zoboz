import * as esbuild from "esbuild";
import type {
	BuildParams,
	Builder,
} from "../../shared/domain/interfaces/Builder.js";
import type { EsbuildOptions } from "../domain/interfaces/EsbuildOptions.js";

export class EsbuildCommonJsBuilder implements Builder {
	constructor(private readonly buildOptions?: EsbuildOptions) {}

	async build({ srcDir, outDir, logger }: BuildParams): Promise<void> {
		logger.pending(`Building CommonJS by esbuild to ${outDir.uri}`);

		await esbuild.build({
			entryPoints: [`./${srcDir.uri}/**/*.ts`, `./${srcDir.uri}/**/*.tsx`],
			outdir: outDir.absoluteUri,
			format: "cjs",
			platform: "node",
			...(this.buildOptions || {}),
		});
	}
}
