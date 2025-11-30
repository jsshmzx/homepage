import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.baidu.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bkimg.cdn.bcebos.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
