use std::path::Path;

use crate::shared::specifier_regex;

use super::reformatter::Reformatter;

pub(super) fn update_cjs(
    reformatter: &Reformatter,
    file_path: &Path,
    file_content: &str,
) -> Option<String> {
    let new_content = update_requires_and_imports(reformatter, file_path, file_content);
    if new_content != file_content {
        Some(new_content.into_owned())
    } else {
        None
    }
}

pub(super) fn update_esm(
    reformatter: &Reformatter,
    file_path: &Path,
    file_content: &str,
) -> Option<String> {
    let new_content = update_requires_and_imports(reformatter, file_path, file_content);
    let new_content = update_froms(reformatter, file_path, &new_content);

    if new_content != file_content {
        Some(new_content.into_owned())
    } else {
        None
    }
}

pub(super) fn update_dts(
    specifiers_reformatter: &Reformatter,
    file_path: &Path,
    file_content: &str,
) -> Option<String> {
    let new_content = update_requires_and_imports(specifiers_reformatter, file_path, file_content);
    let new_content = update_froms(specifiers_reformatter, file_path, &new_content);

    if new_content != file_content {
        Some(new_content.into_owned())
    } else {
        None
    }
}

fn update_requires_and_imports<'a>(
    reformatter: &'a Reformatter,
    file_path: &'a Path,
    file_content: &'a str,
) -> std::borrow::Cow<'a, str> {
    let new_content = specifier_regex::RE_REQUIRE_OR_IMPORT.replace_all(
        &file_content,
        |caps: &regex::Captures| {
            format!(
                "{}{}{}{}",
                &caps[1],
                &caps[2],
                reformatter.reformat(&file_path, &caps[3]),
                &caps[4]
            )
        },
    );

    new_content
}

fn update_froms<'a>(
    reformatter: &'a Reformatter,
    file_path: &'a Path,
    file_content: &'a str,
) -> std::borrow::Cow<'a, str> {
    let new_content =
        specifier_regex::RE_FROM.replace_all(&file_content, |caps: &regex::Captures| {
            format!(
                "{}{}{}{}",
                &caps[1],
                &caps[2],
                reformatter.reformat(&file_path, &caps[3]),
                &caps[4]
            )
        });

    new_content
}
