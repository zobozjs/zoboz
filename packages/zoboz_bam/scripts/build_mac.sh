#!/usr/bin/env bash

ssh dariush@$VM_MAC 'rm -rf ~/zoboz_bam'
scp -r ~/repos/zoboz/packages/zoboz_bam dariush@$VM_MAC:~/zoboz_bam
ssh dariush@$VM_MAC 'cd ~/zoboz_bam && rm -rf target && rustup target add aarch64-apple-darwin && cargo build --release --target aarch64-apple-darwin && rustup target add x86_64-apple-darwin && cargo build --release --target x86_64-apple-darwin'
scp dariush@$VM_MAC:~/zoboz_bam/target/aarch64-apple-darwin/release/zoboz_bam ~/repos/zoboz/packages/zoboz_bam/zoboz_macos_arm64
scp dariush@$VM_MAC:~/zoboz_bam/target/x86_64-apple-darwin/release/zoboz_bam ~/repos/zoboz/packages/zoboz_bam/zoboz_macos_x64
