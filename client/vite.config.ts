import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      shared: path.resolve(__dirname, '../shared/index.ts'),
    },
  },
  plugins: [
    tailwindcss(),
    react()
  ],
})
