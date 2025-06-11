import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dtgbnnv5p/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
