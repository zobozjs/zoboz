echo "Building for Windows arm64" &&
  echo "If it seems stuck, make sure you have SSH access to your VM" &&
  ssh dariush@windows-arm64.local 'rmdir /S /Q zoboz-bam' &&
  rm -rf ~/repos/zoboz/packages/zoboz-bam/target &&
  scp -r ~/repos/zoboz/packages/zoboz-bam dariush@windows-arm64.local:~/zoboz-bam &&
  ssh dariush@windows-arm64.local 'cd zoboz-bam && rustup update && rustup target add aarch64-pc-windows-msvc && cargo test && cargo build --release --target aarch64-pc-windows-msvc' &&
  scp dariush@windows-arm64.local:~/zoboz-bam/target/aarch64-pc-windows-msvc/release/zoboz-bam.exe ~/repos/zoboz/packages/zoboz-bam/binaries/zoboz-bam-win32-arm64.exe
