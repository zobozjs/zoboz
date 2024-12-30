export function filter<T>(array: T[], callback: (item: T) => boolean): T[] {
	const result: T[] = [];
	for (const item of array) {
		if (callback(item)) {
			result.push(item);
		}
	}
	return result;
}
