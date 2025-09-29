/**
 * Mirror of next.config.ts in JavaScript to avoid runtime TypeScript detection.
 * This prevents Next from attempting to install TypeScript when starting the app.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;
