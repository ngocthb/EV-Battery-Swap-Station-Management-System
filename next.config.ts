import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
    ],

    domains: [
      "i0.wp.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "upload.wikimedia.org",
    ],

    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
