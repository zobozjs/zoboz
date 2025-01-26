#[derive(serde::Deserialize, Default)]
pub(crate) struct TsConfig {
    #[serde(default)]
    pub compilerOptions: CompilerOptions,
}

#[derive(serde::Deserialize, Default)]
pub(crate) struct CompilerOptions {
    #[serde(default)]
    pub baseUrl: String,
    #[serde(default)]
    pub paths: std::collections::HashMap<String, Vec<String>>,
}

pub(crate) fn get_tsconfig() -> TsConfig {
    let tsconfig_path = std::env::current_dir().unwrap().join("tsconfig.json");
    let tsconfig_content = std::fs::read_to_string(tsconfig_path).unwrap_or_default();
    let mut tsconfig: TsConfig = serde_json::from_str(&tsconfig_content).unwrap_or_default();

    if !tsconfig.compilerOptions.baseUrl.is_empty() {
        tsconfig.compilerOptions.baseUrl =
            if std::path::Path::new(&tsconfig.compilerOptions.baseUrl).is_absolute() {
                tsconfig.compilerOptions.baseUrl
            } else {
                std::env::current_dir()
                    .unwrap()
                    .join(&tsconfig.compilerOptions.baseUrl)
                    .canonicalize()
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string()
            };
    }

    tsconfig
}
