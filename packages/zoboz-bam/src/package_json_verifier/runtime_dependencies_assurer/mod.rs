use std::collections::BTreeSet;
use std::fs;

use module_specifiers_dumper::dump_modules_specifiers;
use resolved_absolute_specifiers_handler::handle_resolved_absolute_specifiers;
use unresolved_absolute_specifiers_handler::handle_unresolved_absolute_specifiers;
use unresolved_relative_specifiers_handler::handle_unresolved_relative_specifiers;

use crate::shared::json_editor::ChangeSet;

use crate::shared::package_json_reader::PackageJson;
use crate::shared::simple_module_resolver::SimpleModuleResolver;
use crate::shared::value_objects::AbsolutePackageDir;

mod module_specifiers_dumper;
mod resolved_absolute_specifiers_handler;
mod unresolved_absolute_specifiers_handler;
mod unresolved_relative_specifiers_handler;

pub(crate) fn run(
    module_resolver: &SimpleModuleResolver,
    absolute_package_dir: &AbsolutePackageDir,
    package_json: &PackageJson,
    change_sets: &mut Vec<ChangeSet>,
) {
    let entry_points = package_json.get_entry_points();

    let mut resolved_absolute_specifiers: BTreeSet<String> = BTreeSet::new();
    let mut unresolved_absolute_specifiers: BTreeSet<String> = BTreeSet::new();
    let mut resolved_relative_specifiers: BTreeSet<String> = BTreeSet::new();
    let mut unresolved_relative_specifiers: BTreeSet<(String, String)> = BTreeSet::new();

    for entry_point in entry_points {
        let entry_point_path = absolute_package_dir.value().join(&entry_point);

        match fs::exists(&entry_point_path) {
            Ok(true) => {
                dump_modules_specifiers(
                    module_resolver,
                    entry_point_path.as_path(),
                    &mut resolved_absolute_specifiers,
                    &mut unresolved_absolute_specifiers,
                    &mut resolved_relative_specifiers,
                    &mut unresolved_relative_specifiers,
                );
            }
            Ok(false) => {
                unresolved_relative_specifiers.insert(("package.json".to_owned(), entry_point));
            }
            Err(_) => {
                // we couldn't even check if the file exist or not
            }
        }
    }

    handle_resolved_absolute_specifiers(
        module_resolver,
        absolute_package_dir,
        package_json,
        change_sets,
        resolved_absolute_specifiers,
    );

    handle_unresolved_absolute_specifiers(change_sets, unresolved_absolute_specifiers);
    handle_unresolved_relative_specifiers(change_sets, unresolved_relative_specifiers);
}
