import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: { "/api/*": ["./drizzle/*.sql"] },
  webpack(config, { webpack }) {
    // Hostinger runs Node.js, so Worker bindings need their Node implementation.
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(
      /^cloudflare:workers$/,
      path.join(process.cwd(), "lib/hostinger-runtime.ts"),
    ));
    return config;
  },
};

export default nextConfig;
