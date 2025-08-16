/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  server: {
    proxy: {
      '/api/doubao': {
        target: 'https://ark.cn-beijing.volces.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/doubao/, '/api/v3/images/generations'),
        headers: {
          'Origin': 'https://ark.cn-beijing.volces.com'
        }
      },
      '/api/kimi': {
        target: 'https://api.moonshot.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kimi/, '/v1/chat/completions'),
        headers: {
          'Origin': 'https://api.moonshot.cn'
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
