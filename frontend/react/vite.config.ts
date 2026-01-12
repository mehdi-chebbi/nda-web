import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/docs': {
        target: 'http://192.168.2.120',
        changeOrigin: true
      },
      '/news-imgs': {
        target: 'http://192.168.2.120',
        changeOrigin: true
      },
      '/api': {
        target: 'http://192.168.2.120',
        changeOrigin: true
      }
    }
  }
})
