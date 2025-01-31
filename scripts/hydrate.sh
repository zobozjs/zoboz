#!/usr/bin/env bash

find . -name "filter.ts" -exec sh -c 'echo """// auto-generated by ./scripts/hydrate.sh
export function filter<T>(callback: (item: T) => boolean, array: T[]): T[] {
	const result: T[] = [];
	for (const item of array) {
		if (callback(item)) {
			result.push(item);
		}
	}
	return result;
}""" > {}' \;

find . -name "map.ts" -exec sh -c 'echo """// auto-generated by ./scripts/hydrate.sh
export function map<T, U>(callback: (item: T) => U, array: T[]): U[] {
	const result: U[] = [];
	for (const item of array) {
		result.push(callback(item));
	}
	return result;
}""" > {}' \;

find . -name "level-two.test.cjs" -exec sh -c 'echo """// auto-generated by ./scripts/hydrate.sh
const assert = require(\"node:assert\");

const packages = [
	require(\"@level-ones/core-bundler\"),
	require(\"@level-ones/core-node10\"),
	require(\"@level-ones/core-node16\"),
	require(\"@level-ones/esbuild-bundler\"),
	require(\"@level-ones/esbuild-node10\"),
	require(\"@level-ones/esbuild-node16\"),
];

for (const pkg of packages) {
	assert.strictEqual(typeof pkg.default, \"string\");

	assert.deepStrictEqual(
		pkg.filter((x) => x % 2 === 0, [1, 2, 3, 4, 5]),
		[2, 4],
	);

	assert.deepStrictEqual(
		pkg.map((x) => x * 2, [1, 2, 3, 4, 5]),
		[2, 4, 6, 8, 10],
	);
}""" > {}' \;

find . -name "level-two.test.mjs" -exec sh -c 'echo """// auto-generated by ./scripts/hydrate.sh
import * as assert from \"node:assert\";
import * as coreBundler from \"@level-ones/core-bundler\";
import * as coreNode10 from \"@level-ones/core-node10\";
import * as coreNode16 from \"@level-ones/core-node16\";
import * as esbuildV0Bundler from \"@level-ones/esbuild-bundler\";
import * as esbuildV0Node10 from \"@level-ones/esbuild-node10\";
import * as esbuildV0Node16 from \"@level-ones/esbuild-node16\";

const packages = [
	coreBundler,
	coreNode10,
	coreNode16,
	esbuildV0Bundler,
	esbuildV0Node10,
	esbuildV0Node16,
];

for (const pkg of packages) {
	assert.strictEqual(typeof pkg.default, \"string\");

	assert.deepStrictEqual(
		pkg.filter((x) => x % 2 === 0, [1, 2, 3, 4, 5]),
		[2, 4],
	);

	assert.deepStrictEqual(
		pkg.map((x) => x * 2, [1, 2, 3, 4, 5]),
		[2, 4, 6, 8, 10],
	);
}""" > {}' \;
