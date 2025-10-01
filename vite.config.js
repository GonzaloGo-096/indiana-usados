import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // ✅ BUNDLE ANALYZER - Solo en build de producción
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // 'treemap' | 'sunburst' | 'network'
    })
  ],
  
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
      '@test': resolve(__dirname, 'src/test'),
      // ✅ NUEVOS ALIAS AGREGADOS
      '@features': resolve(__dirname, 'src/features'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@mappers': resolve(__dirname, 'src/mappers'),
      '@routes': resolve(__dirname, 'src/routes'),
      '@types': resolve(__dirname, 'src/types'),
      '@metrics': resolve(__dirname, 'src/metrics')
    }
  },
  
  build: {
    // ✅ OPTIMIZACIONES ESTÁNDAR DE VITE
    target: 'esnext', // Código moderno para mejor rendimiento
    minify: 'esbuild', // Más rápido que terser
    sourcemap: false, // Solo en desarrollo
    chunkSizeWarningLimit: 1000,
    
    // ✅ ESBUILD: Eliminar console/debugger en producción
    esbuild: {
      drop: ['console', 'debugger'],
      legalComments: 'none',
    },
    
    // ✅ OPTIMIZACIÓN DE IMÁGENES
    rollupOptions: {
      output: {
        // ✅ VENDOR CHUNKS: 3 grupos para mejor cache
        manualChunks: (id) => {
          // vendor-react: React core (cache muy estable - meses)
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          
          // vendor-core: Libs principales del stack (cache estable - semanas)
          if (id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/@remix-run/') ||
              id.includes('node_modules/@tanstack/react-query') ||
              id.includes('node_modules/axios/')) {
            return 'vendor-core'
          }
          
          // vendor-misc: Resto de node_modules
          if (id.includes('node_modules/')) {
            return 'vendor-misc'
          }
        },
        // ✅ ORGANIZACIÓN DE ASSETS POR TIPO
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          // Imágenes en carpeta separada
          if (/\.(webp|avif|png|jpe?g|svg|gif)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`
          }
          // Fuentes en carpeta separada
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          // CSS en carpeta separada
          if (/\.css$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`
          }
          // Otros assets
          return `assets/[name]-[hash][extname]`
        }
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
    port: 8080,
    strictPort: true,
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
        '@styles': resolve(__dirname, 'src/styles'),
        // ✅ NUEVOS ALIAS AGREGADOS
        '@features': resolve(__dirname, 'src/features'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@mappers': resolve(__dirname, 'src/mappers'),
        '@routes': resolve(__dirname, 'src/routes'),
        '@types': resolve(__dirname, 'src/types'),
        '@metrics': resolve(__dirname, 'src/metrics')
      }
    }
  }
})
