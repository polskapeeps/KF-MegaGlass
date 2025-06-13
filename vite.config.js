// vite.config.js (IMPORTANT: rename from vite-config.js)
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/KF-MegaGlass/', // Make sure this matches your GitHub repo name exactly
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  // Add this to handle potential asset loading issues
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.gif'],
});
