import assert from "node:assert";
import { Given, When, Then, type DataTable } from "@cucumber/cucumber";
import type { ZobozCoreWorld } from "../support/ZobozCoreWorld.js";

Given("the user created a new package", function (this: ZobozCoreWorld) {
	this.initPackage();
});

Given(
	"they wrote in {string} the following content:",
	function (this: ZobozCoreWorld, filePath: string, fileContent: string) {
		this.writeFile(filePath, fileContent);
	},
);

Given(
	"they in package.json set {string} to {string}",
	function (this: ZobozCoreWorld, key: string, value: string) {
		this.setPackageJsonContent(key, value);
	},
);

When("they run {string}", function (this: ZobozCoreWorld, command: string) {
	this.runCommand(command);
});

Then(
	"the following files should be created:",
	function (this: ZobozCoreWorld, filesTable: DataTable) {
		const files = filesTable.rows().map((x) => x[0]);
		this.assertFilesExist(files);
	},
);

Then(
	"the file {string} should have the following content:",
	function (this: ZobozCoreWorld, filePath: string, fileContent: string) {
		const content = this.readFile(filePath);
		assert.strictEqual(content.trim(), fileContent.trim());
	},
);

Then(
	"the file {string} should contain {string}",
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
