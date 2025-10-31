import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === 'github-pages' ? '/code-editor/' : '/'
  
  return {
    plugins: [react()],
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'monaco-editor': ['monaco-editor'],
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          }
        }
      }
    },
    server: {
      port: 5173,
      strictPort: true
    },
    publicDir: 'public',
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  }
})