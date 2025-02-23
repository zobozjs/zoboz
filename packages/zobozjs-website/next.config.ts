import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	basePath: process.env.NODE_ENV === "production" ? "" : "",
	assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
};

export default nextConfig;
