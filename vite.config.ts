import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget =
    env.VITE_PROXY_TARGET ||
    env.REACT_APP_PROXY_TARGET ||
    'https://deverp.narayanseva.org';
  const proxy = {
    '/api': {
      target: proxyTarget,
      changeOrigin: true,
      secure: true,
      rewrite: url => url.replace(/^\/api/, ''),
    },
    '/erp': {
      target: proxyTarget,
      changeOrigin: true,
      secure: true,
    },
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'build',
    },
    server: {
      port: 3000,
      proxy,
    },
    preview: {
      port: 4173,
      proxy,
    },
  };
});
