echo "Building for MacOS" &&
  echo "If it seems stuck, make sure you have SSH access to your VM" &&
  ssh dariush@macos-vm.local 'rm -rf ~/zoboz-bam' &&
  rm -rf ~/repos/zoboz/packages/zoboz-bam/target &&
  scp -r ~/repos/zoboz/packages/zoboz-bam dariush@macos-vm.local:~/zoboz-bam &&
  ssh dariush@macos-vm.local 'cd ~/zoboz-bam && rustup update && rustup target add aarch64-apple-darwin && rustup target add x86_64-apple-darwin && cargo test && cargo build --release --target aarch64-apple-darwin && cargo build --release --target x86_64-apple-darwin' &&
  scp dariush@macos-vm.local:~/zoboz-bam/target/aarch64-apple-darwin/release/zoboz-bam ~/repos/zoboz/packages/zoboz-bam/binaries/zoboz-bam-darwin-arm64 &&
  scp dariush@macos-vm.local:~/zoboz-bam/target/x86_64-apple-darwin/release/zoboz-bam ~/repos/zoboz/packages/zoboz-bam/binaries/zoboz-bam-darwin-x64
