import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@services': resolve(__dirname, 'src/services'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
          router: ['react-router-dom'],
          axios: ['axios'],
          forms: ['react-hook-form', 'react-select'],
          slider: ['rc-slider']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'react-router-dom',
      'axios',
      'react-hook-form',
      'react-select',
      'rc-slider'
    ]
  },
  
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  preview: {
    port: 4173,
    open: true
  }
})
