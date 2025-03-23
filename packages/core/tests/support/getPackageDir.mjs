import path from "path";
import { fileURLToPath } from "url";

export function getPackageDir() {
	const relativePath = "../..";

	const filename = fileURLToPath(import.meta.url);

	return path.resolve(path.dirname(filename), relativePath);
}
