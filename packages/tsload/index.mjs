// biome-ignore lint/style/useNodejsImportProtocol: backward-compatibility
import * as fs from "fs";
// biome-ignore lint/style/useNodejsImportProtocol: backward-compatibility
import * as path from "path";
// biome-ignore lint/style/useNodejsImportProtocol: backward-compatibility
import * as url from "url";
import typescript from "typescript";

export async function resolve(specifier, context, defaultResolve) {
	if ([".", "/"].every((x) => !specifier.startsWith(x))) {
		return defaultResolve(specifier, context, defaultResolve);
	}

	const typescriptFilePath = resolveTypescriptFile(
		specifier,
		context.parentURL,
	);

	return {
		url: url.pathToFileURL(typescriptFilePath).href,
		shortCircuit: true,
	};
}

function resolveTypescriptFile(specifier, parentURL) {
	const baseDir = url.fileURLToPath(new URL(".", parentURL));

	const candidates = [
		specifier,
		`${specifier}.ts`,
		specifier.replace(".js", ".ts"),
		path.join(specifier, "index.ts"),
	];

	for (const candidate of candidates) {
		const candidateFilePath = path.resolve(baseDir, candidate);
		if (fs.existsSync(candidateFilePath)) {
			return candidateFilePath;
		}
	}

	throw new Error(`Cannot resolve module '${specifier}' from '${parentURL}'`);
}

export async function load(url, context, defaultLoad) {
	if (!url.endsWith(".ts")) {
		return defaultLoad(url, context, defaultLoad);
	}

	const sourceCode = await fs.promises.readFile(new URL(url), "utf8");
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
