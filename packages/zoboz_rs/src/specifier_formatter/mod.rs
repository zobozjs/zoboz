use std::path::Path;

use cli_flags::get_params;
use file_updater::{update_cjs, update_esm};
use file_walker::walk_files_recursively;
use specifier_formatter::SpecifierFormatter;

use crate::shared::{tsconfig_reader, utils};

mod cli_flags;
mod file_updater;
mod file_walker;
mod js_resolver;
mod specifier_formatter;

pub fn run_by_args(args: Vec<String>) {
    let (js_format, absolute_src_dir, absolute_out_dir) = get_params(args);

    let package_dir = utils::canonical_from_buf(std::env::current_dir().unwrap());

    run_by_params(
        &js_format,
        &package_dir,
        &absolute_src_dir,
        &absolute_out_dir,
    );
}

pub fn run_by_params(
    js_format: &str,
    package_dir: &Path,
    absolute_src_dir: &Path,
    absolute_out_dir: &Path,
) {
    let package_dir = utils::canonical_from_buf(package_dir.to_path_buf());
    let absolute_src_dir = utils::canonical_from_buf(absolute_src_dir.to_path_buf());
    let absolute_out_dir = utils::canonical_from_buf(absolute_out_dir.to_path_buf());

    let extensions: &[&str] = match js_format {
        "esm" => &["js", "jsx", "mjs", "mjsx"],
        "cjs" => &["js", "jsx", "cjs", "cjsx"],
        _ => &["js", "jsx"],
    };

    if !absolute_src_dir.starts_with(package_dir.to_str().unwrap()) {
        panic!("Source directory must be inside the package directory");
    }

    if !absolute_out_dir.starts_with(package_dir.to_str().unwrap()) {
        panic!("Output directory must be inside the package directory");
    }

    let specifier_formatter =
        SpecifierFormatter::new(&package_dir, &absolute_src_dir, &absolute_out_dir);

    walk_files_recursively(
        &absolute_out_dir,
        extensions,
        &|file_path, file_content| match js_format {
            "esm" => update_esm(&specifier_formatter, file_path, file_content),
            "cjs" => update_cjs(&specifier_formatter, file_path, file_content),
            _ => panic!("Invalid format"),
        },
    )
    .unwrap();
}
