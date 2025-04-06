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
        target: "http://localhost:8080", // 백엔드 주소
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ""), // "/api"를 제거하고 백엔드로 전달
      },
      "/ws-stomp": {
        target: "ws://localhost:8080", // 백엔드 주소
        ws: true, // WebSocket 프록시 활성화
        changeOrigin: true, // 도메인 변경 허용
        secure: false, // HTTPS가 아니라면 false
      },
    },
  },
});
