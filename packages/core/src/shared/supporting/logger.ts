const padding = 10;

export const logger = {
	debug: (message: string, ...messages: string[]) => {
		return console.debug(
			"debug".padEnd(padding, " "),
			"🌳",
			message,
			...messages,
		);
	},
	pending: (message: string, ...messages: string[]) => {
		return console.log(
			"pending".padEnd(padding, " "),
			"🥕",
			message,
			...messages,
		);
	},
	success: (message: string, ...messages: string[]) => {
		return console.log(
			"success".padEnd(padding, " "),
			"🌱",
			message,
			...messages,
		);
	},
	error: (message: string, ...messages: string[]) => {
		return console.error(
			"error".padEnd(padding, " "),
			"🌶️",
			message,
			...messages,
		);
	},
	hint: (message: string, ...messages: string[]) => {
		return console.error(
			"hint".padEnd(padding, " "),
			"💡",
			message,
			...messages,
		);
	},
};
