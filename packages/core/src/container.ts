import { ZobozBam } from "@shared/domain/services/ZobozBam";
import { NodeFsFilesRepository } from "@shared/infra/NodeFsFilesRepository";
import { NodeProcessCommandRunner } from "./builder-tsc/infra/NodeProcessCommandRunner";

export const filesRepository = new NodeFsFilesRepository();
export const nodeProcessCommandRunner = new NodeProcessCommandRunner();
export const zobozBam = new ZobozBam(filesRepository.getPackageDir());
