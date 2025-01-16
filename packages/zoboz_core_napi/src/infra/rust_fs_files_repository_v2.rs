use std::fs;

#[derive(Clone)]
pub struct RustFsFilesRepositoryV2;

impl RustFsFilesRepositoryV2 {
  pub fn create() -> RustFsFilesRepositoryV2 {
    RustFsFilesRepositoryV2
  }

  pub fn get_package_dir(&self) -> String {
    std::env::current_dir()
      .unwrap()
      .to_str()
      .unwrap()
      .to_string()
  }

  pub fn is_dir(&self, uri: &str) -> bool {
    let metadata = fs::metadata(uri).unwrap();
    metadata.is_dir()
  }

  pub fn mv(&self, from_uri: &str, to_uri: &str) {
    fs::rename(from_uri, to_uri).unwrap();
  }

  pub fn remove(&self, uri: &str) {
    let metadata = fs::metadata(uri);

    if metadata.is_err() {
      return;
    }

    if metadata.unwrap().is_dir() {
      fs::remove_dir_all(uri).unwrap();
    } else {
      fs::remove_file(uri).unwrap();
    }
  }

  pub fn children(&self, uri: &str) -> Vec<String> {
    let entries = fs::read_dir(uri).unwrap();
    entries
      .filter_map(|entry| entry.ok())
      .map(|entry| entry.path().to_str().unwrap().to_string())
      .collect()
  }

  pub fn read(&self, uri: &str) -> String {
    fs::read_to_string(uri).unwrap()
  }

  pub fn write(&self, uri: &str, content: &str) {
    fs::write(uri, content).unwrap();
  }
}
