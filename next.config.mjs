/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // TAMBAHKAN BARIS INI:
    // Ini memerintahkan Next.js untuk menampilkan gambar apa adanya
    // tanpa mencoba memprosesnya di server (bypass error localhost).
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;
