use zoboz_rs::specifier_formatter;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() > 1 {
        match args[1].as_str() {
            "format-specifiers" => {
                specifier_formatter::run_by_args(args);
            }
            "verify-package-json" => {
                println!("okay I will");
            }
            _ => {
                println!("Invalid command: {}", args[1]);
            }
        }
    } else {
        println!(
            "No command asked for, available commands are: format-specifiers, verify-package-json"
        );
    }
}
