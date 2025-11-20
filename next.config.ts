import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Base path for GitHub Pages (update this to match your repo name)
  basePath: process.env.NODE_ENV === "production" ? "/nubrakes-fleet-portal" : "",
  // Trailing slash for GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
