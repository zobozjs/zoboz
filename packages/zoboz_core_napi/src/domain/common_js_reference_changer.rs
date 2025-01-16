use crate::infra::rust_fs_files_repository::RustFsFilesRepository;

#[napi]
pub struct RustCommonJsReferenceChanger;

#[napi]
impl RustCommonJsReferenceChanger {
  #[napi]
  pub fn create() -> RustCommonJsReferenceChanger {
    RustCommonJsReferenceChanger
  }

  #[napi]
  pub fn change_references_in_dir(&self, cjsdir: String) {
    let files_repository = RustFsFilesRepository::create();
    let children = files_repository.children(cjsdir);
    for child in children {
      self.change_references_in_node(child);
    }
  }

  fn change_references_in_node(&self, uri: String) {
    let files_repository = RustFsFilesRepository::create();

    if files_repository.is_dir(uri.clone()) {
      return self.change_references_in_dir(uri);
    }

    if uri.ends_with(".cjs") {
      let content = files_repository.read(uri.clone());
      let new_content = self.replace_content(&content);
      files_repository.write(uri, new_content);
    }
  }

  fn replace_content(&self, content: &str) -> String {
    let re_require = regex::Regex::new(r#"require\((['"])(\..+?)(['"])\)"#).unwrap();

    let content = re_require.replace_all(&content, |caps: &regex::Captures| {
      format!(
        "require({}{}{})",
        &caps[1],
        self.formatted_uri(&caps[1]),
        &caps[1]
      )
    });

    content.to_string()
  }

  fn formatted_uri(&self, uri: &str) -> String {
    if uri.ends_with(".cjs") {
      return uri.to_string();
    }

    if uri.ends_with(".js") {
      return format!("{}.cjs", &uri[..uri.len() - 3]);
    }

    format!("{}.cjs", uri)
  }
}
