# Build for Windows arm64
echo "Building for Windows arm64"
echo "If it seems stuck, make sure you have SSH access to your VM"
ssh dariush@$VM_WIN 'rm -rf ~/zoboz-bam'
rm -rf ~/repos/zoboz/packages/zoboz-bam/target
scp -r ~/repos/zoboz/packages/zoboz-bam dariush@$VM_WIN:~/zoboz-bam
ssh dariush@$VM_WIN 'cd ~/zoboz-bam; rustup target add aarch64-pc-windows-msvc; cargo build --release --target aarch64-pc-windows-msvc'
scp dariush@$VM_WIN:~/zoboz-bam/target/aarch64-pc-windows-msvc/release/zoboz-bam.exe ~/repos/zoboz/packages/zoboz-bam/bin/binaries/zoboz-bam-win32-arm64.exe
