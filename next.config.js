/** @type {import('next').NextConfig} */
const createMDX = require('@next/mdx');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "seo-heist.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dwdwn8b5ye.ufs.sh",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ansubkhan.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    reactCompiler: true,
    serverActions: true,
  },
  pageExtensions: ["ts", "tsx", "mdx"],
  webpack: (config, { isServer }) => {
    // Externalize problematic packages
    if (!isServer) {
      config.externals = [...(config.externals || []), 
        'leaflet', 
        'react-leaflet', 
        '@react-leaflet/core'
      ];
    }
    return config;
  },
};

const withMDX = createMDX({});

module.exports = withMDX(nextConfig); 