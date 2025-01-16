import { FileNode } from "../../../shared/domain/entities/FileNode.js";
import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository.js";
import { logger } from "../../../shared/supporting/logger.js";

export class DistEmptier {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly packageDir: FileNode,
	) {}

	async remove(outdir: string): Promise<void> {
		try {
			const file = FileNode.fromUri(outdir, this.filesRepository);
			await file.remove();
			logger.debug(`Emptied ${await this.getRelativeOutputUri(outdir)}`);
		} catch {
			logger.debug(`Already empty ${await this.getRelativeOutputUri(outdir)}`);
		}
	}

	private getRelativeOutputUri(outdir: string) {
		return this.packageDir.getRelativeUriOf(outdir);
	}
}
