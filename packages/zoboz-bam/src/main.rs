use std::{
    io::{stdin, stdout, Write},
    process,
};

use zoboz_bam::{handle_command, tokenize_input};

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() > 1 {
        handle_command(&args[1..]).unwrap_or_else(|e| {
            eprintln!("{}", e);
            process::exit(1);
        });
    } else {
        console_mode();
    }
}

fn console_mode() {
    println!("Zoboz Bam v{}", env!("CARGO_PKG_VERSION"));
    println!("Available Commands:");
    println!("  reformat-specifiers --absolute-package-dir string --absolute-source-dir string --absolute-output-dir string --output-format dts|esm|cjs");
    println!("  verify-package-json --absolute-package-dir string [--can-update-package-json]");
    println!("  exit");

    loop {
        print!("zoboz $ ");
        stdout().flush().unwrap();
        let mut input = String::new();
        stdin().read_line(&mut input).unwrap();
        let input = input.trim();
        let args = tokenize_input(input);

        if args.is_empty() {
            continue;
        }

        if args[0] == "exit" {
            break;
        }

        handle_command(&args).unwrap_or_else(|e| eprintln!("{}", e));
    }
}
