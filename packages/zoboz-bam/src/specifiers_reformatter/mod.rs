use cli_flags::get_params;
use file_updater::{update_cjs, update_dts, update_esm};
use file_walker::walk_files_recursively;
use reformatter::Reformatter;

use crate::shared::{
    ultimate_module_resolver,
    value_objects::{AbsoluteOutputDir, AbsolutePackageDir, AbsoluteSourceDir, OutputFormat},
};

mod cli_flags;
mod file_updater;
mod file_walker;
mod reformatter;

pub fn run_by_args(args: &[String]) -> Result<(), String> {
    let (output_format, absolute_package_dir, absolute_source_dir, absolute_output_dir) =
        get_params(args)?;

    run_by_params(
        &output_format,
        &absolute_package_dir,
        &absolute_source_dir,
        &absolute_output_dir,
    )
}

pub fn run_by_params(
    output_format: &OutputFormat,
    absolute_package_dir: &AbsolutePackageDir,
    absolute_source_dir: &AbsoluteSourceDir,
    absolute_output_dir: &AbsoluteOutputDir,
) -> Result<(), String> {
    if !absolute_source_dir.is_package_dir_child(&absolute_package_dir) {
        return Err("Source directory must be inside the package directory".to_string());
    }

    if !absolute_output_dir.is_package_dir_child(&absolute_package_dir) {
        return Err("Output directory must be inside the package directory".to_string());
    }

    let extensions: &[&str] = match output_format.value() {
        "esm" => &["js", "jsx", "mjs", "mjsx"],
        "cjs" => &["js", "jsx", "cjs", "cjsx"],
        "dts" => &["ts", "tsx"],
        _ => &["js", "jsx"],
    };

    let resolver = ultimate_module_resolver::UltimateModuleResolver::new(
        &absolute_package_dir,
        &absolute_source_dir,
        &absolute_output_dir,
    );

    let reformatter = Reformatter::new(resolver, &absolute_output_dir);

    walk_files_recursively(
        &absolute_output_dir.value(),
        extensions,
        &|file_path, file_content| match output_format.value() {
            "esm" => update_esm(&reformatter, file_path, file_content),
            "cjs" => update_cjs(&reformatter, file_path, file_content),
            "dts" => update_dts(&reformatter, file_path, file_content),
            _ => panic!("Invalid format"),
        },
    )
    .unwrap();

    Ok(())
}
