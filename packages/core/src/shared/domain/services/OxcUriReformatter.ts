import * as path from "path";
import { ResolverFactory } from "oxc-resolver";
import * as process from "process";
import type { SrcDistMapper } from "../interfaces/SrcDistMapper";
import type { UriReformatter } from "../interfaces/UriReformatter";
import type { OutDir } from "../valueObjects/OutDir";
import { RelativeSpecifier } from "../valueObjects/RelativeSpecifier";
import { TsConfig } from "../valueObjects/TsConfig";

export class OxcUriReformatter implements UriReformatter {
	private readonly resolver: ResolverFactory;

	constructor(
		private readonly outDir: OutDir,
		private readonly srcDistMapper: SrcDistMapper,
	) {
		const tsConfig = TsConfig.fromCurrentProject();
		const baseUrl = tsConfig.compilerOptions.baseUrl;

		const withBaseUrl = (value: string) =>
			path.relative(process.cwd(), path.resolve(baseUrl, value));

		const aliases = Object.fromEntries(
			Object.entries(tsConfig.compilerOptions.paths).map(([key, values]) => [
				key.replace("/*", ""),
				values.map((value) =>
					path.resolve(
						process.cwd(),
						this.srcDistMapper.distFromSrc(
							withBaseUrl(value.replace("/*", "")),
						),
					),
				),
			]),
		);

		this.resolver = new ResolverFactory({
			extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".mjs", ".cjs"],
			extensionAlias: {
				".js": [".js", ".ts", ".tsx"],
				".jsx": [".jsx", ".tsx"], // probably redundant
				".ts": [".ts", ".tsx", ".js"],
				".tsx": [".tsx", ".jsx"], // probably redundant
			},
			alias: aliases,
		});
	}

	reformat(absoluteSourceUri: string, relativeRefUri: string): string {
		const absoluteSourceDirUri = path.dirname(absoluteSourceUri);

		const { path: absoluteResolvedUri } = this.resolver.sync(
			absoluteSourceDirUri,
			relativeRefUri,
		);

		if (!absoluteResolvedUri) {
			return relativeRefUri;
		}

		if (!absoluteResolvedUri.startsWith(this.outDir.absoluteUri)) {
			return relativeRefUri;
		}

		return new RelativeSpecifier(
			path.relative(absoluteSourceDirUri, absoluteResolvedUri),
		).uri;
	}
}
