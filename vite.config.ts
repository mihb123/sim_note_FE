import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, './src/features'), 
      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
