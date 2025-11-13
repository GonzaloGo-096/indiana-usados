import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// FCP/LCP Phase 2.3: CSS crítico inline para primer paint
const criticalCSS = `/* FCP/LCP Phase 2.3: CSS crítico inline para primer paint */
:root{--font-sans:system-ui,-apple-system,'Segoe UI',Roboto,'Inter',Arial,sans-serif;--font-size-base:1rem;--line-height-normal:1.5;--color-neutral-900:#202124;--container-max-width:1200px;--container-padding-mobile:0.5rem;--container-padding-tablet:1rem;--container-padding-desktop:1rem}*{box-sizing:border-box}html,body{margin:0;padding:0;font-family:var(--font-sans);font-size:var(--font-size-base);line-height:var(--line-height-normal);color:var(--color-neutral-900);background:linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%);background-attachment:fixed;min-height:100vh}html{scroll-behavior:smooth}#root{min-height:100vh;display:flex;flex-direction:column}.main-content{flex:1;width:100%}`

// FCP/LCP Phase 4: Plugin para reorganizar orden de modulepreloads
// Asegura que vendor-react se cargue antes de vendor-core y vendor-misc
function vitePluginReorderModulepreloads() {
  return {
    name: 'vite-plugin-reorder-modulepreloads',
    enforce: 'post',

    transformIndexHtml(html) {
      // FCP/LCP Phase 4: Reorganizar modulepreloads - vendor-react primero
      const modulepreloadRegex = /<link\s+rel=["']modulepreload["'][^>]*href=["']([^"']+vendor-(react|core|misc)[^"']*)["'][^>]*>/g
      const matches = Array.from(html.matchAll(modulepreloadRegex))
      
      if (matches.length > 0) {
        // Separar por tipo
        const reactPreloads = matches.filter(m => m[2] === 'react').map(m => m[0])
        const corePreloads = matches.filter(m => m[2] === 'core').map(m => m[0])
        const miscPreloads = matches.filter(m => m[2] === 'misc').map(m => m[0])
        
        // Orden correcto: vendor-react → vendor-core → vendor-misc
        const reorderedPreloads = [...reactPreloads, ...corePreloads, ...miscPreloads]
        
        if (reorderedPreloads.length > 0) {
          // Remover todos los modulepreloads existentes
          html = html.replace(modulepreloadRegex, '')
          
          // Insertar en orden correcto después del script principal (fuera del tag script)
          // Buscar el tag script completo (self-closing o con cierre)
          const scriptRegex = /<script[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*(\/>|><\/script>)/g
          const scriptMatch = html.match(scriptRegex)
          
          if (scriptMatch && scriptMatch[0]) {
            // Insertar modulepreloads después del script principal (en líneas separadas)
            const reorderedTags = reorderedPreloads.map(tag => `    ${tag}`).join('\n')
            // Reemplazar script y agregar modulepreloads después
            const scriptReplacement = scriptMatch[0].replace(/(\/>|><\/script>)/, '></script>')
            html = html.replace(scriptMatch[0], `${scriptReplacement}\n${reorderedTags}`)
          }
        }
      }
      
      return html
    }
  }
}

// FCP/LCP Phase 2.3: Plugin para inyectar CSS crítico inline
function vitePluginCriticalCSS() {
  return {
    name: 'vite-plugin-critical-css',
    enforce: 'post', // Ejecutar después de que Vite inyecte el CSS completo

    // FCP/LCP Phase 2.3: Inyectar CSS crítico inline y preload del CSS completo
    transformIndexHtml(html) {
      // FCP/LCP Phase 2.3: CSS crítico inline para primer paint
      const criticalStyleTag = `    <!-- FCP/LCP Phase 2.3: CSS crítico inline para primer paint -->
    <style>${criticalCSS}</style>`

      // Buscar el link de CSS que Vite inyecta
      const cssLinkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+\.css[^"']*)["'][^>]*>/g
      const cssMatches = Array.from(html.matchAll(cssLinkRegex))

      // FCP/LCP Phase 2.3: Reorganizar orden: CSS crítico inline -> Preload CSS -> Stylesheet link
      if (cssMatches.length > 0) {
        const firstCssLink = cssMatches[0][0]
        const cssHref = cssMatches[0][1]

        // Crear tag de preload para el CSS completo
        const cssPreloadTag = `    <!-- FCP/LCP Phase 2.3: Preload del CSS completo -->
    <link rel="preload" href="${cssHref}" as="style" crossorigin="anonymous">`

        // Reemplazar el link de stylesheet con: CSS crítico inline + Preload + Stylesheet link
        // Orden correcto: CSS crítico primero (inline), luego preload, luego stylesheet
        const replacement = criticalStyleTag + '\n' + cssPreloadTag + '\n    ' + firstCssLink
        html = html.replace(firstCssLink, replacement)
        
        return html
      }

      // Si no hay CSS (no debería pasar en build), insertar CSS crítico antes de </head>
      const headCloseIndex = html.lastIndexOf('</head>')
      if (headCloseIndex !== -1) {
        const beforeHeadClose = html.substring(0, headCloseIndex)
        const afterHeadClose = html.substring(headCloseIndex)
        return beforeHeadClose + criticalStyleTag + '\n  ' + afterHeadClose
      }

      return html
    }
  }
}

// ✅ SIMPLE: visualizer solo cuando ANALYZE=true
// Uso normal:    npm run build              (rápido - 5-6s)
// Con análisis:  npm run build:analyze      (completo - 8-10s)

export default defineConfig({
  // FCP/LCP Phase 4: Base path para assets - usar ruta absoluta para compatibilidad con SPA
  base: '/',
  
  plugins: [
    react(),
    // FCP/LCP Phase 4: Plugin para reorganizar orden de modulepreloads
    // Debe ejecutarse DESPUÉS de que Vite genere los modulepreloads pero ANTES del CSS crítico
    vitePluginReorderModulepreloads(),
    // FCP/LCP Phase 2.3: Plugin para CSS crítico inline
    vitePluginCriticalCSS(),
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
    // FCP/LCP Phase 4: Directorio de salida explícito
    outDir: 'dist',
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
        // FCP/LCP Phase 4: Asegurar orden de carga - React Router PRIMERO para evitar createContext undefined
        // CORRECCIÓN: react-router-dom debe estar con React (usa React.createContext en inicialización)
        manualChunks: (id) => {
          // 🔹 PRIORIDAD MÁXIMA: React Router y dependencias
          // Esto debe evaluarse ANTES de cualquier otra condición
          // Evita que @remix-run/router y react-router se agrupen en vendor-core
          if (
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/react-router/') ||
            id.includes('node_modules/@remix-run/router/') ||
            id.includes('node_modules/@remix-run/router')
          ) {
            return 'vendor-react'
          }

          // 🔹 React core (React y ReactDOM)
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/')
          ) {
            return 'vendor-react'
          }

          // 🔹 React error boundary (usa contextos React)
          if (id.includes('node_modules/react-error-boundary/')) {
            return 'vendor-react'
          }

          // 🔹 TanStack React Query (usa React.createContext - debe estar con React)
          // CORRECCIÓN: Se movió aquí porque usa W.createContext en su inicialización
          // Si está en vendor-core, puede ejecutarse antes de que React esté disponible
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-react'
          }

          // 🔹 React Hook Form (usa React.createContext - debe estar con React)
          // CORRECCIÓN: Se movió aquí porque usa te.createContext en su inicialización
          // Si está en vendor-core, puede ejecutarse antes de que React esté disponible
          if (id.includes('node_modules/react-hook-form/')) {
            return 'vendor-react'
          }

          // 🔹 Vendor-core: librerías que no se ejecutan en el render inicial y NO dependen de React
          if (id.includes('node_modules/axios/')) {
            return 'vendor-core'
          }

          // 🔹 Resto de librerías
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
    open: true,
    // FCP/LCP Phase 4: History API Fallback para SPA routing
    // Permite que React Router maneje todas las rutas (ej: /vehiculos, /nosotros)
    // Sin esto, rutas como /vehiculos devuelven 404 en preview
    cors: true
  }
})
