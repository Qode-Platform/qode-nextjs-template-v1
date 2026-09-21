import type { NextConfig } from "next";

// Fleet contract: nginx forwards the whole /direct/<agent>:<port> prefix
// UNCHANGED. Next bakes basePath/assetPrefix at BUILD time AND re-reads them at
// runtime, so fleet.conf sets NEXT_PUBLIC_BASE_PATH on both steps. BASE_PATH is
// the fallback for running outside the fleet. Empty => serve at the host root.
const raw = (process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.BASE_PATH ?? "").trim();
const basePath = raw ? `/${raw.replace(/^\/+|\/+$/g, "")}` : "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
