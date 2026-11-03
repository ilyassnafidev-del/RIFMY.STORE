import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: { "/api/*": ["./drizzle/*.sql"] },
  async headers() {
    return [
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      ...["products", "brand", "journal"].map(directory => ({ source: `/${directory}/:path*`, headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] })),
    ];
  },
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
