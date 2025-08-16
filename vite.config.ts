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
  build: {
    rollupOptions: {
      maxParallelFileOps: 1,
      output: {
        manualChunks: {
          // 将Material-UI分离到单独的chunk
          'mui': ['@mui/material', '@mui/icons-material'],
          // 将React相关库分离
          'react-vendor': ['react', 'react-dom'],
          // 将Ionic相关库分离
          'ionic-vendor': ['@ionic/react', '@ionic/react-router'],
          // 将路由相关库分离
          'router-vendor': ['react-router', 'react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 提高警告阈值到1MB
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material'],
  },
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
