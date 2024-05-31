/** @type {import('next').NextConfig} */
import MomentLocalesPlugin from "moment-locales-webpack-plugin";

const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "avatars.githubusercontent.com"
    }]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: "yaml-loader"
    });
    config.plugins.push(new MomentLocalesPlugin({
      localesToKeep: ["en", "ru"],
    }));

    return config;
  }
};

export default nextConfig;
