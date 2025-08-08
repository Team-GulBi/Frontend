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
      "/s3": {
        target: "https://yazoba-img-s3.s3.ap-northeast-2.amazonaws.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, ""),
      },
    "/api": {
      target: "http://54.180.162.59:8080", // 포트 포함
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, "/api"), // 또는 생략 가능
    },
    },
  },
});