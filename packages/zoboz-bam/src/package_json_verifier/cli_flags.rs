pub(super) fn get_params(args: &[String]) -> Result<(String, bool), String> {
    let absolute_package_dir = get_absolute_package_dir(&args)?;

    let can_update_package_json = get_can_update_package_json(args);

    Ok((absolute_package_dir, can_update_package_json))
}

fn get_absolute_package_dir(args: &[String]) -> Result<String, String> {
    let absolute_package_dir = args.iter().position(|arg| arg == "--absolute-package-dir");
    let absolute_package_dir = match absolute_package_dir {
        Some(index) => args.get(index + 1),
        None => None,
    };

    match absolute_package_dir {
        Some(value) => Ok(value.to_string()),
        None => {
            Err("--absolute-package-dir not found; use --absolute-package-dir <path>".to_owned())
        }
    }
}

fn get_can_update_package_json(args: &[String]) -> bool {
    args.iter().any(|arg| arg == "--can-update-package-json")
}
