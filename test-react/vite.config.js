import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mizumi from '../packages/vite-plugin/index.js'

export default defineConfig({
  plugins: [
    react(),
    mizumi()
  ]
})
