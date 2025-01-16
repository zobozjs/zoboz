#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  a + b
}

pub mod domain {
  pub mod common_js_reference_changer;
  pub mod module_reference_changer;
  pub mod extension_changer;
}

pub mod infra {
  pub mod rust_fs_files_repository;
  pub mod rust_fs_files_repository_v2;
}
