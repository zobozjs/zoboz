pub mod package_json_doctor;
pub mod shared;
pub mod specifier_formatter;

pub fn handle_command(args: &[String]) {
    let command = args[0].as_str();
    match command {
        "format-specifiers" => {
            specifier_formatter::run_by_args(args);
        }
        "verify-package-json" => {
            println!("okay I will");
        }
        _ => {
            println!("Invalid command: {}", command);
        }
    }
}

pub fn tokenize_input(input: &str) -> Vec<String> {
    shell_words::split(&input).unwrap_or_else(|_| vec![])
}
