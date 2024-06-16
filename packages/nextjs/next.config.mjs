/** @type {import('next').NextConfig} */
import MomentLocalesPlugin from "moment-locales-webpack-plugin";

const additionalImageUrls = [process.env.NEXT_PUBLIC_S3_BUCKET_URL, process.env.NEXT_PUBLIC_UI_URL]
const additionalImagesPatterns = []

for (const url of additionalImageUrls) {
  if (!url) {
    continue
  }

  const m = url.match(/(https?):\/\/([\w\d\.]+)/)
  if (m) {
    const urlSchema = m[1]
    const urlHost = m[2]
    additionalImagesPatterns.push({
      protocol: urlSchema,
      hostname: urlHost
    })
  }
}

const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "avatars.githubusercontent.com"
    }, ...additionalImagesPatterns]
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
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};

export default nextConfig;
