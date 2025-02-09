#!/usr/bin/env bash

# Build for MacOS
echo "Building for MacOS"
echo "If it seems stuck, make sure you have SSH access to your VM"
ssh dariush@$VM_MAC 'rm -rf ~/zoboz-bam'
scp -r ~/repos/zoboz/packages/zoboz-bam dariush@$VM_MAC:~/zoboz-bam
ssh dariush@$VM_MAC 'cd ~/zoboz-bam && rm -rf target && rustup target add aarch64-apple-darwin && cargo build --release --target aarch64-apple-darwin && rustup target add x86_64-apple-darwin && cargo build --release --target x86_64-apple-darwin'
scp dariush@$VM_MAC:~/zoboz-bam/target/aarch64-apple-darwin/release/zoboz-bam ~/repos/zoboz/packages/zoboz-bam/bin/binaries/zoboz-bam-darwin-arm64
scp dariush@$VM_MAC:~/zoboz-bam/target/x86_64-apple-darwin/release/zoboz-bam ~/repos/zoboz/packages/zoboz-bam/bin/binaries/zoboz-bam-darwin-x64

# Build for Linux
echo "Building for Linux"
docker run -it --rm --platform linux/arm64 \
  -v $(pwd):/app rust \
  bash -c "
    cd /app &&
    rustup target add aarch64-unknown-linux-musl &&
    cargo build --release --target aarch64-unknown-linux-musl &&
    cp /app/target/aarch64-unknown-linux-musl/release/zoboz-bam /app/bin/binaries/zoboz-bam-linux-arm64
"

docker run -it --rm --platform linux/amd64 \
  -v $(pwd):/app rust \
  bash -c "
    cd /app &&
    rustup target add x86_64-unknown-linux-musl &&
    cargo build --release --target x86_64-unknown-linux-musl &&
    cp /app/target/x86_64-unknown-linux-musl/release/zoboz-bam /app/bin/binaries/zoboz-bam-linux-x64
"
