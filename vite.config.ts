import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// SECURITY: never inline the ImageKit private key into production bundles.
// In production builds the key is stripped so the client MUST use the
// server-side signing endpoint (VITE_IMAGEKIT_AUTH_ENDPOINT).
// Local development keeps the key for the legacy fallback only.
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: isProd
      ? { 'import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY': 'undefined' }
      : {},
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/database', 'firebase/auth', 'firebase/analytics'],
            ui: ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});
