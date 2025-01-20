import * as esbuild from "esbuild";
import type {
	Builder,
	BuildParams,
} from "../../shared/domain/interfaces/Builder.js";
import type { EsbuildOptions } from "../domain/interfaces/EsbuildOptions.js";

export class EsbuildModuleBuilder implements Builder {
	constructor(private readonly buildOptions?: EsbuildOptions) {}

	async build({ srcDir, outDir, logger }: BuildParams): Promise<void> {
		logger.pending(`Building ES Module by esbuild to ${outDir.uri}`);

		await esbuild.build({
			entryPoints: [`./${srcDir.uri}/**/*.ts`, `./${srcDir.uri}/**/*.tsx`],
			outdir: outDir.absoluteUri,
			format: "esm",
			platform: "node",
			...(this.buildOptions ?? {}),
		});
	}
}
