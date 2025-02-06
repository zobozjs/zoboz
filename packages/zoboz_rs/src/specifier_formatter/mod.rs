use cli_flags::get_params;
use file_updater::{update_cjs, update_dts, update_esm};
use file_walker::walk_files_recursively;
use specifier_formatter::SpecifierFormatter;

use crate::shared::{
    tsconfig_reader,
    value_objects::{self, AbsoluteOutputDir, AbsoluteSourceDir, DistFormat, PackageDir},
};

mod cli_flags;
mod file_updater;
mod file_walker;
mod module_resolver;
mod specifier_formatter;

pub fn run_by_args(args: &[String]) {
    let (dist_format, absolute_package_dir, absolute_source_dir, absolute_output_dir) =
        get_params(args);

    run_by_params(
        &dist_format,
        &absolute_package_dir,
        &absolute_source_dir,
        &absolute_output_dir,
    );
}

pub fn run_by_params(
    dist_format: &str,
    absolute_package_dir: &str,
    absolute_source_dir: &str,
    absolute_output_dir: &str,
) {
    println!(
        "Running specifier formatter with dist format: {}, source dir: {}, output dir: {}",
        dist_format, absolute_source_dir, absolute_output_dir
    );

    let dist_format = DistFormat::new(dist_format).unwrap();
    let package_dir = PackageDir::new(absolute_package_dir).unwrap();
    let absolute_source_dir = AbsoluteSourceDir::new(absolute_source_dir).unwrap();
    let absolute_output_dir = AbsoluteOutputDir::new(absolute_output_dir).unwrap();

    let extensions: &[&str] = match dist_format.value() {
        "esm" => &["js", "jsx", "mjs", "mjsx"],
        "cjs" => &["js", "jsx", "cjs", "cjsx"],
        "dts" => &["ts", "tsx"],
        _ => &["js", "jsx"],
    };

    if !absolute_source_dir.is_package_dir_child(&package_dir) {
        panic!("Source directory must be inside the package directory");
    }

    if !absolute_output_dir.is_package_dir_child(&package_dir) {
        panic!("Output directory must be inside the package directory");
    }

    let specifier_formatter =
        SpecifierFormatter::new(&package_dir, &absolute_source_dir, &absolute_output_dir);

    walk_files_recursively(
        &absolute_output_dir.value(),
        extensions,
        &|file_path, file_content| match dist_format.value() {
            "esm" => update_esm(&specifier_formatter, file_path, file_content),
            "cjs" => update_cjs(&specifier_formatter, file_path, file_content),
            "dts" => update_dts(&specifier_formatter, file_path, file_content),
            _ => panic!("Invalid format"),
        },
    )
    .unwrap();
}
