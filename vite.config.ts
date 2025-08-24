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
    "/ws-stomp": {
        target: env.VITE_YAJOBA_WS_URL, // 백엔드 주소
        ws: true, // WebSocket 프록시 활성화
        changeOrigin: true, // 도메인 변경 허용
        secure: false, // HTTPS가 아니라면 false
      },
    },
  },
});
