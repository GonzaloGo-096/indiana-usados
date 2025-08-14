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
      '@config': resolve(__dirname, 'src/config'),
      '@test': resolve(__dirname, 'src/test')
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
  },

  // 🧪 CONFIGURACIÓN DE TESTING CON VITEST
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    testTimeout: 5000,                    // Timeout global por test
    hookTimeout: 5000,                    // Timeout para hooks
    teardownTimeout: 1000,                // Timeout para cleanup
    pool: 'forks',                        // Tests en paralelo
    include: ['src/**/*.{test,spec}.{js,jsx}'], // Solo tests unitarios
    exclude: [
      'node_modules/',
      'src/test/',
      'tests/**/*',                        // Excluir directorio tests completo
      'dist/',
      'coverage/',
      '**/*.config.js',
      '**/*.config.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'tests/**/*',                      // Excluir directorio tests completo
        'dist/',
        'coverage/',
        '**/*.config.js',
        '**/*.config.ts'
      ]
    },
    resolve: {
      alias: {
        '@test': resolve(__dirname, 'src/test'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@api': resolve(__dirname, 'src/api'),
        '@ui': resolve(__dirname, 'src/components/ui'),
        '@vehicles': resolve(__dirname, 'src/components/vehicles'),
        '@config': resolve(__dirname, 'src/config'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@services': resolve(__dirname, 'src/services'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@shared': resolve(__dirname, 'src/components/shared'),
        '@layout': resolve(__dirname, 'src/components/layout'),
        '@constants': resolve(__dirname, 'src/constants'),
        '@styles': resolve(__dirname, 'src/styles')
      }
    }
  }
})
