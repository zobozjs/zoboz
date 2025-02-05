pub(super) fn get_params(args: Vec<String>) -> (String, String, String) {
    let dist_format = get_dist_format(&args).unwrap_or_else(|e| panic!("Error: {}", e));
    let absolute_src_dir = get_absolute_src_dir(&args).unwrap_or_else(|e| panic!("Error: {}", e));
    let absolute_out_dir = get_absolute_out_dir(&args).unwrap_or_else(|e| panic!("Error: {}", e));

    (dist_format, absolute_src_dir, absolute_out_dir)
}

fn get_dist_format(args: &Vec<String>) -> Result<String, String> {
    let dist_format = args.iter().position(|arg| arg == "--format");
    let dist_format = match dist_format {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match dist_format {
        Some(value) => Ok(value.to_string()),
        None => Err(format!(
            "DistFormat not found; use --dist-format <cjs|esm|dts>"
        )),
    }
}

fn get_absolute_src_dir(args: &Vec<String>) -> Result<String, String> {
    let absolute_src_dir = args.iter().position(|arg| arg == "--absolute-src-dir");
    let absolute_src_dir = match absolute_src_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_src_dir {
        Some(value) => Ok(value.to_string()),
        None => Err(format!(
            "--absolute-src-dir not found; use --absolute-src-dir <path>"
        )),
    }
}

fn get_absolute_out_dir(args: &Vec<String>) -> Result<String, String> {
    let absolute_out_dir = args.iter().position(|arg| arg == "--absolute-out-dir");
    let absolute_out_dir = match absolute_out_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_out_dir {
        Some(value) => Ok(value.to_string()),
        None => Err(format!(
            "--absolute-out-dir not found; use --absolute-out-dir <path>"
        )),
    }
}
