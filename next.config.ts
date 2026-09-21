import type { NextConfig } from "next";

// Fleet contract: nginx forwards the whole /direct/<agent>:<port> prefix
// UNCHANGED. Next bakes basePath/assetPrefix at BUILD time, so the build step
// must see $BASE_PATH. Empty/unset => serve at the host root.
const raw = (process.env.BASE_PATH ?? "").trim();
const basePath = raw ? `/${raw.replace(/^\/+|\/+$/g, "")}` : "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
