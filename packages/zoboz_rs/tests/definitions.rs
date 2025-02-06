use cucumber::gherkin::Step;
use cucumber::{given, then, when, World};
use std::fs;
use std::path::Path;
use tempfile::{tempdir, TempDir};
use zoboz_rs::{handle_command, package_json_doctor, tokenize_input};

#[derive(Debug, Default, World)]
pub struct TheWorld {
    pub tempdir: Option<TempDir>,
    pub output_format: String,
    pub absolute_source_dir: String,
    pub absolute_output_dir: String,
    pub should_update_package_json: bool,
    pub package_json_doctor_result: Option<Result<(), String>>,
}

fn main() {
    let features = [
        "tests/features/specifier_formatter/cjs_specifier_formatter.feature",
        "tests/features/specifier_formatter/esm_specifier_formatter.feature",
        "tests/features/specifier_formatter/dts_specifier_formatter.feature",
        "tests/features/package_json_doctor/field_type.feature",
    ];

    for feature in features.iter() {
        futures::executor::block_on(TheWorld::run(feature));
    }
}

fn get_docstring(step: &Step) -> String {
    step.docstring().cloned().unwrap_or_default()
}

fn get_dir_path(world: &TheWorld) -> &Path {
    world.tempdir.as_ref().unwrap().path()
}

fn write_file(world: &TheWorld, file_name: &str, content: &str) {
    let path = get_dir_path(world).join(file_name);
    write_with_dirs(&path, content);
}

fn write_with_dirs(path: &Path, content: &str) {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).unwrap();
    }
    fs::write(path, content).unwrap();
}

fn read_file(world: &TheWorld, file_name: &str) -> String {
    let path = get_dir_path(world).join(file_name);
    fs::read_to_string(path).unwrap()
}

fn initiate_tempdir(world: &mut TheWorld) {
    world.tempdir = Some(tempdir().unwrap());
}

#[given(expr = "there is an npm package with:")]
fn there_is_a_npm_package_with(world: &mut TheWorld, step: &Step) {
    initiate_tempdir(world);
    write_file(world, "package.json", &get_docstring(step));
}

#[given(expr = "there is a file named {string} with:")]
fn a_file_named_with(world: &mut TheWorld, step: &Step, file_name: String) {
    write_file(world, file_name.as_str(), &get_docstring(step));
}

#[given(expr = "format is set to {string}")]
fn format_is_set_to(world: &mut TheWorld, output_format: String) {
    world.output_format = output_format;
}

#[given(expr = "source dir is set to {string}")]
fn source_dir_is_set_to(world: &mut TheWorld, relative_src_dir: String) {
    world.absolute_source_dir = get_dir_path(world)
        .join(relative_src_dir)
        .canonicalize()
        .unwrap()
        .to_string_lossy()
        .to_string();
}

#[given(expr = "output dir is set to {string}")]
fn output_dir_is_set_to(world: &mut TheWorld, relative_out_dir: String) {
    world.absolute_output_dir = get_dir_path(world)
        .join(relative_out_dir)
        .canonicalize()
        .unwrap()
        .to_string_lossy()
        .to_string();
}

#[then(expr = "the JS content for {string} should be:")]
fn the_js_content_for_should_be(world: &mut TheWorld, step: &Step, file_name: String) {
    assert_eq!(
        read_file(world, &file_name).trim(),
        get_docstring(step).trim()
    );
}

#[then(expr = "the DTS content for {string} should be:")]
fn the_dts_content_for_should_be(world: &mut TheWorld, step: &Step, file_name: String) {
    assert_eq!(
        read_file(world, &file_name).trim(),
        get_docstring(step).trim()
    );
}

fn reformat_json(json: &str) -> String {
    let value: serde_json::Value = serde_json::from_str(json).unwrap();
    serde_json::to_string_pretty(&value).unwrap()
}

#[then(expr = "the JSON content for {string} should be:")]
fn the_json_content_for_should_be(world: &mut TheWorld, step: &Step, file_name: String) {
    assert_eq!(
        reformat_json(read_file(world, &file_name).trim()),
        reformat_json(get_docstring(step).trim())
    );
}

#[given(expr = "the package has a directory named {string}")]
fn the_package_has_a_directory_named(world: &mut TheWorld, dir_path: String) {
    let path = get_dir_path(world).join(dir_path);
    fs::create_dir_all(path).unwrap();
}

#[given(expr = "it has been explicitly requested to update package.json")]
fn it_has_been_explicitly_requested_to_update_package_json(world: &mut TheWorld) {
    world.should_update_package_json = true;
}

#[when(expr = "package_json_doctor is run")]
fn package_json_doctor_is_run(world: &mut TheWorld) {
    world.package_json_doctor_result = Some(package_json_doctor::run_by_params(
        &get_dir_path(world).canonicalize().unwrap(),
        world.should_update_package_json,
    ));
}

#[then(expr = "the result is ok")]
fn the_result_is_ok(world: &mut TheWorld) {
    if let Some(result) = &world.package_json_doctor_result {
        assert_eq!(result.is_ok(), true);
    } else {
        panic!("The result for package_doctor is not here yet.");
    }
}

#[then(expr = "the result is error and equals the following text:")]
fn the_result_is_error_and_equals_the_following_text(world: &mut TheWorld, step: &Step) {
    if let Some(result) = &world.package_json_doctor_result {
        if let Some(error) = result.clone().err() {
            let expected_error = get_docstring(step);
            assert_eq!(error.trim(), expected_error.trim());
            return;
        } else {
            panic!("The result for package_doctor is not error.");
        }
    } else {
        panic!("The result for package_doctor is not here yet.");
    }
}

#[when(expr = "the following command is executed:")]
fn the_following_command_is_executed(_world: &mut TheWorld, step: &Step) {
    let command = get_docstring(step);
    let command = command.replace("$scenario_dir", get_dir_path(_world).to_str().unwrap());
    handle_command(&tokenize_input(&command));
}
