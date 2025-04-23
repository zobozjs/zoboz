use cucumber::World;
use cucumber::gherkin::Step;
use std::{
    fs,
    path::{self, Path},
};
use tempfile::{TempDir, tempdir};

#[derive(Debug, Default, World)]
pub struct TheWorld {
    pub tempdir: Option<TempDir>,
    pub command_result: Option<Result<(), String>>,
}

pub fn get_docstring(world: &TheWorld, step: &Step) -> String {
    step.docstring()
        .cloned()
        .unwrap_or_default()
        .replace("$scenario_dir", &get_scenario_dir(world))
        .replace('|', path::MAIN_SEPARATOR.to_string().as_str())
}

fn get_scenario_dir(world: &TheWorld) -> String {
    get_dir_path(world).to_str().unwrap().to_string()
}

pub fn get_dir_path(world: &TheWorld) -> &Path {
    world.tempdir.as_ref().unwrap().path()
}

pub fn write_file(world: &TheWorld, file_name: &str, content: &str) {
    let path = get_dir_path(world).join(file_name);
    write_with_dirs(&path, content);
}

pub fn write_with_dirs(path: &Path, content: &str) {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).unwrap();
    }
    fs::write(path, content).unwrap();
}

pub fn read_file(world: &TheWorld, file_name: &str) -> String {
    let path = get_dir_path(world).join(file_name);
    fs::read_to_string(path).unwrap()
}

pub fn initiate_tempdir(world: &mut TheWorld) {
    world.tempdir = Some(tempdir().unwrap());
}

pub fn reformat_json(json: &str) -> String {
    let value: serde_json::Value = serde_json::from_str(json).unwrap();
    serde_json::to_string_pretty(&value).unwrap()
}
