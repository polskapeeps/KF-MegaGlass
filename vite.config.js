import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/KF-MegaGlass/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'glass-doors': resolve(__dirname, 'glass-doors.html'),
        partitions: resolve(__dirname, 'partitions.html'),
        railings: resolve(__dirname, 'railings.html'),
        hardware: resolve(__dirname, 'hardware.html'),
        'shower-enclosures': resolve(__dirname, 'shower-enclosures.html'),
        'frameless-glass-doors': resolve(
          __dirname,
          'frameless-glass-doors.html'
        ),
        'partition-systems': resolve(__dirname, 'partition-systems.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.gif'],
});
