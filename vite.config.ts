import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: the ImageKit private key IS shipped in the bundle currently.
// Server-side signing (VITE_IMAGEKIT_AUTH_ENDPOINT) is preferred when
// configured AND no private key is present; otherwise local signing is used.
export default defineConfig(({ mode }) => {
  void mode;
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
