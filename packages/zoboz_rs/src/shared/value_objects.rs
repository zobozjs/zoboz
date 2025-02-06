use std::path::PathBuf;

use crate::shared::utils;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct DistFormat(String);

impl DistFormat {
    pub fn new(dist_format: &str) -> Result<Self, String> {
        if dist_format == "cjs" || dist_format == "esm" || dist_format == "dts" {
            Ok(Self(dist_format.to_string()))
        } else {
            Err(format!(
                "DistFormat '{}' is is not among valid options: 'esm','cjs', 'dts'",
                dist_format
            ))
        }
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct AbsoluteSourceDir(PathBuf);

impl AbsoluteSourceDir {
    pub fn new(absolute_dir: &str) -> Result<Self, String> {
        let dir_path = PathBuf::from(absolute_dir);
        if dir_path.is_absolute() {
            Ok(Self(utils::canonical_from_buf(dir_path.to_path_buf())))
        } else {
            Err(format!(
                "AbsoluteSourceDir '{}' is not an absolute path",
                absolute_dir
            ))
        }
    }

    pub fn value(&self) -> &PathBuf {
        &self.0
    }

    pub fn is_package_dir_child(&self, package_dir: &PackageDir) -> bool {
        self.0.starts_with(package_dir.value())
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct AbsoluteOutputDir(PathBuf);

impl AbsoluteOutputDir {
    pub fn new(absolute_dir: &str) -> Result<Self, String> {
        let dir_path = PathBuf::from(absolute_dir);
        if dir_path.is_absolute() {
            Ok(Self(utils::canonical_from_buf(dir_path.to_path_buf())))
        } else {
            Err(format!(
                "AbsoluteOutputDir '{}' is not an absolute path",
                absolute_dir
            ))
        }
    }

    pub fn value(&self) -> &PathBuf {
        &self.0
    }

    pub fn is_package_dir_child(&self, package_dir: &PackageDir) -> bool {
        self.0.starts_with(package_dir.value())
    }
}

// PackageDir

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct PackageDir(PathBuf);

impl PackageDir {
    pub fn new(package_dir: &str) -> Result<Self, String> {
        let dir_path = PathBuf::from(package_dir);
        if dir_path.is_absolute() {
            Ok(Self(utils::canonical_from_buf(dir_path.to_path_buf())))
        } else {
            Err(format!(
                "PackageDir '{}' is not an absolute path",
                package_dir
            ))
        }
    }

    pub fn value(&self) -> &PathBuf {
        &self.0
    }
}
