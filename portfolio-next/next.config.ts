import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** App directory (portfolio-next). Fixes static /public assets when a parent folder has its own lockfile. */
const appRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
};

export default nextConfig;
