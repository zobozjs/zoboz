use cli_flags::get_params;
use file_updater::{update_cjs, update_dts, update_esm};
use file_walker::walk_files_recursively;
use specifier_formatter::SpecifierFormatter;

use crate::shared::{
    tsconfig_reader, utils,
    value_objects::{self, AbsoluteOutDir, AbsoluteSrcDir, DistFormat, PackageDir},
};

mod cli_flags;
mod file_updater;
mod file_walker;
mod js_resolver;
mod specifier_formatter;

pub fn run_by_args(args: Vec<String>) {
    let (dist_format, absolute_src_dir, absolute_out_dir) = get_params(args);

    let absolute_package_dir = utils::canonical_from_buf(std::env::current_dir().unwrap())
        .to_string_lossy()
        .to_string();

    run_by_params(
        &dist_format,
        &absolute_package_dir,
        &absolute_src_dir,
        &absolute_out_dir,
    );
}

pub fn run_by_params(
    dist_format: &str,
    absolute_package_dir: &str,
    absolute_src_dir: &str,
    absolute_out_dir: &str,
) {
    let dist_format = DistFormat::new(dist_format).unwrap();
    let package_dir = PackageDir::new(absolute_package_dir).unwrap();
    let absolute_src_dir = AbsoluteSrcDir::new(absolute_src_dir).unwrap();
    let absolute_out_dir = AbsoluteOutDir::new(absolute_out_dir).unwrap();

    let extensions: &[&str] = match dist_format.value() {
        "esm" => &["js", "jsx", "mjs", "mjsx"],
        "cjs" => &["js", "jsx", "cjs", "cjsx"],
        "dts" => &["ts", "tsx"],
        _ => &["js", "jsx"],
    };

    if !absolute_src_dir.is_package_dir_child(&package_dir) {
        panic!("Source directory must be inside the package directory");
    }

    if !absolute_out_dir.is_package_dir_child(&package_dir) {
        panic!("Output directory must be inside the package directory");
    }

    let specifier_formatter =
        SpecifierFormatter::new(&package_dir, &absolute_src_dir, &absolute_out_dir);

    walk_files_recursively(
        &absolute_out_dir.value(),
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
