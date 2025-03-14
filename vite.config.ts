import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",         
    port: 3000, // Фронт на 3000
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:3500', // Бэк на 3500
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
