import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@images": path.resolve("src", "assets", "images"),
      "@component": path.resolve("src", "components", "index"),
    },
  },
});
