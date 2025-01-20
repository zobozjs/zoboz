import * as fs from "fs";
import * as path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import typescript from "typescript";

export async function resolve(specifier, context, nextResolve) {
	const parentURL = asUrl(context.parentURL);
	if ([".", "/"].every((x) => !specifier.startsWith(x))) {
		return nextResolve(specifier, { ...context, parentURL });
	}

	return {
		url: pathToFileURL(resolveTypescriptFile(specifier, parentURL)).href,
		shortCircuit: true,
	};
}

function resolveTypescriptFile(specifier, parentURL) {
	const baseDir = fileURLToPath(new URL(".", parentURL));

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

export async function load(url, context, nextLoad) {
	if (!url.endsWith(".ts")) {
		return nextLoad(url, context);
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
