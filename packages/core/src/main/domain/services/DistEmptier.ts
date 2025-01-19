import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository.js";
import { logger } from "../../../shared/supporting/logger.js";

export class DistEmptier {
	constructor(private readonly filesRepository: FilesRepository) {}

	async remove(outdir: string): Promise<void> {
		try {
			await this.filesRepository.remove(outdir);
			logger.debug(`Emptied ${outdir}`);
		} catch {
			logger.debug(`Already empty ${outdir}`);
		}
	}
}
