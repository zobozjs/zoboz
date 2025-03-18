import assert from "node:assert";
import { type DataTable, Given, Then, When } from "@cucumber/cucumber";
import type { ZobozCoreWorld } from "../support/ZobozCoreWorld.js";

Given("a new package is created", function (this: ZobozCoreWorld) {
	this.initPackage();
});

Given(
	"file {string} reads as:",
	function (this: ZobozCoreWorld, filePath: string, fileContent: string) {
		this.writeFile(filePath, fileContent);
	},
);

Given(
	"package.json sets {string} to {string}",
	function (this: ZobozCoreWorld, key: string, value: string) {
		this.setPackageJsonContent(key, value);
	},
);

When("command {string} runs", function (this: ZobozCoreWorld, command: string) {
	this.runCommand(command);
});

Then(
	"the following files should exist:",
	function (this: ZobozCoreWorld, filesTable: DataTable) {
		const files = filesTable.rows().map((x) => x[0]);
		this.assertFilesExist(files);
	},
);

Then(
	"file {string} should read as:",
	function (this: ZobozCoreWorld, filePath: string, fileContent: string) {
		const content = this.readFile(filePath);
		assert.strictEqual(content.trim(), fileContent.trim());
	},
);

Then(
	"file {string} should contain {string}",
	function (this: ZobozCoreWorld, filePath: string, keyword: string) {
		const content = this.readFile(filePath);
		if (!content.includes(keyword)) {
			throw new Error(
				`keyword {${keyword}} does not exist in file content: """\n${content}"""`,
			);
		}
	},
);

Then(
	"the command should fail with the following output:",
	function (this: ZobozCoreWorld, errorOutput: string) {
		const stderr = this.getStderr();
		assert.strictEqual(stderr?.trim(), errorOutput.trim());
	},
);
