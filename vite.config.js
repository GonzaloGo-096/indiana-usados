import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// ✅ SIMPLE: visualizer solo cuando ANALYZE=true
// Uso normal:    npm run build              (rápido - 5-6s)
// Con análisis:  npm run build:analyze      (completo - 8-10s)

export default defineConfig({
  plugins: [
    react(),
    // ✅ Solo activar con variable de entorno
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ].filter(Boolean),
  
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
      // ✅ ALIAS ADICIONALES
      '@pages': resolve(__dirname, 'src/pages'),
      '@mappers': resolve(__dirname, 'src/mappers'),
      '@routes': resolve(__dirname, 'src/routes'),
      '@types': resolve(__dirname, 'src/types'),
      '@schemas': resolve(__dirname, 'src/schemas')
    }
  },
  
  build: {
    // ✅ OPTIMIZACIONES ESTÁNDAR DE VITE
    target: 'esnext', // Código moderno para mejor rendimiento
    minify: 'esbuild', // Más rápido que terser
    sourcemap: false, // Solo en desarrollo
    chunkSizeWarningLimit: 1000,
    
    // ✅ ESBUILD: Solo eliminar debugger (más rápido)
    // console.log útil para debugging, solo eliminar debugger
    esbuild: {
      drop: ['debugger'],
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
      'rc-slider'
    ]
  },
  
  server: {
    port: 8080,
    strictPort: true,
    open: true,
    cors: true,
    // ✅ Content Security Policy - Activa
    // Cambiado de Report-Only a CSP Activa después de verificar que no hay violaciones
    // upgrade-insecure-requests agregado para forzar HTTPS
    // unsafe-eval mantenido solo para desarrollo (Vite HMR)
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // unsafe-eval solo para desarrollo
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' https://res.cloudinary.com data: blob:",
        "font-src 'self' data:",
        "connect-src 'self' http://localhost:3001 https://res.cloudinary.com",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests"
      ].join('; ')
    }
  },
  
  preview: {
    port: 4173,
    open: true
  }
})
