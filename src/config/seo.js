/**
 * config/seo.js - Configuración SEO centralizada
 * 
 * Centraliza toda la configuración SEO para evitar duplicación
 * y facilitar mantenimiento.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Obtiene la URL del sitio desde variables de entorno o usa valor por defecto
 */
const getSiteUrl = () => {
  // En Node.js (serverless functions), usar process.env
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_SITE_URL) {
      return process.env.VITE_SITE_URL
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
  }
  
  // En browser (Vite), usar import.meta.env
  // import.meta siempre está disponible en módulos ES6 de Vite
  try {
    if (import.meta?.env?.VITE_SITE_URL) {
      return import.meta.env.VITE_SITE_URL
    }
  } catch (e) {
    // Si no está disponible, continuar con valor por defecto
  }
  
  // Valor por defecto (debe actualizarse en producción)
  return 'https://indianausados.com'
}

/**
 * Configuración SEO centralizada
 */
export const SEO_CONFIG = {
  siteName: 'Indiana Usados',
  siteUrl: getSiteUrl(),
  defaultTitle: 'Indiana Usados - Autos Usados con Garantía en Argentina',
  defaultDescription: 'Indiana Usados es una concesionaria de autos usados en Argentina. Amplia selección de vehículos usados con garantía, financiamiento y servicio postventa profesional.',
  defaultKeywords: 'autos usados, concesionaria, vehículos usados, autos usados Argentina, comprar auto usado, garantía autos usados',
  defaultImage: '/images/og-image.jpg',
  twitterHandle: '@indianausados', // Actualizar si tienen cuenta de Twitter
  
  // Configuración de páginas estáticas para sitemap
  staticPages: {
    '/': { changefreq: 'daily', priority: '1.0' },
    '/vehiculos': { changefreq: 'daily', priority: '0.9' },
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
 * 1. siteUrl: Actualizar en producción con variable de entorno VITE_SITE_URL
 * 2. defaultImage: Crear imagen OG de 1200x630px en /public/images/og-image.jpg
 * 3. twitterHandle: Actualizar si tienen cuenta de Twitter oficial
 */

export default SEO_CONFIG

