use std::path::PathBuf;

use crate::shared::utils;

pub(super) fn get_params(args: Vec<String>) -> (String, PathBuf, PathBuf) {
    let js_format = get_js_format(&args).unwrap_or_else(|e| panic!("Error: {}", e));
    let absolute_src_dir = get_absolute_src_dir(&args).unwrap_or_else(|e| panic!("Error: {}", e));
    let absolute_out_dir = get_absolute_out_dir(&args).unwrap_or_else(|e| panic!("Error: {}", e));

    (js_format, absolute_src_dir, absolute_out_dir)
}

fn get_js_format(args: &Vec<String>) -> Result<String, String> {
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

fn get_absolute_src_dir(args: &Vec<String>) -> Result<PathBuf, String> {
    let absolute_src_dir = args.iter().position(|arg| arg == "--absolute-src-dir");
    let absolute_src_dir = match absolute_src_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_src_dir {
        Some(value) => {
            let dir_path = utils::canonical_from_str(value);
            if dir_path.is_absolute() {
                Ok(dir_path)
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

fn get_absolute_out_dir(args: &Vec<String>) -> Result<PathBuf, String> {
    let absolute_out_dir = args.iter().position(|arg| arg == "--absolute-out-dir");
    let absolute_out_dir = match absolute_out_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_out_dir {
        Some(value) => {
            let path = utils::canonical_from_str(value);
            if path.is_absolute() {
                Ok(path.to_path_buf())
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
