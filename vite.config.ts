import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: Object.assign(
      {},
      {
        "~shared": path.resolve(__dirname, "src/components/shared"),
      }
    ),
  },
});
