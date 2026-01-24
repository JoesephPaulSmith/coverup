import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  turbopack: {
    root: '/coverup/'
  },
};

export default nextConfig;
