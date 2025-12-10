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
  // Usando la imagen desktop que es la que se carga en pantallas grandes
  {
    href: '@assets/home/indiana-hero-1-desktop.webp',
    as: 'image',
    fetchPriority: 'high',
  },
  
  // Logo - crítico para FCP (First Contentful Paint)
  {
    href: '@assets/common/INDIANA-final.webp',
    as: 'image',
    fetchPriority: 'high',
  },
  
  // Fuente crítica - Barlow Condensed Bold (usada en títulos)
  {
    href: '@assets/fonts/barlowcondensed-bold-webfont.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
  },
]










