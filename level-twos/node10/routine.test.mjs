// auto-generated by ./scripts/hydrate.sh
import * as assert from "node:assert";
import * as coreBundler from "@level-ones/core-bundler";
import * as coreClassic from "@level-ones/core-classic";
import * as coreNode10 from "@level-ones/core-node10";
import * as coreNode16 from "@level-ones/core-node16";
import * as esbuildV0Bundler from "@level-ones/esbuild-v0-bundler";
import * as esbuildV0Classic from "@level-ones/esbuild-v0-classic";
import * as esbuildV0Node10 from "@level-ones/esbuild-v0-node10";
import * as esbuildV0Node16 from "@level-ones/esbuild-v0-node16";

const packages = [
	coreBundler,
	coreClassic,
	coreNode10,
	coreNode16,
	esbuildV0Bundler,
	esbuildV0Classic,
	esbuildV0Node10,
	esbuildV0Node16,
];

for (const pkg of packages) {
  assert.strictEqual(typeof pkg.default, "string");

	assert.deepStrictEqual(
		pkg.filter((x) => x % 2 === 0, [1, 2, 3, 4, 5]),
		[2, 4],
	);

	assert.deepStrictEqual(
		pkg.map((x) => x * 2, [1, 2, 3, 4, 5]),
		[2, 4, 6, 8, 10],
	);
}
