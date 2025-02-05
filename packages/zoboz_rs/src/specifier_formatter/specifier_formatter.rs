use std::path::Path;

use crate::shared::{
    utils,
    value_objects::{AbsoluteOutDir, AbsoluteSrcDir, PackageDir},
};

use super::{js_resolver::create_resolver, tsconfig_reader};

pub(super) struct SpecifierFormatter {
    resolver: oxc_resolver::Resolver,
    out_dir: String,
    absolute_base_url: Option<String>,
}

impl SpecifierFormatter {
    pub(super) fn new(
        package_dir: &PackageDir,
        src_dir: &AbsoluteSrcDir,
        out_dir: &AbsoluteOutDir,
    ) -> Self {
        let tsconfig = tsconfig_reader::get_tsconfig(package_dir);
        let resolver = create_resolver(&tsconfig, src_dir, out_dir);

        Self {
            resolver,
            out_dir: out_dir.value().to_string_lossy().to_string(),
            absolute_base_url: get_absolute_base_url(&tsconfig, package_dir, src_dir, out_dir),
        }
    }

    pub(super) fn format(
        &self,
        dependent_path: &Path,
        specifier: &str,
        is_trying_base_url_already: bool,
    ) -> String {
        let dependent_dirname: Option<&str> = dependent_path.parent().and_then(|p| p.to_str());

        if dependent_dirname.is_none() {
            return specifier.to_string();
        }

        let dependent_dirname = dependent_dirname.unwrap();

        let source_dirname = if is_trying_base_url_already {
            self.absolute_base_url.as_ref().unwrap().as_str()
        } else {
            dependent_dirname
        };

        let specifier_for_resolver = if is_trying_base_url_already {
            &format!("./{}", specifier)
        } else {
            specifier
        };

        let resolved = self
            .resolver
            .resolve(source_dirname, specifier_for_resolver);

        if resolved.is_err() {
            if !is_trying_base_url_already && self.absolute_base_url.is_some() {
                return self.format(dependent_path, specifier, true);
            }

            return specifier.to_string();
        }

        let resolved = resolved.unwrap();
        let resolved_path = resolved.path().to_string_lossy();

        if !resolved_path.starts_with(self.out_dir.as_str()) {
            return specifier.to_string();
        }

        let relative_path = utils::relative(dependent_dirname, resolved.path());

        utils::ensure_relative_prefix(relative_path)
    }
}

fn get_absolute_base_url(
    tsconfig: &tsconfig_reader::TsConfig,
    package_dir: &PackageDir,
    src_dir: &AbsoluteSrcDir,
    out_dir: &AbsoluteOutDir,
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
