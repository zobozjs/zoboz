pub mod package_json_verifier;
pub mod shared;
pub mod specifiers_reformatter;

pub fn handle_command(args: &[String]) -> Result<(), String> {
    let command = args[0].as_str();
    match command {
        "reformat-specifiers" => specifiers_reformatter::run_by_args(args),
        "verify-package-json" => package_json_verifier::run_by_args(args),
        _ => Err(format!("Invalid command: {}", command)),
    }
}

pub fn tokenize_input(input: &str) -> Vec<String> {
    shell_words::split(&input).unwrap_or_else(|_| vec![])
}
