import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // important for Electron to load local files after build
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // default is fine, just explicit here
  },
});
