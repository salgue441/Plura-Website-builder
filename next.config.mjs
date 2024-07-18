import createNextPlugin from "next-intl/plugin";

/** @type {import('next-intl').NextIntlPlugin} */
const withNextIntl = createNextPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com"
      },
      {
        protocol: "https",
        hostname: "utfs.io"
      },
      {
        protocol: "https",
        hostname: "img.clerk.com"
      },
      {
        protocol: "https",
        hostname: "files.stripe.com"
      }
    ]
  },
  reactStrictMode: false,
  pageExtensions: ["tsx", "ts"]
};

export default withNextIntl(nextConfig);
