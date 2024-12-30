export function map<T, U>(array: T[], callback: (item: T) => U): U[] {
	const result: U[] = [];
	for (const item of array) {
		result.push(callback(item));
	}
	return result;
}
