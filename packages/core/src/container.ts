import { ZobozRs } from "@shared/domain/services/ZobozRs";
import { NodeFsFilesRepository } from "@shared/infra/NodeFsFilesRepository";
import { NodeProcessCommandRunner } from "./builder-tsc/infra/NodeProcessCommandRunner";

export const filesRepository = new NodeFsFilesRepository();
export const nodeProcessCommandRunner = new NodeProcessCommandRunner();
export const zobozRs = new ZobozRs(filesRepository.getPackageDir());
