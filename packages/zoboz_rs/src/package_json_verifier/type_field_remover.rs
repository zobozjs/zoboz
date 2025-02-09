use crate::shared::json_editor::{Change, ChangeSet, ChangeType};

use crate::shared::package_json_reader::PackageJson;

/*
package.json currently contains "type" field which threats compatibility of the package.
If you do not have to use it, consider removing it.
To briefly disclose its harmfulness, think of the lost meaning of field "main" and "module" fields.
When "type" is set to "module", possibly "main" is ignored and solely "module" is used instead.
When "type" is set to "commonjs", possibly "module" is ignored and solely "main" is used instead.
*/
pub(crate) fn validate(package_json: &PackageJson, change_sets: &mut Vec<ChangeSet>) {
    if package_json.type_field.is_some() {
        change_sets.push(ChangeSet {
            description: "Field \"type\" in package.json should not exist. Its existence can cause confusion for the consumers. https://issue-explanation".to_string(),
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
