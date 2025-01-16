use std::fs;

#[derive(Clone)]
#[napi]
pub struct RustFsFilesRepository;

#[napi]
impl RustFsFilesRepository {
  #[napi]
  pub fn create() -> RustFsFilesRepository {
    RustFsFilesRepository
  }

  #[napi]
  pub fn get_package_dir(&self) -> String {
    std::env::current_dir()
      .unwrap()
      .to_str()
      .unwrap()
      .to_string()
  }

  #[napi]
  pub fn is_dir(&self, uri: String) -> bool {
    let metadata = fs::metadata(uri).unwrap();
    metadata.is_dir()
  }

  #[napi]
  pub fn mv(&self, from_uri: String, to_uri: String) {
    fs::rename(from_uri, to_uri).unwrap();
  }

  #[napi]
  pub fn remove(&self, uri: String) {
    let metadata = fs::metadata(uri.clone());
    
    if metadata.is_err() {
      return;
    }

    if metadata.unwrap().is_dir() {
      fs::remove_dir_all(uri).unwrap();
    } else {
      fs::remove_file(uri).unwrap();
    }
  }

  #[napi]
  pub fn children(&self, uri: String) -> Vec<String> {
    let entries = fs::read_dir(uri).unwrap();
    entries
      .filter_map(|entry| entry.ok())
      .map(|entry| entry.path().to_str().unwrap().to_string())
      .collect()
  }

  #[napi]
  pub fn read(&self, uri: String) -> String {
    fs::read_to_string(uri).unwrap()
  }

  #[napi]
  pub fn write(&self, uri: String, content: String) {
    fs::write(uri, content).unwrap();
  }
}
