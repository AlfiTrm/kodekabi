import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dllvucwgezsuhwktkwxd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.oss-cn-shenzhen.aliyuncs.com",
      },
      {
        protocol: "https",
        hostname: "*.oss-ap-southeast-1.aliyuncs.com",
      },
      {
        protocol: "https",
        hostname: "dashscope-result-*.aliyuncs.com",
      },
    ],
  },
};

export default nextConfig;
