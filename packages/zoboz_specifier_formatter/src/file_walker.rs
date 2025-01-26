use std::path::Path;

use crate::specifier_formatter::SpecifierFormatter;

pub(crate) fn walk_files_recursively<F>(
    specifier_formatter: &SpecifierFormatter,
    head_dir: &Path,
    extensions: &[&str],
    transform: &F,
) -> std::io::Result<()>
where
    F: Fn(&SpecifierFormatter, &Path, &str) -> Option<String>,
{
    if head_dir.is_dir() {
        for entry in std::fs::read_dir(head_dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                walk_files_recursively(specifier_formatter, &path, extensions, transform)?;
            } else if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
                if extensions.contains(&ext) {
                    let content = std::fs::read_to_string(&path)?;
                    if let Some(new_content) = transform(specifier_formatter, &path, &content) {
                        std::fs::write(&path, new_content)?;
                    }
                }
            }
        }
    }
    Ok(())
}
