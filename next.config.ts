import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com", "tse4.mm.bing.net"],
  },
};

export default nextConfig;
