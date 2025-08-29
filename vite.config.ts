import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "shopify-collection-widget.js",
        chunkFileNames: "shopify-collection-widget.js",
        assetFileNames: "shopify-collection-widget.[ext]",
        manualChunks: undefined,
      },
    },
    target: "es2017",
    minify: false,
  },
  define: {
    "process.env": {},
  },
});
