import { NodeFsFilesRepository } from "./shared/infra/NodeFsFilesRepository";
import { NodeProcessCommandRunner } from "./tsc/infra/NodeProcessCommandRunner";

export const filesRepository = new NodeFsFilesRepository();
export const nodeProcessCommandRunner = new NodeProcessCommandRunner();
