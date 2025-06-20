import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    coverage: {
      provider: "istanbul", // 'v8' is the default
      reporter: ["text", "lcov"], // this enables lcov.info
      reportsDirectory: "./coverage",
    },
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
  },
});
