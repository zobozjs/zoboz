use std::path::Path;

use crate::shared::{
    ultimate_module_resolver::{ResolverStrategy, UltimateModuleResolver},
    utils,
    value_objects::AbsolutePackageDir,
};

pub(super) struct Reformatter {
    ultimate_module_resolver: UltimateModuleResolver,
    package_dir: String,
    node_modules: String,
}

impl Reformatter {
    pub(super) fn new(
        ultimate_module_resolver: UltimateModuleResolver,
        package_dir: &AbsolutePackageDir,
    ) -> Self {
        Self {
            ultimate_module_resolver,
            package_dir: package_dir.value().to_string_lossy().to_string(),
            node_modules: package_dir
                .value()
                .join("node_modules")
                .to_string_lossy()
                .to_string(),
        }
    }

    pub(super) fn reformat(&self, dependent_path: &Path, specifier: &str) -> String {
        match self.ultimate_module_resolver.resolve(
            dependent_path,
            specifier,
            ResolverStrategy::Regular,
        ) {
            Ok(resolved_path) => {
                if !resolved_path.starts_with(&self.package_dir)
                    || resolved_path.starts_with(&self.node_modules)
                {
                    return specifier.to_string();
                }

                let relative_path =
                    utils::relative(dependent_path.parent().unwrap(), resolved_path);

                let relative_path = utils::ensure_relative_prefix(relative_path);

                if relative_path.ends_with(".d.ts") {
                    relative_path.replace(".d.ts", ".js")
                } else {
                    relative_path
                }
            }
            Err(_) => {
                return specifier.to_string();
            }
        }
    }
}
