import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "themilkandhoney.co",
      },
    ],
  },
};

export default nextConfig;
