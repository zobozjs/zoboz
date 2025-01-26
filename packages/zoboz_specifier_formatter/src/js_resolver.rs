use std::path::Path;

use crate::tsconfig_reader;

pub(crate) fn create_resolver(src_dir: &Path, out_dir: &Path) -> oxc_resolver::Resolver {
    let aliases = get_aliases(src_dir, out_dir);

    let mut resolve_options = oxc_resolver::ResolveOptions::default();
    resolve_options.alias = aliases;
    resolve_options.extensions = vec![
        ".js".to_string(),
        ".jsx".to_string(),
        ".cjs".to_string(),
        ".mjs".to_string(),
        ".ts".to_string(),
        ".tsx".to_string(),
        ".json".to_string(),
    ];
    resolve_options.extension_alias = vec![
        (
            ".js".to_string(),
            vec![".js".to_string(), ".ts".to_string(), ".tsx".to_string()],
        ),
        (
            ".jsx".to_string(),
            vec![".jsx".to_string(), ".tsx".to_string()],
        ),
        (
            ".ts".to_string(),
            vec![".ts".to_string(), ".tsx".to_string(), ".js".to_string()],
        ),
        (
            ".tsx".to_string(),
            vec![".tsx".to_string(), ".jsx".to_string()],
        ),
    ];

    oxc_resolver::Resolver::new(resolve_options)
}

fn get_aliases(src_dir: &Path, out_dir: &Path) -> Vec<(String, Vec<oxc_resolver::AliasValue>)> {
    let tsconfig = tsconfig_reader::get_tsconfig();
    let base_url = tsconfig.compilerOptions.baseUrl;

    if base_url.is_empty() {
        return vec![];
    }

    let base_url = std::path::Path::new(&base_url);

    let aliases: Vec<(String, Vec<oxc_resolver::AliasValue>)> = tsconfig
        .compilerOptions
        .paths
        .iter()
        .map(|(k, v)| {
            let alias_key = k.trim_end_matches("/*").to_string();
            let alias_value = v
                .iter()
                .map(|x| {
                    base_url
                        .join(x.trim_end_matches("/*"))
                        .canonicalize()
                        .unwrap()
                        .to_str()
                        .unwrap()
                        .to_string()
                        .replace(src_dir.to_str().unwrap(), out_dir.to_str().unwrap())
                        .into()
                })
                .collect::<Vec<_>>();
            (alias_key, alias_value)
        })
        .collect::<Vec<_>>();

    aliases
}
