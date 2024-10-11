import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    root: './public',
    build: {
        outDir: './dist',
        rollupOptions: {
            input: [
                './resources/js/index.ts',
                './resources/js/winwheel.tsx',
                './resources/css/winwheel.css',
            ],
            output: {
                entryFileNames: 'js/[name].js',
                chunkFileNames: 'js/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            }
        }
    },
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
})
