import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Dockerfile's runtime stage copies .next/standalone; without this the
  // image build fails at that COPY.
  output: "standalone",
};

export default nextConfig;
