import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  console.log("enable mock :", env.VITE_MOCK === "true");

  return {
    plugins: [
      react(),
      jsconfigPaths(),
      visualizer({
        filename: "./build-report.html",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      alias: {
        "#/*": "src/*",
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["tests/setup.js"],
    },
    coverage: {
      enabled: true,
      include: ["src/**/*"],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80,
      },
    },
  };
});
