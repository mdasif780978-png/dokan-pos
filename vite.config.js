import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    VitePWA({
      // "prompt": never reload the app by itself in the middle of a bill.
      // The UpdateBanner component asks the shopkeeper before updating.
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'দোকান হিসাব – Dokan Hishab',
        short_name: 'দোকান হিসাব',
        description: 'মুদি দোকানের বিক্রি, স্টক ও বাকি খাতা — ইন্টারনেট ছাড়াই চলে।',
        lang: 'bn',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        // Android builds its launch screen from this colour + the icon, so it matches the in-app splash.
        background_color: '#006a4e',
        theme_color: '#006a4e',
        categories: ['business', 'finance', 'productivity'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the whole app (JS, CSS, Bangla font, icons) so it runs with no internet.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.js'],
  },
});
