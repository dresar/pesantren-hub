import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["rds.expedient609.com"],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3008',
        changeOrigin: true,
        ws: true,
        timeout: 30000,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, _res) => {
            console.warn('[Vite proxy] Backend tidak tersedia (127.0.0.1:3008). Jalankan: npm run dev:api  (atau npm run dev:all untuk frontend+backend sekaligus)');
          });
          proxy.on('proxyReq', () => {
            // Optional: log only in debug
          });
        },
      },
      '/uploads': {
        target: 'http://127.0.0.1:3008',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://127.0.0.1:3008',
        ws: true,
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
