/** @type {import('next').NextConfig} */
import MomentLocalesPlugin from "moment-locales-webpack-plugin";

const bucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL

const additionalImagesPatterns = []
if (bucketUrl) {
  const m = bucketUrl.match(/(https?):\/\/([\w\d\.]+)/)
  if (m) {
    const bucketUrlSchema = m[1]
    const bucketUrlHost = m[2]
    additionalImagesPatterns.push({
      protocol: bucketUrlSchema,
      hostname: bucketUrlHost
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
  }
};

export default nextConfig;
