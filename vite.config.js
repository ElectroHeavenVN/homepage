import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Font from 'vite-plugin-font'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  base: '/homepage/',
  plugins: [
    vue(),
    Font.vite({
      css: {
        fontFamily: 'BlueakaBeta2GBK'
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '$': fileURLToPath(new URL('./public', import.meta.url)),    
    }
  },
})
