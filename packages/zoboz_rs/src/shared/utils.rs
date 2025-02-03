use std::path::Path;

use std::path::PathBuf;

pub fn canonical_from_str(value: &str) -> PathBuf {
    PathBuf::from(
        Path::new(value)
            .canonicalize()
            .unwrap()
            .to_string_lossy()
            .trim_start_matches(r"\\?\"),
    )
}

pub fn canonical_from_buf(value: PathBuf) -> PathBuf {
    PathBuf::from(
        value
            .canonicalize()
            .unwrap()
            .to_string_lossy()
            .trim_start_matches(r"\\?\"),
    )
}

pub fn relative(from: impl AsRef<Path>, to: impl AsRef<Path>) -> PathBuf {
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

pub fn ensure_relative_prefix(specifier: PathBuf) -> String {
    let relative_path = if !specifier.starts_with("./") && !specifier.starts_with("../") {
        PathBuf::from(format!("./{}", specifier.to_string_lossy()))
    } else {
        specifier
    };

    relative_path.to_string_lossy().replace("\\", "/")
}
