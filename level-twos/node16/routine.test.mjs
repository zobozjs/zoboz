// auto-generated by ./scripts/hydrate.sh
import * as assert from "node:assert";
import coreEs2022Default, * as coreEs2022 from "@level-ones/core-es2022";

assert.strictEqual(coreEs2022Default, "core-es2022");

assert.deepStrictEqual(
	coreEs2022.filter((x) => x % 2 === 0, [1, 2, 3, 4, 5]),
	[2, 4],
);

assert.deepStrictEqual(
	coreEs2022.map((x) => x * 2, [1, 2, 3, 4, 5]),
	[2, 4, 6, 8, 10],
);
