/**
 * Configuración de Preloads Críticos
 * 
 * Define recursos que deben preloadearse para mejorar rendimiento.
 * El plugin de Vite procesará estas rutas automáticamente.
 * 
 * @module config/preloads
 * @author Indiana Usados
 * @version 1.0.0
 * 
 * @example
 * // Agregar nuevo recurso crítico:
 * {
 *   href: '@assets/nueva-imagen.webp',
 *   as: 'image',
 *   fetchPriority: 'high',
 * }
 */

/**
 * Lista de recursos críticos para preload
 * 
 * @type {Array<PreloadConfig>}
 * @property {string} href - Ruta del recurso (usa aliases de Vite: @assets, @, etc.)
 * @property {string} as - Tipo de recurso ('image', 'font', 'script', 'style')
 * @property {string} [fetchPriority] - Prioridad de carga ('high', 'low', 'auto')
 * @property {string} [type] - Tipo MIME del recurso (ej: 'font/woff2')
 * @property {string} [crossorigin] - Atributo crossorigin ('anonymous', 'use-credentials')
 */
export const criticalPreloads = [
  // Imagen hero - crítica para LCP (Largest Contentful Paint)
  {
    href: '@assets/foto-principal.webp',
    as: 'image',
    fetchPriority: 'high',
  },
  
  // Logo - crítico para FCP (First Contentful Paint)
  {
    href: '@assets/logo-indiana-transparent.webp',
    as: 'image',
    fetchPriority: 'high',
  },
  
  // Fuente crítica - Barlow Condensed Bold (usada en títulos)
  {
    href: '@assets/fuentes/fuentes indiana/barlowcondensed-bold-webfont.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
  },
]





