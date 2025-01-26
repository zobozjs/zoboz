pub(crate) fn get_js_format(args: &Vec<String>) -> Result<String, String> {
    let js_format = args.iter().position(|arg| arg == "--format");
    let js_format = match js_format {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match js_format {
        Some(value) => {
            if value == "cjs" || value == "esm" {
                Ok(value.to_string())
            } else {
                Err(format!(
                    "format '{}' is among valid options: 'esm','cjs'",
                    value
                ))
            }
        }
        None => Err(format!("Format not found; use --format <cjs|esm>")),
    }
}

pub(crate) fn get_absolute_src_dir(args: &Vec<String>) -> Result<String, String> {
    let absolute_src_dir = args.iter().position(|arg| arg == "--absolute-src-dir");
    let absolute_src_dir = match absolute_src_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_src_dir {
        Some(value) => {
            let path = std::path::Path::new(value);
            if path.is_absolute() {
                Ok(value.to_string())
            } else {
                Err(format!(
                    "--absolute-src-dir '{}' is not an absolute path",
                    value
                ))
            }
        }
        None => Err(format!(
            "--absolute-src-dir not found; use --absolute-src-dir <path>"
        )),
    }
}

pub(crate) fn get_absolute_out_dir(args: &Vec<String>) -> Result<String, String> {
    let absolute_out_dir = args.iter().position(|arg| arg == "--absolute-out-dir");
    let absolute_out_dir = match absolute_out_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_out_dir {
        Some(value) => {
            let path = std::path::Path::new(value);
            if path.is_absolute() {
                Ok(value.to_string())
            } else {
                Err(format!(
                    "--absolute-out-dir '{}' is not an absolute path",
                    value
                ))
            }
        }
        None => Err(format!(
            "--absolute-out-dir not found; use --absolute-out-dir <path>"
        )),
    }
}
