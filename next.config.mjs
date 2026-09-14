/** @type {import('next').NextConfig} */
const pages = process.env.GITHUB_PAGES === "true";
const nextConfig = {
  output: pages ? "export" : undefined,
  basePath: pages ? "/boxline" : "",
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: pages ? "/boxline" : "" },
};
export default nextConfig;