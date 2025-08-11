import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "@svgr/rollup";

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
        target: "http://54.180.162.59:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // ✅ 핵심!
      },
      "/ws-stomp": {
        target: "ws://54.180.162.59:8080", // 백엔드 주소
        ws: true, // WebSocket 프록시 활성화
        changeOrigin: true, // 도메인 변경 허용
        secure: false, // HTTPS가 아니라면 false
      },
    },
  },
});
