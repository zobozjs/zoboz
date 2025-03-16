use lazy_static::lazy_static;
use std::path::Path;

use crate::shared::specifier_regex;

use super::reformatter::Reformatter;

lazy_static! {
    static ref RE_TYPE_JSON: regex::Regex =
        regex::Regex::new(r#"(\btype\s*:\s*['"]json['"])"#).unwrap();
    static ref RE_EMPTY_IMPORT_ATTRIBUTES: regex::Regex =
        regex::Regex::new(r#"\s*\b(?:with|assert)\s*\{\s*\}"#).unwrap();
}

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
            let specifier = reformatter.reformat(&file_path, &caps[3]);
            // caps[5] is the import attributes
            if caps.get(5).is_none() {
                return format!("{}{}{}{}", &caps[1], &caps[2], specifier, &caps[4]);
            }

            // if the resolved specifier is a js file but the import attribute has type: 'json' then drop the type attribute
            let is_json_type_and_js_file = (caps[5].contains("type: \"json\"")
                || caps[5].contains("type: 'json'"))
                && specifier.ends_with(".js");

            if !is_json_type_and_js_file {
                return format!(
                    "{}{}{}{}{}",
                    &caps[1], &caps[2], specifier, &caps[4], &caps[5]
                );
            }

            let shortened_import_attributes = caps[5]
                .replace("type: \"json\"", "")
                .replace("type: 'json'", "")
                .replace("\n", "")
                .replace("\r", "")
                .replace(" ", "")
                .replace("\t", "")
                .replace(",,", ",")
                .replace("with{", " with {")
                .replace("assert{", " assert {")
                .replace("{,", "{")
                .replace(",}", "}");

            if RE_EMPTY_IMPORT_ATTRIBUTES.is_match(&shortened_import_attributes) {
                return format!("{}{}{}{}", &caps[1], &caps[2], specifier, &caps[4]);
            }

            return format!(
                "{}{}{}{}{}",
                &caps[1], &caps[2], specifier, &caps[4], &shortened_import_attributes
            );
        });

    new_content
}
