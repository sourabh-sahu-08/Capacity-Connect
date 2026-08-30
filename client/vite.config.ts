import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  optimizeDeps: {
    include: ['shared']
  },
  build: {
    commonjsOptions: {
      include: [/shared/, /node_modules/]
    }
  }
})
