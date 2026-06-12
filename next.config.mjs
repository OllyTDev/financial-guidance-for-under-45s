/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repoName = "financial-guidance-for-under-45s";

const nextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
