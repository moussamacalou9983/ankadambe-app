import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const currentDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    // Evite que Turbopack ne remonte a un "workspace root" incorrect et ne tente
    // de scanner des dossiers hors du projet (peut provoquer des "Acces refuse").
    root: currentDir,
  },
};

export default nextConfig;
