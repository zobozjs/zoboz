use std::path::{Path, PathBuf};

pub(crate) struct SpecifierFormatter {
    resolver: oxc_resolver::Resolver,
    out_dir: String,
}

impl SpecifierFormatter {
    pub(crate) fn new(resolver: oxc_resolver::Resolver, out_dir: &Path) -> Self {
        Self {
            resolver,
            out_dir: out_dir.to_string_lossy().to_string(),
        }
    }

    pub(crate) fn format(&self, dependent_path: &Path, specifier: &str) -> String {
        let dependent_dirname = dependent_path.parent().and_then(|p| p.to_str());

        if dependent_dirname.is_none() {
            return specifier.to_string();
        }

        let dependent_dirname = dependent_dirname.unwrap();

        let resolved = self.resolver.resolve(dependent_dirname, specifier);

        if resolved.is_err() {
            return specifier.to_string();
        }

        let resolved = resolved.unwrap();
        let resolved_path = resolved.path().to_string_lossy();

        if !resolved_path.starts_with(self.out_dir.as_str()) {
            return specifier.to_string();
        }

        let relative_path = path_relative(dependent_path, resolved.path());

        println!(
            "path_str: {:?}, dirname: '{}' uri: '{}' resolved: '{}', relative: '{}'",
            dependent_path.to_str(),
            dependent_dirname,
            specifier,
            resolved_path,
            relative_path.to_string_lossy()
        );

        relative_path
            .to_string_lossy()
            .into_owned()
            .chars()
            .skip(1)
            .collect()
    }
}

fn path_relative(from: impl AsRef<Path>, to: impl AsRef<Path>) -> PathBuf {
    let from = from.as_ref();
    let to = to.as_ref();

    // If paths are identical, return an empty path
    if from == to {
        return PathBuf::new();
    }

    // Find the common ancestor by comparing path components
    let mut from_components = from.components().peekable();
    let mut to_components = to.components().peekable();
    let mut common_prefix = PathBuf::new();

    while let (Some(f), Some(t)) = (from_components.peek(), to_components.peek()) {
        if f == t {
            common_prefix.push(f.as_os_str());
            from_components.next();
            to_components.next();
        } else {
            break;
        }
    }

    // Count how many levels we need to go up (`..`)
    let up_steps = from_components.count();
    let mut relative_path = PathBuf::new();

    for _ in 0..up_steps {
        relative_path.push("..");
    }

    // Add the remaining `to` components
    for component in to_components {
        relative_path.push(component.as_os_str());
    }

    relative_path
}
