export interface FilesRepository {
	getPackageDir: () => string;
	getAbsoluteUri: (uri: string) => string;
	getRelativeUri: (uri: string) => string;
	isDir: (uri: string) => Promise<boolean>;
	mv: (fromUri: string, toUri: string) => Promise<void>;
	remove: (uri: string) => Promise<void>;
	children(uri: string): Promise<string[]>;
	read: (uri: string) => Promise<string>;
	write: (uri: string, content: string) => Promise<void>;
	listFilesRecursively: (uri: string) => Promise<string[]>;
	mkdir(absolutePath: string): Promise<void>;
}
