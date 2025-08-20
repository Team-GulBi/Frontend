import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "@svgr/rollup";
import { loadEnv } from "vite";

// https://vitejs.dev/config/

const env = loadEnv("", process.cwd(), "");

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: "window",
  },
  server: {
    proxy: {
      "/s3": {
        target: env.VITE_YAJOBA_S3_PROXY_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, ""),
      },
    "/api": {
      target: env.VITE_YAJOBA_SERVER_PROXY_URL,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, "/api"),
    },
    },
  },
});