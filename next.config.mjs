/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "http",
        hostname: "api.cegubaya.com",
        port: "5000",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "api.cegubaya.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
