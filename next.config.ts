import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "api-studyroomlms.dreamersdesire.com",
      },
    ],
  },
};

export default nextConfig;
