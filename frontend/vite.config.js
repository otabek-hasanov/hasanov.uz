import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/spa/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8099',
    },
  },
  build: {
    outDir: '../spa',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
