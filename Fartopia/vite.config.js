import base44 from "@base44/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === "true",
    }),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Fartopia",
        short_name: "Fartopia",
        description: "Silly fart games for kids!",
        theme_color: "#ff69b4",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
