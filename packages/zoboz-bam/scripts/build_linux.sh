echo "Building for Linux" &&
  rm -rf ~/repos/zoboz/packages/zoboz-bam/target &&
  docker run -it --rm --platform linux/arm64 \
    -v $(pwd):/app rust:1.85-bullseye \
    bash -c "
    cd /app &&
    rustup update &&
    rustup target add aarch64-unknown-linux-musl &&
    cargo test &&
    cargo build --release --target aarch64-unknown-linux-musl &&
    cp /app/target/aarch64-unknown-linux-musl/release/zoboz-bam /app/binaries/zoboz-bam-linux-arm64
" &&
  rm -rf ~/repos/zoboz/packages/zoboz-bam/target &&
  docker run -it --rm --platform linux/amd64 \
    -v $(pwd):/app rust:1.85-bullseye \
    bash -c "
    cd /app &&
    rustup update &&
    rustup target add x86_64-unknown-linux-musl &&
    cargo test &&
    cargo build --release --target x86_64-unknown-linux-musl &&
    cp /app/target/x86_64-unknown-linux-musl/release/zoboz-bam /app/binaries/zoboz-bam-linux-x64
"
