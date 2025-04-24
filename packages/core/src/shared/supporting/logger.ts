const padding = 10;

export const logger = {
	debug: (message: string, ...messages: string[]) => {
		if (
			process.env.NODE_ENV === "development" ||
			process.env.DEBUG === "true"
		) {
			console.debug("debug".padStart(padding, " "), "--", message, ...messages);
		}
	},
	success: (message: string, ...messages: string[]) => {
		console.log("success".padStart(padding, " "), "⚡️", message, ...messages);
	},
	error: (message: string, ...messages: string[]) => {
		console.error("error".padStart(padding, " "), "🌶️", message, ...messages);
	},
	hint: (message: string, ...messages: string[]) => {
		console.log("hint".padStart(padding, " "), "💡", message, ...messages);
	},
	warn: (message: string, ...messages: string[]) => {
		console.warn(
			"warning".padStart(padding, " "),
			"⚠️",
			message.includes("\n") ? `${message}\n` : message,
			...messages,
		);
	},
};
