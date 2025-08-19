import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "@svgr/rollup";
// https://vitejs.dev/config/
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
    "/api": {
      target: "http://13.125.214.207:8080", // 포트 포함
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, "/api"), // 또는 생략 가능
    },
    },
  },
});