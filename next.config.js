const headers = require("./headers");

const next_config = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
    domains: ["shekarts.com"],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "bn", "ar", "fr"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["@styled-icons/bootstrap"],
  },
};

module.exports = next_config;
