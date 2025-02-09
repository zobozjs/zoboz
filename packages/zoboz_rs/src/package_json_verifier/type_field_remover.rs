use crate::shared::json_editor::{Change, ChangeSet, ChangeType};

use crate::shared::package_json_reader::PackageJson;

pub(crate) fn validate(package_json: &PackageJson, change_sets: &mut Vec<ChangeSet>) {
    if package_json.type_field.is_some() {
        change_sets.push(ChangeSet {
            description: "Field `type` in package.json should not exist. https://github.com/dariushalipour/zoboz/blob/main/packages/zoboz_rs/src/package_json_verifier/README.md".to_string(),
            changes: vec![
                Change {
                    path: "type".to_string(),
                    change_type: ChangeType::Remove,
                    value: None,
                }
            ],
        });
    }
}
