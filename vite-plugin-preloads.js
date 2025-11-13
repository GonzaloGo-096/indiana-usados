/**
 * Vite Plugin: Preloads Automáticos
 * 
 * Lee la configuración de src/config/preloads.js
 * e inyecta preloads en index.html automáticamente.
 * 
 * Funciona en desarrollo y producción:
 * - Dev: Resuelve aliases a rutas relativas (/src/assets/...)
 * - Prod: Resuelve rutas con hash del bundle
 * 
 * @module vite-plugin-preloads
 * @author Indiana Usados
 * @version 1.0.0
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Plugin de Vite para inyectar preloads automáticamente
 * 
 * @returns {import('vite').Plugin}
 */
export function vitePluginPreloads() {
  let isDev = false
  let resolvedAssets = new Map()
  let preloadsConfig = []
  let configLoaded = false
  
  // Función para cargar configuración
  const loadConfig = async () => {
    if (configLoaded) return preloadsConfig
    
    try {
      const preloadsPath = resolve(__dirname, 'src/config/preloads.js')
      
      if (!existsSync(preloadsPath)) {
        console.warn('[vite-plugin-preloads] Archivo de configuración no encontrado:', preloadsPath)
        return []
      }
      
      // Leer archivo y parsear
      const content = readFileSync(preloadsPath, 'utf-8')
      const match = content.match(/export\s+const\s+criticalPreloads\s*=\s*(\[[\s\S]*?\]);?/s)
      
      if (match) {
        // Evaluar el array de forma segura
        const fn = new Function('return ' + match[1])
        preloadsConfig = fn()
        configLoaded = true
        return preloadsConfig
      } else {
        console.warn('[vite-plugin-preloads] No se encontró criticalPreloads en la configuración')
        return []
      }
    } catch (error) {
      console.warn('[vite-plugin-preloads] Error al cargar configuración:', error.message)
      return []
    }
  }
  
  return {
    name: 'vite-plugin-preloads',
    enforce: 'pre', // Ejecutar antes que otros plugins
    
    // Detectar si estamos en dev o build
    configResolved(config) {
      isDev = config.command === 'serve'
    },
    
    // Cargar configuración al inicio
    async buildStart() {
      await loadConfig()
      
      // Registrar assets para watch en dev
      if (isDev && preloadsConfig.length > 0) {
        preloadsConfig.forEach(preload => {
          if (preload.href && preload.href.startsWith('@')) {
            const assetPath = preload.href
              .replace('@assets', resolve(__dirname, 'src/assets'))
              .replace('@/', resolve(__dirname, 'src/'))
              .replace('@', resolve(__dirname, 'src'))
            
            if (existsSync(assetPath)) {
              this.addWatchFile(assetPath)
            }
          }
        })
      }
    },
    
    // En build, mapear assets procesados
    generateBundle(options, bundle) {
      if (isDev) return
      
      // Buscar assets procesados en el bundle
      Object.values(bundle).forEach(file => {
        if (file.type === 'asset' && file.fileName) {
          const fileName = file.name || file.fileName
          
          // Mapear nombres de archivos a rutas originales
          preloadsConfig.forEach(preload => {
            if (preload.href) {
              const assetName = preload.href.split('/').pop()
              
              // Verificar si el archivo procesado corresponde a este asset
              if (fileName.includes(assetName) || file.fileName.includes(assetName)) {
                resolvedAssets.set(preload.href, `/${file.fileName}`)
              }
            }
          })
        }
      })
    },
    
    // Inyectar preloads en HTML
    async transformIndexHtml(html) {
      try {
        // Cargar configuración si no está cargada
        if (!configLoaded) {
          await loadConfig()
        }
        
        // Si no hay configuración, no hacer nada
        if (!preloadsConfig || preloadsConfig.length === 0) {
          console.warn('[vite-plugin-preloads] No hay preloads configurados')
          return html
        }
        
        // Generar tags de preload
        const preloadTags = preloadsConfig
          .map(preload => {
            // Resolver href según el entorno
            let href = preload.href || ''
            
            if (isDev) {
              // En dev, resolver alias a ruta relativa
              href = href
                .replace('@assets', '/src/assets')
                .replace('@/', '/src/')
                .replace('@', '/src')
            } else {
              // En prod, usar ruta resuelta del bundle o fallback
              href = resolvedAssets.get(preload.href) || href
                .replace('@assets', '/assets/images')
                .replace('@/', '/src/')
                .replace('@', '/src')
            }
            
            // Construir tag de preload
            let tag = `<link rel="preload" href="${href}" as="${preload.as}"`
            
            if (preload.fetchPriority) {
              tag += ` fetchpriority="${preload.fetchPriority}"`
            }
            
            if (preload.type) {
              tag += ` type="${preload.type}"`
            }
            
            if (preload.crossorigin) {
              tag += ` crossorigin="${preload.crossorigin}"`
            }
            
            tag += ' />'
            return `    ${tag}`
          })
          .join('\n')
        
        // Debug: Log en desarrollo
        if (isDev) {
          console.log('[vite-plugin-preloads] Inyectando preloads:', preloadsConfig.length)
        }
        
        // Inyectar antes de </head>
        // Si ya hay preloads, reemplazarlos; si no, agregar
        const hasExistingPreloads = html.includes('rel="preload"')
        
        if (hasExistingPreloads) {
          // Remover preloads existentes y agregar los nuevos
          html = html.replace(/<link[^>]*rel=["']preload["'][^>]*>/g, '')
        }
        
        const result = html.replace(
          '</head>',
          `${preloadTags}\n  </head>`
        )
        
        return result
      } catch (error) {
        console.warn('[vite-plugin-preloads] Error al procesar preloads:', error.message)
        return html
      }
    }
  }
}

