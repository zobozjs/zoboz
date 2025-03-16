use crate::shared::json_editor::{Change, ChangeSet, ChangeType};

use crate::shared::package_json_reader::PackageJson;

pub(crate) fn run(package_json: &PackageJson, change_sets: &mut Vec<ChangeSet>) {
    if package_json.type_field.is_some() {
        change_sets.push(ChangeSet {
            description: "Field `type` in package.json should not exist. https://zobozjs.github.io/docs/learn/avoid-pkg-type".to_string(),
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
