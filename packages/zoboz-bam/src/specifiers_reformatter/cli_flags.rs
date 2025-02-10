pub(super) fn get_params(args: &[String]) -> (String, String, String, String) {
    let output_format = get_output_format(&args).unwrap_or_else(|e| panic!("Error: {}", e));

    let absolute_package_dir =
        get_absolute_package_dir(&args).unwrap_or_else(|e| panic!("Error: {}", e));
    let absolute_source_dir =
        get_absolute_source_dir(&args).unwrap_or_else(|e| panic!("Error: {}", e));
    let absolute_output_dir =
        get_absolute_output_dir(&args).unwrap_or_else(|e| panic!("Error: {}", e));

    (
        output_format,
        absolute_package_dir,
        absolute_source_dir,
        absolute_output_dir,
    )
}

fn get_output_format(args: &[String]) -> Result<String, String> {
    let output_format = args.iter().position(|arg| arg == "--output-format");
    let output_format = match output_format {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match output_format {
        Some(value) => Ok(value.to_string()),
        None => Err(format!(
            "OutputFormat not found; use --output-format <cjs|esm|dts>"
        )),
    }
}

fn get_absolute_package_dir(args: &[String]) -> Result<String, String> {
    let absolute_package_dir = args.iter().position(|arg| arg == "--absolute-package-dir");
    let absolute_package_dir = match absolute_package_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_package_dir {
        Some(value) => Ok(value.to_string()),
        None => Err(format!(
            "--absolute-package-dir not found; use --absolute-package-dir <path>"
        )),
    }
}

fn get_absolute_source_dir(args: &[String]) -> Result<String, String> {
    let absolute_source_dir = args.iter().position(|arg| arg == "--absolute-source-dir");
    let absolute_source_dir = match absolute_source_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_source_dir {
        Some(value) => Ok(value.to_string()),
        None => Err(format!(
            "--absolute-source-dir not found; use --absolute-source-dir <path>"
        )),
    }
}

fn get_absolute_output_dir(args: &[String]) -> Result<String, String> {
    let absolute_output_dir = args.iter().position(|arg| arg == "--absolute-output-dir");
    let absolute_output_dir = match absolute_output_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_output_dir {
        Some(value) => Ok(value.to_string()),
        None => Err(format!(
            "--absolute-output-dir not found; use --absolute-output-dir <path>"
        )),
    }
}
