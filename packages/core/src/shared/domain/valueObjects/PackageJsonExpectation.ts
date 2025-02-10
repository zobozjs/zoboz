import * as path from "path";
import * as process from "process";
import { logger } from "../../supporting/logger.js";
import { PackageJsonVerificationError } from "../errors/PackageJsonVerificationError.js";
import type { FilesRepository } from "../interfaces/FilesRepository.js";

type PackageJsonExpectationValue = {
	main?: string;
	module?: string;
	types?: string;
	exports?: Record<string, Record<string, string>>;
};

export class PackageJsonExpectation {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly value: PackageJsonExpectationValue,
	) {}

	static mergeAll(
		expectations: PackageJsonExpectation[],
	): PackageJsonExpectation {
		if (expectations.length === 0) {
			throw new Error("No expectations provided");
		}

		return expectations.reduce((packageJsonExpectation, expectation) =>
			packageJsonExpectation.merge(expectation),
		);
	}

	merge(mergingPartner: PackageJsonExpectation): PackageJsonExpectation {
		const newValue = { ...this.value };
		const merging = { ...mergingPartner.value };

		const setOnceKeys = ["main", "module", "types"];

		for (const key of Object.keys(merging)) {
			if (merging[key] === undefined) {
				continue;
			}

			if (setOnceKeys.includes(key)) {
				if (newValue[key] !== undefined) {
					const errorGist = `Cannot merge package.json expectations because key "${key}" is already set`;
					const errorDetails = JSON.stringify({
						current: newValue[key],
						coming: merging[key],
					});
					throw new Error([errorGist, errorDetails].join("; "));
				}

				newValue[key] = merging[key];
			}
		}

		const mergingExports = merging.exports || {};

		if (newValue.exports === undefined) {
			newValue.exports = {};
		}

		for (const exportAliasKey of Object.keys(mergingExports)) {
			const exportAlias = mergingExports[exportAliasKey];
			const exportsTypes = ["types", "require", "import"];

			for (const exportType of exportsTypes) {
				const mergingValue = exportAlias[exportType];

				if (mergingValue === undefined) {
					continue;
				}

				if (newValue.exports[exportType] && mergingValue) {
					throw new Error(
						`Cannot merge package.json expectations because key "exports"."${exportAliasKey}"."${exportType}" is already set`,
					);
				}

				newValue.exports[exportAliasKey] = {
					...newValue.exports[exportAliasKey],
					[exportType]: mergingValue,
				};
			}

			newValue.exports[exportAliasKey] = {
				types: newValue.exports[exportAliasKey].types,
				require: newValue.exports[exportAliasKey].require,
				import: newValue.exports[exportAliasKey].import,
			};
		}

		return new PackageJsonExpectation(
			this.filesRepository,
			this.undefinedOmitted({
				main: newValue.main,
				module: newValue.module,
				types: newValue.types,
				exports: newValue.exports,
			}),
		);
	}

	undefinedOmitted<T>(value: Record<string, T | undefined>): Record<string, T> {
		return JSON.parse(JSON.stringify(value));
	}

	async verifyPackageJson(): Promise<void> {
		const packageJson = await this.getPackageJson();
		const keys = ["main", "module", "types", "exports"] as const;

		const errors: string[] = [];

		logger.pending(
			`Checking package.json matches ${JSON.stringify(this.value, null, 2)}`,
		);

		for (const key of keys) {
			const expected = JSON.stringify(this.value[key], null, 2);
			const actual = JSON.stringify(packageJson[key], null, 2);

			if (expected === undefined && actual !== undefined) {
				errors.push(`Remove "${key}" from package.json`);
			} else if (expected !== undefined && actual === undefined) {
				errors.push(`Add \`"${key}": ${expected}\` to package.json`);
			} else if (expected !== actual) {
				errors.push(`Change \`"${key}" to ${expected}\` in package.json`);
			}
		}

		if (errors.length > 0) {
			const title = "package.json needs the following adjustments:";
			logger.error(
				[title, ...errors.map((x) => `Action Needed: ${x}`)].join("\n"),
			);

			logger.hint('Run "zoboz build --update-package-json" to fix it.');

			throw new PackageJsonVerificationError();
		}

		logger.success("package.json matches zoboz.config.ts");
	}

	async updatePackageJson() {
		const packageJson = await this.getPackageJson();
		const updatedPackageJson = { ...packageJson, ...this.value };
		const updatedPackageJsonText = JSON.stringify(updatedPackageJson, null, 2);

		if (updatedPackageJsonText === JSON.stringify(packageJson, null, 2)) {
			logger.success("package.json is up to date");
			return;
		}

		await this.filesRepository.write(
			this.getPackageJsonUri(),
			`${updatedPackageJsonText}\n`,
		);

		logger.success("Updated package.json");
	}

	private async getPackageJson(): Promise<Record<string, unknown>> {
		const packageJsonUri = this.getPackageJsonUri();
		const text = await this.filesRepository.read(packageJsonUri);
		const packageJson = JSON.parse(text);

		return packageJson;
	}

	private getPackageJsonUri() {
		return path.resolve(process.cwd(), "package.json");
	}
}
