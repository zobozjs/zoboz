use std::collections::HashSet;

use crate::shared::json_editor::ChangeSet;

pub fn handle_unresolved_absolute_specifiers(
    change_sets: &mut Vec<ChangeSet>,
    unresolved_absolute_specifiers: HashSet<String>,
) {
    for specifier in unresolved_absolute_specifiers {
        change_sets.push(ChangeSet {
          description: format!("Runtime dependency package `{}` is not listed in package.json field `dependencies`. https://zobozjs.github.io/docs/learn/specify-runtime-deps", specifier),
          changes: vec![],
      });
    }
}
