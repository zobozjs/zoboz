mod type_field_remover;

use std::{fs, path::Path};

use crate::shared::{
    json_editor::{apply_change_sets, ChangeSet},
    package_json_reader::{get_package_json_object, get_package_json_string},
};

pub fn run_by_params(package_dir: &Path, should_update_package_json: bool) -> Result<(), String> {
    let mut package_json_content = get_package_json_string(package_dir);
    let package_json = get_package_json_object(&package_json_content);

    let mut change_sets: Vec<ChangeSet> = vec![];

    type_field_remover::validate(&package_json, &mut change_sets);

    if should_update_package_json {
        package_json_content = apply_change_sets(&package_json_content, change_sets);
    } else {
        let desciptions: Vec<String> = change_sets
            .iter()
            .map(|change_set| change_set.description.clone())
            .collect();

        return Result::Err(desciptions.join("\n"));
    }

    fs::write(package_dir.join("package.json"), package_json_content)
        .expect("Failed to write package.json");

    return Result::Ok(());
}
