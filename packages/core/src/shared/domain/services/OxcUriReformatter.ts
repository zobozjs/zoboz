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
	private readonly absoluteDistBaseUrl: string;

	constructor(
		private readonly outDir: OutDir,
		private readonly srcDistMapper: SrcDistMapper,
	) {
		const tsConfig = TsConfig.fromCurrentProject();
		const absoluteBaseUrl = tsConfig.compilerOptions.baseUrl;

		const withBaseUrl = (value: string) =>
			path.relative(process.cwd(), path.resolve(absoluteBaseUrl, value));

		this.absoluteDistBaseUrl = path.resolve(
			process.cwd(),
			this.srcDistMapper.distFromSrc(withBaseUrl("")),
		);

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
			builtinModules: true,
		});
	}

	reformat(
		absoluteSourceUri: string,
		relativeRefUri: string,
		isTryingBaseUrl?: boolean,
	): string {
		const absoluteSourceDirUri = path.dirname(absoluteSourceUri);

		const sourceDir = isTryingBaseUrl
			? this.absoluteDistBaseUrl
			: absoluteSourceDirUri;

		const specifier = isTryingBaseUrl
			? new RelativeSpecifier(relativeRefUri).uri
			: relativeRefUri;

		const { path: absoluteResolvedUri } = this.resolver.sync(
			sourceDir,
			specifier,
		);

		if (!absoluteResolvedUri) {
			if (this.absoluteDistBaseUrl && !isTryingBaseUrl) {
				return this.reformat(absoluteSourceUri, relativeRefUri, true);
			}

			return relativeRefUri;
		}

		if (!absoluteResolvedUri.startsWith(this.outDir.absoluteUri)) {
			return relativeRefUri;
		}

		const formattedRelativeUri = new RelativeSpecifier(
			path.relative(absoluteSourceDirUri, absoluteResolvedUri),
		).uri;

		return formattedRelativeUri;
	}
}
