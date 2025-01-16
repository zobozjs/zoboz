import { NodeCommonJsReferenceChanger } from "./commonjs/infra/NodeCommonJsReferenceChanger";
import { NodeModuleReferenceChanger } from "./module/infra/NodeModuleReferenceChanger";
import { NodeExtensionChanger } from "./shared/infra/NodeExtensionChanger";
import { NodeFsFilesRepository } from "./shared/infra/NodeFsFilesRepository";
import { NodeProcessCommandRunner } from "./tsc/infra/NodeProcessCommandRunner";

export const filesRepository = new NodeFsFilesRepository();
export const extensionChanger = new NodeExtensionChanger(filesRepository);

export const moduleReferenceChanger = new NodeModuleReferenceChanger(
	filesRepository,
);

export const commonJsReferenceChanger = new NodeCommonJsReferenceChanger(
	filesRepository,
);

export const nodeProcessCommandRunner = new NodeProcessCommandRunner();
