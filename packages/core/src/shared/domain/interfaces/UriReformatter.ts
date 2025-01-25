export interface UriReformatter {
	reformat(absoluteSourceUri: string, relativeRefUri: string): string;
}
