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
  preview: {
    allowedHosts: ["note.mvpc.site"],
  },

  build:{
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules') && (id.includes('react') || id.includes('react-dom'))) {
            return 'vendor-react-core';
          }          

          if (id.includes('node_modules') && id.includes('@codemirror')) {
            const match = id.match(/[\\/]node_modules[\\/](@codemirror[\\/][^\\/]+)/);
            if (match) {
              return match[1].replace('@', '').replace(/[\\/]/g, '-'); 
            }
          }
          
          if (id.includes('node_modules')) return 'vendor-common';
        }
      } 
    }
  }
})
