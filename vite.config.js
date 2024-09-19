import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',  // 你的 Spring Boot 服务器地址
        changeOrigin: true,  // 是否修改请求头中的来源
        rewrite: (path) => path.replace(/^\/api/, '')  // 如果你的后端接口不以 /api 开头，可以去掉
      }
    }
  }
})
