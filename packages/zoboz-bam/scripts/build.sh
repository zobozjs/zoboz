#!/usr/bin/env bash

rm -rf ~/repos/zoboz/packages/zoboz-bam/bin/binaries/*

# Build for MacOS
echo "Building for MacOS"
echo "If it seems stuck, make sure you have SSH access to your VM"
ssh dariush@$VM_MAC 'rm -rf ~/zoboz-bam'
rm -rf ~/repos/zoboz/packages/zoboz-bam/target
scp -r ~/repos/zoboz/packages/zoboz-bam dariush@$VM_MAC:~/zoboz-bam
ssh dariush@$VM_MAC 'cd ~/zoboz-bam && rm -rf target && rustup target add aarch64-apple-darwin && cargo build --release --target aarch64-apple-darwin && rustup target add x86_64-apple-darwin && cargo build --release --target x86_64-apple-darwin'
scp dariush@$VM_MAC:~/zoboz-bam/target/aarch64-apple-darwin/release/zoboz-bam ~/repos/zoboz/packages/zoboz-bam/bin/binaries/zoboz-bam-darwin-arm64
scp dariush@$VM_MAC:~/zoboz-bam/target/x86_64-apple-darwin/release/zoboz-bam ~/repos/zoboz/packages/zoboz-bam/bin/binaries/zoboz-bam-darwin-x64

# Build for Linux
echo "Building for Linux"
rm -rf ~/repos/zoboz/packages/zoboz-bam/target
docker run -it --rm --platform linux/arm64 \
  -v $(pwd):/app rust \
  bash -c "
    cd /app &&
    rustup target add aarch64-unknown-linux-musl &&
    cargo build --release --target aarch64-unknown-linux-musl &&
    cp /app/target/aarch64-unknown-linux-musl/release/zoboz-bam /app/bin/binaries/zoboz-bam-linux-arm64
"

rm -rf ~/repos/zoboz/packages/zoboz-bam/target
docker run -it --rm --platform linux/amd64 \
  -v $(pwd):/app rust \
  bash -c "
    cd /app &&
    rustup target add x86_64-unknown-linux-musl &&
    cargo build --release --target x86_64-unknown-linux-musl &&
    cp /app/target/x86_64-unknown-linux-musl/release/zoboz-bam /app/bin/binaries/zoboz-bam-linux-x64
"

# Build for Windows arm64
echo "Building for Windows arm64"
echo "If it seems stuck, make sure you have SSH access to your VM"
ssh dariush@$VM_WIN 'rm -rf ~/zoboz-bam'
rm -rf ~/repos/zoboz/packages/zoboz-bam/target
scp -r ~/repos/zoboz/packages/zoboz-bam dariush@$VM_WIN:~/zoboz-bam
ssh dariush@$VM_WIN 'cd ~/zoboz-bam; rustup target add aarch64-pc-windows-msvc; cargo build --release --target aarch64-pc-windows-msvc'
scp dariush@$VM_WIN:~/zoboz-bam/target/aarch64-pc-windows-msvc/release/zoboz-bam.exe ~/repos/zoboz/packages/zoboz-bam/bin/binaries/zoboz-bam-win32-arm64.exe

echo "Building for Windows x64"
echo "If it seems stuck, makse sure the machine is running"
ssh dariush@$PC_WIN 'rm -rf ~/zoboz-bam'
rm -rf ~/repos/zoboz/packages/zoboz-bam/target
scp -r ~/repos/zoboz/packages/zoboz-bam dariush@$PC_WIN:~/zoboz-bam
ssh dariush@$PC_WIN 'cd ~/zoboz-bam; rustup target add x86_64-pc-windows-msvc; cargo build --release --target x86_64-pc-windows-msvc'
scp dariush@$PC_WIN:~/zoboz-bam/target/x86_64-pc-windows-msvc/release/zoboz-bam.exe ~/repos/zoboz/packages/zoboz-bam/bin/binaries/zoboz-bam-win32-x64.exe
