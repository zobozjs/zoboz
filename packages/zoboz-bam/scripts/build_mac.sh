#!/usr/bin/env bash

ssh dariush@$VM_MAC 'rm -rf ~/zoboz-bam'
scp -r ~/repos/zoboz/packages/zoboz-bam dariush@$VM_MAC:~/zoboz-bam
ssh dariush@$VM_MAC 'cd ~/zoboz-bam && rm -rf target && rustup target add aarch64-apple-darwin && cargo build --release --target aarch64-apple-darwin && rustup target add x86_64-apple-darwin && cargo build --release --target x86_64-apple-darwin'
scp dariush@$VM_MAC:~/zoboz-bam/target/aarch64-apple-darwin/release/zoboz-bam ~/repos/zoboz/packages/zoboz-bam/zoboz_macos_arm64
scp dariush@$VM_MAC:~/zoboz-bam/target/x86_64-apple-darwin/release/zoboz-bam ~/repos/zoboz/packages/zoboz-bam/zoboz_macos_x64
