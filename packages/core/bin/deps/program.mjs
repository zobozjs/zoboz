import { argv } from "process";

export const program = {
	name: "zoboz",
	version: "1.0.0",
	description: "CLI for 🐐 zoboz | d.ts + esm + cjs - hassle",
	commands: {},
	registerCommand(name, description, options, action) {
		this.commands[name] = { description, options, action };
	},
	printHelp() {
		console.log(`${this.name} - ${this.description}\n`);
		console.log("Usage:");
		console.log(`  ${this.name} <command> [options]\n`);
		console.log("Commands:");
		for (const [commandName, command] of Object.entries(this.commands)) {
			console.log(`  ${commandName}  ${command.description}`);
			if (command.options.length > 0) {
				console.log("    Options:");
				for (const option of command.options) {
					console.log(`      ${option.flag}  ${option.description}`);
				}
			}
		}
		console.log("\nOptions:");
		console.log("  -h, --help      Show help");
		console.log("  -v, --version   Show version information");
	},
	parse() {
		const args = argv.slice(2);

		if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
			this.printHelp();
			return;
		}

		if (args.includes("-v") || args.includes("--version")) {
			console.log(`${this.name} version ${this.version}`);
			return;
		}

		const [commandName, ...commandArgs] = args;
		const command = this.commands[commandName];
		if (!command) {
			console.error(`Unknown command: "${commandName}"`);
			console.error("Use -h or --help for usage information.");
			process.exit(1);
		}

		const options = {};
		for (const option of command.options) {
			const index = commandArgs.indexOf(option.flag);
			if (index !== -1) {
				options[option.name] = true;
			} else {
				options[option.name] = false;
			}
		}

		command.action(options);
	},
};
