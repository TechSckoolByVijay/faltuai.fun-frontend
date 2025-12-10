import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' 
    ? (process.env.VITE_BASE_PATH || '/faltuai.fun-frontend/') 
    : '/',
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})