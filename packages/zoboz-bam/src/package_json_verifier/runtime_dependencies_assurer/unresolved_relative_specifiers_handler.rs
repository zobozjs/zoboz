use std::collections::BTreeSet;

use crate::shared::json_editor::ChangeSet;

pub fn handle_unresolved_relative_specifiers(
    change_sets: &mut Vec<ChangeSet>,
    unresolved_relative_specifiers: BTreeSet<(String, String)>,
) {
    for (dependent, specifier) in unresolved_relative_specifiers {
        change_sets.push(ChangeSet {
            description: format!(
                "File `{}` references `{}` which does not exist on disk.",
                dependent, specifier
            ),
            changes: vec![],
        });
    }
}
