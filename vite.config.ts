import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await";
import { splitVendorChunkPlugin } from 'vite'
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: () => 'main.js'
      },
    },
  },
  plugins: [
    react(),
    wasm(),
    splitVendorChunkPlugin(),
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: i => `__tla_${i}`
    }),
  ],
})
