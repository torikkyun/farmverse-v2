import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "picsum.photos",
      "loremflickr.com",
      "api.dicebear.com",
    ],
  },
  dangerouslyAllowSVG: true,
};

export default nextConfig;
