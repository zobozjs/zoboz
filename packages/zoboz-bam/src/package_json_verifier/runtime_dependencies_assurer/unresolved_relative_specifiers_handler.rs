use std::collections::HashSet;

use crate::shared::json_editor::ChangeSet;

pub fn handle_unresolved_relative_specifiers(
    change_sets: &mut Vec<ChangeSet>,
    unresolved_relative_specifiers: HashSet<String>,
) {
    for specifier in unresolved_relative_specifiers {
        change_sets.push(ChangeSet {
          description: format!("Runtime dependency file `{}` does not exist on disk. https://zobozjs.github.io/docs/learn/runtime-files", specifier),
          changes: vec![],
      });
    }
}
