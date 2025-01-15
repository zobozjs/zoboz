export interface FilesRepository {
	getPackageDir: () => Promise<string>;
	isDir: (uri: string) => Promise<boolean>;
	mv: (fromUri: string, toUri: string) => Promise<void>;
	remove: (uri: string) => Promise<void>;
	children(uri: string): Promise<string[]>;
	read: (uri: string) => Promise<string>;
	write: (uri: string, content: string) => Promise<void>;
}
