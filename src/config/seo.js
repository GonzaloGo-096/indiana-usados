/**
 * config/seo.js - Configuración SEO centralizada
 * 
 * Centraliza toda la configuración SEO para evitar duplicación
 * y facilitar mantenimiento.
 * Soporta Vercel Preview Deployments.
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Soporte para Vercel Preview Deployments
 */

/**
 * Obtiene la URL del sitio según reglas de prioridad:
 * 1. VITE_SITE_URL (si existe)
 * 2. Si es preview: https://${VERCEL_URL} (serverless) o window.location.origin (browser)
 * 3. Si es development: window.location.origin (browser)
 * 4. Fallback solo para producción: https://indiana.com.ar
 */
const getSiteUrl = () => {
  // Guard: Verificar si estamos en Node.js/serverless
  const isNode = typeof process !== 'undefined' && process.env
  // Guard: Verificar si estamos en browser
  const isBrowser = typeof window !== 'undefined' && window.location
  
  // Prioridad 1: VITE_SITE_URL explícita
  // En Node.js (serverless functions)
  if (isNode && process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL
  }
  
  // En browser (Vite)
  if (import.meta?.env?.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL
  }
  
  // Prioridad 2: Detectar si es preview
  // En Node.js/serverless: usar VERCEL_ENV
  // En browser: usar VITE_ENVIRONMENT
  let isPreview = false
  if (isNode && process.env.VERCEL_ENV === 'preview') {
    isPreview = true
  } else if (import.meta?.env?.VITE_ENVIRONMENT?.toLowerCase() === 'preview') {
    isPreview = true
  }
  
  if (isPreview) {
    // En Node.js/serverless: usar VERCEL_URL
    if (isNode && process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
    // En browser: usar window.location.origin
    if (isBrowser) {
      return window.location.origin
    }
  }
  
  // Prioridad 3: Detectar si es development
  // En Node.js/serverless: usar VERCEL_ENV
  // En browser: usar VITE_ENVIRONMENT o asumir development si no hay nada configurado
  let isDevelopment = false
  if (isNode && process.env.VERCEL_ENV === 'development') {
    isDevelopment = true
  } else if (import.meta?.env?.VITE_ENVIRONMENT?.toLowerCase() === 'development') {
    isDevelopment = true
  } else if (!import.meta?.env?.VITE_ENVIRONMENT && isBrowser) {
    // Fallback: si no hay VITE_ENVIRONMENT configurado y estamos en browser, asumir development
    isDevelopment = true
  }
  
  if (isDevelopment && isBrowser) {
    return window.location.origin
  }
  
  // Prioridad 4: Fallback FINAL solo para producción
  // NO usar dominios hardcodeados fuera de producción
  return 'https://indiana.com.ar'
}

/**
 * Configuración SEO centralizada
 * 
 * Negocio: Indiana Peugeot - Concesionaria oficial Peugeot + autos usados multimarca
 * Ubicación: Tucumán, Argentina
 */
export const SEO_CONFIG = {
  siteName: 'Indiana Peugeot',
  siteUrl: getSiteUrl(),
  defaultTitle: 'Indiana Peugeot – Concesionaria Oficial en Tucumán | 0km y Usados',
  defaultDescription: 'Indiana Peugeot es concesionaria oficial Peugeot en Tucumán. Autos 0km Peugeot y amplia selección de vehículos usados multimarca con garantía, financiamiento y servicio postventa.',
  defaultKeywords: 'Indiana Peugeot, concesionaria Peugeot Tucumán, autos 0km Peugeot, autos usados Tucumán, concesionaria oficial Peugeot, vehículos usados con garantía',
  defaultImage: '/images/og-image.jpg',
  twitterHandle: '@indianapeugeot', // Actualizar si tienen cuenta de Twitter
  
  // Datos del negocio para Structured Data
  business: {
    name: 'Indiana Peugeot',
    legalName: 'Indiana Peugeot',
    address: {
      addressCountry: 'AR',
      addressLocality: 'Tucumán',
      addressRegion: 'Tucumán'
    },
    brand: 'Peugeot',
    type: 'AutomotiveBusiness'
  },
  
  // Configuración de páginas estáticas para sitemap
  staticPages: {
    '/': { changefreq: 'daily', priority: '1.0' },
    '/usados': { changefreq: 'daily', priority: '0.9' },
    '/0km': { changefreq: 'daily', priority: '0.9' },
    '/nosotros': { changefreq: 'monthly', priority: '0.6' },
    '/postventa': { changefreq: 'monthly', priority: '0.8' }
  },
  
  // Configuración para vehículos dinámicos
  vehicles: {
    changefreq: 'weekly',
    priority: '0.8'
  },
  
  // Límite máximo de vehículos por sitemap (Google recomienda max 50,000)
  maxVehiclesPerSitemap: 50000
}

/**
 * Notas de configuración:
 * 
 * 1. siteUrl: Se resuelve automáticamente según el entorno
 *    - Preview: Usa VERCEL_URL
 *    - Development: Usa window.location.origin
 *    - Production: Usa VITE_SITE_URL o fallback a https://indiana.com.ar
 * 2. defaultImage: Crear imagen OG de 1200x630px en /public/images/og-image.jpg
 * 3. twitterHandle: Actualizar si tienen cuenta de Twitter oficial
 */

export default SEO_CONFIG

