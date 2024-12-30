import type { BuildOptions } from "esbuild";

export type EsbuildOptions = Partial<
	Omit<BuildOptions, "entryPoints" | "outdir">
>;
