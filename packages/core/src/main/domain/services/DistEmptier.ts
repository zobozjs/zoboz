import { FileNode } from "../../../shared/domain/entities/FileNode.js";
import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository.js";
import { logger } from "../../../shared/supporting/logger.js";

export class DistEmptier {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly packageDir: FileNode,
		private readonly outdir: string,
	) {}

	async remove(): Promise<void> {
		try {
			const file = FileNode.fromUri(this.outdir, this.filesRepository);
			await file.remove();
			logger.debug(`Emptied ${await this.getRelativeOutputUri()}`);
		} catch {
			logger.debug(`Already empty ${await this.getRelativeOutputUri()}`);
		}
	}

	private getRelativeOutputUri() {
		return this.packageDir.getRelativeUriOf(this.outdir);
	}
}
