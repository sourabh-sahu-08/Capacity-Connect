import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      shared: path.resolve(import.meta.dirname, '../shared/index.ts'),
    },
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    // Raise the warning threshold (still informational)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split heavy vendor libraries into separately cached chunks
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'vendor-framer';
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'vendor-recharts';
          if (id.includes('node_modules/socket.io-client') || id.includes('node_modules/engine.io-client')) return 'vendor-socket';
          if (id.includes('node_modules/react-dom')) return 'vendor-react-dom';
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/') || id.includes('node_modules/@remix-run/')) return 'vendor-router';
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('node_modules/axios')) return 'vendor-axios';
          if (id.includes('node_modules/zustand')) return 'vendor-zustand';
        },
      },
    },
  },
})
