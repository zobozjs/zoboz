use std::path::Path;

use lazy_static::lazy_static;

use crate::specifier_formatter::SpecifierFormatter;

lazy_static! {
    static ref RE_REQUIRE: regex::Regex =
        regex::Regex::new(r#"require\((['"])(.+?)(['"])\)"#).unwrap();
}

pub(crate) fn format_cjs(
    specifier_formatter: &SpecifierFormatter,
    path: &Path,
    content: &str,
) -> Option<String> {
    let new_content = RE_REQUIRE.replace_all(&content, |caps: &regex::Captures| {
        format!(
            "require({}{}{})",
            &caps[1],
            specifier_formatter.format(&path, &caps[2]),
            &caps[1]
        )
    });

    if new_content != content {
        Some(new_content.into_owned())
    } else {
        None
    }
}
