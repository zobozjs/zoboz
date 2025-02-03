use std::path::Path;

use super::utils;

#[derive(serde::Deserialize, Default)]
pub struct TsConfig {
    #[serde(default, rename = "compilerOptions")]
    pub compiler_options: CompilerOptions,
}

#[derive(serde::Deserialize, Default)]
pub struct CompilerOptions {
    #[serde(default, rename = "baseUrl")]
    pub base_url: String,
    #[serde(default)]
    pub paths: std::collections::HashMap<String, Vec<String>>,
}

pub fn get_tsconfig(package_dir: &Path) -> TsConfig {
    let tsconfig_path = package_dir.join("tsconfig.json");
    let tsconfig_content = std::fs::read_to_string(tsconfig_path).unwrap_or_default();
    let mut tsconfig: TsConfig = serde_json::from_str(&tsconfig_content).unwrap_or_default();

    if tsconfig.compiler_options.base_url.is_empty() {
        return tsconfig;
    }

    tsconfig.compiler_options.base_url =
        if std::path::Path::new(&tsconfig.compiler_options.base_url).is_absolute() {
            tsconfig.compiler_options.base_url
        } else {
            let base_url = package_dir.join(&tsconfig.compiler_options.base_url);
            utils::canonical_from_buf(base_url)
                .to_string_lossy()
                .to_string()
        };

    tsconfig
}
