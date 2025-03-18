use std::path::Path;

use oxc_module_resolver::create_oxc_module_resolver;

use super::{
    tsconfig_reader::{self, TsConfig},
    value_objects::{AbsoluteOutputDir, AbsolutePackageDir, AbsoluteSourceDir},
};

mod oxc_module_resolver;

pub struct UltimateModuleResolver {
    resolver: oxc_resolver::Resolver,
    absolute_base_url: Option<String>,
    src_dir: String,
    out_dir: String,
}

pub enum ResolverStrategy {
    Regular,
    WithBaseUrl,
    WithSrcGhost,
}

impl UltimateModuleResolver {
    pub fn new(
        package_dir: &AbsolutePackageDir,
        src_dir: &AbsoluteSourceDir,
        out_dir: &AbsoluteOutputDir,
    ) -> Self {
        let tsconfig = tsconfig_reader::get_tsconfig(package_dir);
        let resolver = create_oxc_module_resolver(&tsconfig, src_dir, out_dir);

        Self {
            resolver,
            absolute_base_url: get_absolute_base_url(&tsconfig, package_dir, src_dir, out_dir),
            src_dir: src_dir.value().to_string_lossy().to_string(),
            out_dir: out_dir.value().to_string_lossy().to_string(),
        }
    }

    pub fn resolve_package_json_path(
        &self,
        dependent_dir: &Path,
        dependency_package_name: &str,
    ) -> Result<String, String> {
        let resolution = self
            .resolver
            .resolve(dependent_dir, &dependency_package_name);

        match resolution {
            Err(_) => return Err("RESOLVE_FAILED".to_string()),
            Ok(resolution) => {
                if resolution.package_json().is_none() {
                    return Err("PACKAGE_JSON_NOT_FOUND".to_string());
                }

                let package_json_path = resolution
                    .package_json()
                    .unwrap()
                    .realpath
                    .to_string_lossy()
                    .to_string();

                Ok(package_json_path)
            }
        }
    }

    pub fn resolve(
        &self,
        dependent_path: &Path,
        specifier: &str,
        resolver_strategy: ResolverStrategy,
    ) -> Result<String, String> {
        let dependent_dirname: Option<&str> = dependent_path.parent().and_then(|p| p.to_str());

        if dependent_dirname.is_none() {
            return Err("DIRNAME_NOT_FOUND".to_string());
        }

        let dependent_dirname = dependent_dirname.unwrap();

        let (source_dirname, specifier_for_resolver) = match resolver_strategy {
            ResolverStrategy::Regular => (dependent_dirname.to_string(), specifier.to_string()),
            ResolverStrategy::WithBaseUrl => (
                self.absolute_base_url.as_ref().unwrap().to_string(),
                format!("./{}", specifier),
            ),
            ResolverStrategy::WithSrcGhost => (
                dependent_dirname.replace(&self.out_dir, &self.src_dir),
                specifier.to_string(),
            ),
        };

        let resolved = self
            .resolver
            .resolve(source_dirname.clone(), &specifier_for_resolver);

        match resolved {
            Err(resolve_error) => {
                match resolver_strategy {
                    ResolverStrategy::Regular => {
                        // is relative specifier
                        if specifier.starts_with("./") || specifier.starts_with("../") {
                            // try to resolve with imaginary source as base url
                            return self.resolve(
                                dependent_path,
                                specifier,
                                ResolverStrategy::WithSrcGhost,
                            );
                        }

                        // is absolute specifier
                        if self.absolute_base_url.is_some() {
                            return self.resolve(
                                dependent_path,
                                specifier,
                                ResolverStrategy::WithBaseUrl,
                            );
                        }

                        return Err(resolve_error.to_string());
                    }
                    ResolverStrategy::WithBaseUrl => {
                        return Err(resolve_error.to_string());
                    }
                    ResolverStrategy::WithSrcGhost => {
                        return Err(resolve_error.to_string());
                    }
                }
            }
            Ok(resolved) => {
                return Ok(resolved.path().to_string_lossy().to_string());
            }
        }
    }
}

fn get_absolute_base_url(
    tsconfig: &TsConfig,
    package_dir: &AbsolutePackageDir,
    src_dir: &AbsoluteSourceDir,
    out_dir: &AbsoluteOutputDir,
) -> Option<String> {
    if tsconfig.compiler_options.base_url.is_empty() {
        return None;
    }

    let base_url = package_dir
        .value()
        .join(&tsconfig.compiler_options.base_url)
        .to_string_lossy()
        // turn src_dir based absolute paths to out_dir based absolute paths
        .replace(
            src_dir.value().to_str().unwrap(),
            out_dir.value().to_str().unwrap(),
        );

    Some(base_url)
}
