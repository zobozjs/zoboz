use serde_json::{Map, Value};

pub struct ChangeSet {
    pub description: String,
    pub changes: Vec<Change>,
}

pub struct Change {
    pub path: String,
    pub change_type: ChangeType,
    pub value: Option<String>,
}

pub enum ChangeType {
    Add,
    Remove,
    Update,
}

pub fn apply_change_sets(json_str: &str, change_sets: Vec<ChangeSet>) -> String {
    // This is causing issues with the order of the keys in the JSON
    let mut json_value: Value = serde_json::from_str(json_str).expect("Invalid JSON");

    for change_set in change_sets {
        apply_change_set(&mut json_value, change_set);
    }

    serde_json::to_string_pretty(&json_value).expect("Failed to serialize JSON")
}

fn apply_change_set(json_value: &mut Value, change_set: ChangeSet) {
    for change in change_set.changes {
        apply_change(json_value, change);
    }
}

fn apply_change(json_value: &mut Value, change: Change) {
    let keys: Vec<&str> = change.path.split('.').collect();
    let mut current = json_value;

    for key in &keys[..keys.len() - 1] {
        current = current
            .as_object_mut()
            .expect("Intermediate value is not an object")
            .entry(*key)
            .or_insert(Value::Object(Map::new()));
    }

    let final_key = keys.last().unwrap();

    match change.change_type {
        ChangeType::Add | ChangeType::Update => {
            if let Some(val) = change.value {
                // This is causing issues with the order of the keys in the JSON
                current
                    .as_object_mut()
                    .expect("Target is not an object")
                    .insert(final_key.to_string(), Value::String(val));
            }
        }
        ChangeType::Remove => {
            current
                .as_object_mut()
                .expect("Target is not an object")
                .remove(*final_key);
        }
    };
}
