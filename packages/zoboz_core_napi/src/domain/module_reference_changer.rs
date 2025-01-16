use crate::infra::rust_fs_files_repository::RustFsFilesRepository;

#[napi]
pub struct RustModuleReferenceChanger;

#[napi]
impl RustModuleReferenceChanger {
  #[napi]
  pub fn create() -> RustModuleReferenceChanger {
    RustModuleReferenceChanger
  }

  #[napi]
  pub fn change_references_in_dir(&self, mjsdir: String) {
    let files_repository = RustFsFilesRepository::create();
    let children = files_repository.children(mjsdir);
    for child in children {
      self.change_references_in_node(child);
    }
  }

  fn change_references_in_node(&self, uri: String) {
    let files_repository = RustFsFilesRepository::create();
  
    if files_repository.is_dir(uri.clone()) {
      return self.change_references_in_dir(uri);
    }
  
    if uri.ends_with(".mjs") {
      let content = files_repository.read(uri.clone());
      let new_content = self.replace_content(&content);
      files_repository.write(uri, new_content);
    }
  }

  fn replace_content(&self, content: &str) -> String {
    let re_from = regex::Regex::new(r#"from\s+(['"])(\..+?)(['"])"#).unwrap();
    let re_import = regex::Regex::new(r#"import\(['"](\..+?)(['"])\)"#).unwrap();
  
    let content = re_from.replace_all(&content, |caps: &regex::Captures| {
      format!("from {}{}{}", &caps[1], self.formatted_uri(&caps[2]), &caps[1])
    });
  
    let content = re_import.replace_all(&content, |caps: &regex::Captures| {
      format!("import({}{}{})", &caps[1], self.formatted_uri(&caps[1]), &caps[1])
    });
  
    content.to_string()
  }
  
  fn formatted_uri(&self, uri: &str) -> String {
    if uri.ends_with(".mjs") {
      return uri.to_string();
    }
  
    if uri.ends_with(".js") {
      return format!("{}.mjs", &uri[..uri.len() - 3]);
    }
  
    format!("{}.mjs", uri)
  }
}




