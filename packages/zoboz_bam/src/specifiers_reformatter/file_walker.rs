use std::path::Path;

pub(super) fn walk_files_recursively<F>(
    head_dir: &Path,
    allowed_extensions: &[&str],
    transform: &F,
) -> std::io::Result<()>
where
    F: Fn(&Path, &str) -> Option<String>,
{
    if head_dir.is_dir() {
        for entry in std::fs::read_dir(head_dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                walk_files_recursively(&path, allowed_extensions, transform)?;
            } else if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
                if allowed_extensions.contains(&ext) {
                    let file_content = std::fs::read_to_string(&path)?;
                    if let Some(new_content) = transform(&path, &file_content) {
                        std::fs::write(&path, new_content)?;
                    }
                }
            }
        }
    }
    Ok(())
}
