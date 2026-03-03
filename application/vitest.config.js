import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/**/*.{test,spec}.{js,jsx}"],
    setupFiles: ["./tests/setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // instrument all source files
      include: [
        "client/src/**/*.{js,jsx}",
        "server/**/*.{js,jsx}",
        "common/**/*.{js,jsx}",
      ],
      exclude: [
        "**/*.css",
        "**/node_modules/**",
        "**/coverage/**",
        "client/src/main.jsx",
        "client/src/dev-only/**",
        "server/index.js",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 50,
        statements: 70,
      },
    },
  },
});
