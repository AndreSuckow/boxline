/** @type {import('next').NextConfig} */
const pages = process.env.GITHUB_PAGES === "true";
const nextConfig = {
  output: pages ? "export" : undefined,
  basePath: pages ? "/boxline" : "",
  trailingSlash: true,
};
export default nextConfig;