#!/usr/bin/env bash

ssh dariush@$VM_MAC 'rm -rf ~/zoboz_rs'
scp -r ~/repos/zoboz/packages/zoboz_rs dariush@$VM_MAC:~/zoboz_rs
ssh dariush@$VM_MAC 'cd ~/zoboz_rs && rm -rf target && rustup target add aarch64-apple-darwin && cargo build --release --target aarch64-apple-darwin && rustup target add x86_64-apple-darwin && cargo build --release --target x86_64-apple-darwin'
scp dariush@$VM_MAC:~/zoboz_rs/target/aarch64-apple-darwin/release/zoboz_rs ~/repos/zoboz/packages/zoboz_rs/zoboz_macos_arm64
scp dariush@$VM_MAC:~/zoboz_rs/target/x86_64-apple-darwin/release/zoboz_rs ~/repos/zoboz/packages/zoboz_rs/zoboz_macos_x64
