import assert from "node:assert";
import { type DataTable, Given, Then, When } from "@cucumber/cucumber";
import type { Lab } from "../support/Lab.js";

Given("a new package is created", function (this: Lab) {
	this.initPackage();
});

Given(
	"file {string} reads as:",
	function (this: Lab, filePath: string, fileContent: string) {
		this.writeFile(filePath, fileContent);
	},
);

Given(
	"package.json sets {string} to {string}",
	function (this: Lab, key: string, value: string) {
		this.setInPackageJson(key, value);
	},
);

When("command {string} runs", function (this: Lab, command: string) {
	this.runCommand(command);
});

Then(
	"the following files should exist:",
	function (this: Lab, filesTable: DataTable) {
		const files = filesTable.rows().map((x) => x[0]);
		this.assertFilesExist(files);
	},
);

Then(
	"file {string} should read as:",
	function (this: Lab, filePath: string, fileContent: string) {
		const content = this.readFile(filePath);
		assert.strictEqual(content.trim(), fileContent.trim());
	},
);

Then(
	"file {string} should contain {string}",
	function (this: Lab, filePath: string, keyword: string) {
		const content = this.readFile(filePath);
		if (!content.includes(keyword)) {
			throw new Error(
				`keyword {${keyword}} does not exist in file content: """\n${content}"""`,
			);
		}
	},
);

Then(
	"file {string} should not contain {string}",
	function (this: Lab, filePath: string, keyword: string) {
		const content = this.readFile(filePath);
		if (content.includes(keyword)) {
			throw new Error(
				`keyword {${keyword}} exists in file content: """\n${content}"""`,
			);
		}
	},
);

Then(
	"the command should fail with the following output:",
	function (this: Lab, errorOutput: string) {
		const stderr = this.getStderr();
		assert.strictEqual(stderr?.trim(), errorOutput.trim());
	},
);

Then("the command should succeed", function (this: Lab) {
	const stderr = this.getStderr();
	assert.strictEqual(stderr, null);
});

Then(
	"file {string} should contain {string} but not {string}",
	function (
		this: Lab,
		filePath: string,
		expectToExist: string,
		expectToMiss: string,
	) {
		const content = this.readFile(filePath);

		if (!content.includes(expectToExist)) {
			throw new Error(
				`keyword {${expectToExist}} does not exist in file content: """\n${content}"""`,
			);
		}

		if (content.includes(expectToMiss)) {
			throw new Error(
				`keyword {${expectToMiss}} exists in file content: """\n${content}"""`,
			);
		}
	},
);
