use crate::infra::rust_fs_files_repository_v2::RustFsFilesRepositoryV2;

#[napi]
pub struct RustExtensionChanger;

#[napi]
impl RustExtensionChanger {
  #[napi]
  pub fn create() -> RustExtensionChanger {
    RustExtensionChanger
  }

  #[napi]
  pub fn change_in_dir(&self, dir: String, from_extension: String, to_extension: String) {
    let executer = ExtensionChangerExecuter::create(from_extension, to_extension);
    executer.change_in_dir(dir);
  }
}

struct ExtensionChangerExecuter {
  files_repository: RustFsFilesRepositoryV2,
  from_extension: String,
  to_extension: String,
}

impl ExtensionChangerExecuter {
  pub fn create(from_extension: String, to_extension: String) -> ExtensionChangerExecuter {
    ExtensionChangerExecuter {
      files_repository: RustFsFilesRepositoryV2::create(),
      from_extension,
      to_extension,
    }
  }

  pub fn change_in_dir(&self, dir: String) {
    let children = self.files_repository.children(&dir);
    for child_uri in children {
      self.change_node(&child_uri);
    }
  }

  fn change_node(&self, uri: &str) {
    if self.files_repository.is_dir(&uri) {
      return self.change_in_dir(String::from(uri));
    }

    if self.has_matching_file_extension(&uri) {
      return self
        .files_repository
        .mv(uri, &self.get_uri_with_new_extension(uri));
    }
  }

  fn get_uri_with_new_extension(&self, uri: &str) -> String {
    let regex = regex::Regex::new(&format!(
      r"\.{}(\.map)?$",
      regex::escape(&self.from_extension)
    ))
    .unwrap();
    regex
      .replace(uri, format!(".{}$1", self.to_extension).as_str())
      .to_string()
  }

  fn has_matching_file_extension(&self, uri: &str) -> bool {
    uri.ends_with(&format!(".{}", self.from_extension))
      || uri.ends_with(&format!(".{}.map", self.from_extension))
  }
}
