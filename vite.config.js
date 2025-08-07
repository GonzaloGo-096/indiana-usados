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
      '@vehicles': resolve(__dirname, 'src/components/vehicles'),
      '@ui': resolve(__dirname, 'src/components/ui'),
      '@layout': resolve(__dirname, 'src/components/layout'),
      '@shared': resolve(__dirname, 'src/components/shared'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@services': resolve(__dirname, 'src/services'),
      '@api': resolve(__dirname, 'src/api'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@config': resolve(__dirname, 'src/config')
    }
  },
  
  build: {
    // ✅ OPTIMIZACIONES ESTÁNDAR DE VITE
    target: 'esnext', // Código moderno para mejor rendimiento
    minify: 'esbuild', // Más rápido que terser
    sourcemap: false, // Solo en desarrollo
    chunkSizeWarningLimit: 1000,
    
    // ✅ ELIMINAR CHUNKS MANUALES - Vite decide automáticamente
    rollupOptions: {
      output: {
        // Vite maneja el code splitting automáticamente
        manualChunks: undefined
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
