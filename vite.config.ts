import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasm from "vite-plugin-wasm"

export default defineConfig({
  plugins: [
    vue(),
    wasm(),
  ],
})
