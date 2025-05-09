echo "Building for Windows x64" &&
  echo "If it seems stuck, makse sure the machine is running" &&
  ssh dariush@windows-x64.local 'rmdir /S /Q zoboz-bam' &&
  rm -rf ~/repos/zoboz/packages/zoboz-bam/target &&
  scp -r ~/repos/zoboz/packages/zoboz-bam dariush@windows-x64.local:~/zoboz-bam &&
  ssh dariush@windows-x64.local 'cd zoboz-bam && rustup update && rustup target add x86_64-pc-windows-msvc && cargo test && cargo build --release --target x86_64-pc-windows-msvc' &&
  scp dariush@windows-x64.local:~/zoboz-bam/target/x86_64-pc-windows-msvc/release/zoboz-bam.exe ~/repos/zoboz/packages/zoboz-bam/binaries/zoboz-bam-win32-x64.exe
