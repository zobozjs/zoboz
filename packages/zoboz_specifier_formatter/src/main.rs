fn main() {
    let args: Vec<String> = std::env::args().collect();
    let js_format = cli_flags::get_js_format(&args).unwrap_or_else(|e| panic!("Error: {}", e));
    let absolute_src_dir =
        cli_flags::get_absolute_src_dir(&args).unwrap_or_else(|e| panic!("Error: {}", e));
    let absolute_out_dir =
        cli_flags::get_absolute_out_dir(&args).unwrap_or_else(|e| panic!("Error: {}", e));

    let extensions: &[&str] = match js_format.as_str() {
        "esm" => &["js", "jsx", "mjs", "mjsx"],
        "cjs" => &["js", "jsx", "cjs", "cjsx"],
        _ => &["js", "jsx"],
    };

    let specifier_formatter = specifier_formatter::SpecifierFormatter::new(
        js_resolver::create_resolver(
            std::path::Path::new(&absolute_src_dir),
            std::path::Path::new(&absolute_out_dir),
        ),
        std::path::Path::new(&absolute_out_dir),
    );

    file_walker::walk_files_recursively(
        &specifier_formatter,
        std::path::Path::new(&absolute_out_dir),
        extensions,
        &match js_format.as_str() {
            "esm" => esm_specifier_formatter::format_esm,
            "cjs" => cjs_specifier_formatter::format_cjs,
            _ => panic!("Invalid format"),
        },
    )
    .unwrap();
}

mod cjs_specifier_formatter;
mod cli_flags;
mod esm_specifier_formatter;
mod file_walker;
mod js_resolver;
mod specifier_formatter;
mod tsconfig_reader;
