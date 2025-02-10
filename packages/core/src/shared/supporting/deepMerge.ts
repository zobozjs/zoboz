export function deepMerge<T>(target: Partial<T>, source: Partial<T>): T {
	const result = { ...target };

	for (const key of Object.keys(source)) {
		const value = source[key as keyof T];
		if (
			value &&
			typeof value === "object" &&
			!Array.isArray(value) &&
			value !== null
		) {
			// If the current value is an object, merge it recursively
			result[key as keyof T] = deepMerge(
				// @ts-ignore
				result[key as keyof T] || ({} as T),
				value,
			);
		} else {
			// @ts-ignore
			result[key as keyof T] = value;
		}
	}

	return result as T;
}
