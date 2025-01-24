import * as fs from "fs";
import * as path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { ResolverFactory } from "oxc-resolver";
import typescript from "typescript";

const resolver = new ResolverFactory({
	extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".mjs", ".cjs"],
	extensionAlias: {
		".js": [".ts", ".tsx"],
		".jsx": [".tsx"],
	},
});

export async function resolve(specifier, context, nextResolve) {
	const parentURL = asUrl(context.parentURL);

	if ([".", "/"].every((x) => !specifier.startsWith(x))) {
		return nextResolve(specifier, { ...context, parentURL }, nextResolve);
	}

	return {
		url: pathToFileURL(resolveFile(specifier, parentURL)).href,
		shortCircuit: true,
	};
}

function resolveFile(specifier, parentURL) {
	const parentPath = path.dirname(fileURLToPath(parentURL));
	const { path: resolved } = resolver.sync(parentPath, specifier);

	if (!resolved) {
		throw new Error(`Cannot resolve module ${specifier} from ${parentURL}`);
	}

	return resolved;
}

export async function load(url, context, nextLoad) {
	if (!url.endsWith(".ts") && !url.endsWith(".tsx")) {
		return nextLoad(url, context, nextLoad);
	}

	const sourceCode = await fs.promises.readFile(asUrl(url), "utf8");
	const { outputText: code } = typescript.transpileModule(sourceCode, {
		compilerOptions: {
			module: typescript.ModuleKind.ESNext,
			target: typescript.ScriptTarget.ESNext,
			esModuleInterop: true,
			experimentalDecorators: true,
			emitDecoratorMetadata: true,
			useDefineForClassFields: false,
		},
		fileName: url,
	});

	return {
		format: "module",
		source: code,
		shortCircuit: true,
	};
}

function asUrl(url) {
	return url.startsWith("file:") ? new URL(url) : pathToFileURL(url);
}
