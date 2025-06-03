// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/KF-MegaGlass/', //  IMPORTANT: Replace your-repo-name with your GitHub repository name!
  build: {
    outDir: 'dist', // This is the default, but good to be explicit
    assetsDir: 'assets', 

    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
