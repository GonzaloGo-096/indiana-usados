/**
 * api/sitemap.xml.js - Serverless function para generar sitemap dinámico
 * 
 * Vercel Serverless Function que genera sitemap.xml con vehículos reales
 * Accesible en: https://indiana.com.ar/sitemap.xml (solo producción)
 * 
 * Características:
 * - Genera sitemap dinámico con vehículos desde API
 * - Cachea resultado (recomendado por Google: actualizar cada 24h)
 * - Maneja errores gracefully
 * - SOLO genera sitemap en producción (preview/dev retornan 404)
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Solo producción genera sitemap
 */

// Detectar entorno
const getEnvironment = () => {
  // VERCEL_ENV tiene prioridad (disponible en Vercel)
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV.toLowerCase().trim()
  }
  // Fallback a VITE_ENVIRONMENT
  if (process.env.VITE_ENVIRONMENT) {
    return process.env.VITE_ENVIRONMENT.toLowerCase().trim()
  }
  // Por defecto, asumir development
  return 'development'
}

const ENVIRONMENT = getEnvironment()
const IS_PRODUCTION = ENVIRONMENT === 'production'

// Configuración (solo se usa en producción)
const SITE_URL = IS_PRODUCTION 
  ? (process.env.VITE_SITE_URL || 'https://indiana.com.ar')
  : 'https://indiana.com.ar'

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001'

// Cache simple en memoria (se resetea en cada cold start)
let cachedSitemap = null
let cacheTimestamp = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas en ms

/**
 * Genera fecha en formato ISO 8601 (YYYY-MM-DD)
 */
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0]
}

/**
 * Escapa caracteres especiales para XML
 */
const escapeXml = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Normaliza URL de imagen para sitemap (debe ser absoluta)
 * Versión inline para serverless function (no puede importar módulos ES6 fácilmente)
 */
const normalizeImageUrl = (imageUrl, siteUrl = SITE_URL) => {
  if (!imageUrl) return null
  
  // Si es objeto con URL, extraer la URL
  if (typeof imageUrl === 'object' && imageUrl?.url) {
    imageUrl = imageUrl.url
  }
  
  // Si ya es URL absoluta (http/https), usar directamente
  if (typeof imageUrl === 'string' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl
  }
  
  // Si es relativa, convertir a absoluta
  if (typeof imageUrl === 'string' && imageUrl.startsWith('/')) {
    return `${siteUrl}${imageUrl}`
  }
  
  // Si es string pero no empieza con /, asumir que es relativa
  if (typeof imageUrl === 'string') {
    return `${siteUrl}/${imageUrl}`
  }
  
  return null
}

/**
 * Valida que un vehículo tenga datos mínimos
 */
const isValidVehicle = (vehicle) => {
  if (!vehicle || typeof vehicle !== 'object') return false
  
  const id = vehicle.id || vehicle._id
  if (!id) return false
  
  const marca = vehicle.marca || ''
  const modelo = vehicle.modelo || ''
  
  return marca.trim() !== '' || modelo.trim() !== ''
}

/**
 * Genera entrada de URL para el sitemap
 */
const generateUrlEntry = (url, options = {}) => {
  const {
    lastmod = getCurrentDate(),
    changefreq = 'weekly',
    priority = '0.5',
    images = []
  } = options

  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`
  
  const parts = []
  parts.push(`  <url>`)
  parts.push(`    <loc>${escapeXml(fullUrl)}</loc>`)
  parts.push(`    <lastmod>${lastmod}</lastmod>`)
  parts.push(`    <changefreq>${changefreq}</changefreq>`)
  parts.push(`    <priority>${priority}</priority>`)
  
  // Agregar imágenes (máximo 5)
  const validImages = images
    .map(img => normalizeImageUrl(img, SITE_URL))
    .filter(Boolean)
    .slice(0, 5)
  
  validImages.forEach(imageUrl => {
    parts.push(`    <image:image>`)
    parts.push(`      <image:loc>${escapeXml(imageUrl)}</image:loc>`)
    parts.push(`    </image:image>`)
  })
  
  parts.push(`  </url>`)
  return parts.join('\n')
}

/**
 * Obtiene todos los vehículos paginando
 */
const fetchAllVehicles = async () => {
  const allVehicles = []
  let cursor = 1
  let hasMore = true
  const limitPerPage = 100
  const maxVehicles = 50000 // Límite de Google
  
  try {
    while (hasMore && allVehicles.length < maxVehicles) {
      const url = `${API_URL}/photos/getallphotos?limit=${limitPerPage}&cursor=${cursor}`
      
      // Crear AbortController para timeout manual
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        console.error(`Error fetching vehicles: ${response.status}`)
        break
      }
      
      const data = await response.json()
      
      // Extraer vehículos de la respuesta
      let vehicles = []
      if (data?.allPhotos?.docs) {
        vehicles = data.allPhotos.docs
        hasMore = data.allPhotos.hasNextPage || false
        cursor = data.allPhotos.nextPage || cursor + 1
      } else if (Array.isArray(data)) {
        vehicles = data
        hasMore = false
      } else {
        hasMore = false
      }
      
      if (vehicles.length === 0) {
        hasMore = false
        break
      }
      
      allVehicles.push(...vehicles)
      
      // Si recibimos menos vehículos que el límite, no hay más páginas
      if (vehicles.length < limitPerPage) {
        hasMore = false
      }
    }
  } catch (error) {
    console.error('Error obteniendo vehículos para sitemap:', error)
    // Retornar lo que se haya obtenido hasta ahora
  }
  
  return allVehicles
}

/**
 * Genera sitemap completo
 */
const generateSitemap = (vehicles = []) => {
  const currentDate = getCurrentDate()
  
  // Configuración de páginas estáticas
  const staticPages = {
    '/': { changefreq: 'daily', priority: '1.0' },
    '/vehiculos': { changefreq: 'daily', priority: '0.9' },
    '/nosotros': { changefreq: 'monthly', priority: '0.6' },
    '/postventa': { changefreq: 'monthly', priority: '0.8' }
  }
  
  // Validar y filtrar vehículos
  const validVehicles = Array.isArray(vehicles) 
    ? vehicles.filter(isValidVehicle).slice(0, 50000)
    : []
  
  const xmlParts = []
  
  // Header del XML
  xmlParts.push(`<?xml version="1.0" encoding="UTF-8"?>`)
  xmlParts.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`)
  xmlParts.push(`        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`)
  xmlParts.push(`        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`)
  xmlParts.push(`        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9`)
  xmlParts.push(`        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`)
  xmlParts.push('')
  
  // Páginas estáticas
  Object.entries(staticPages).forEach(([path, config]) => {
    xmlParts.push(generateUrlEntry(path, {
      lastmod: currentDate,
      changefreq: config.changefreq,
      priority: config.priority
    }))
    xmlParts.push('')
  })
  
  // Vehículos dinámicos
  validVehicles.forEach(vehicle => {
    const vehicleId = vehicle.id || vehicle._id
    if (!vehicleId) return
    
    const vehicleUrl = `/vehiculo/${vehicleId}`
    const vehicleImages = []
    
    // Agregar imagen principal
    if (vehicle.fotoPrincipal) {
      vehicleImages.push(vehicle.fotoPrincipal)
    }
    
    // Agregar imágenes extras (máximo 4 más)
    if (vehicle.fotosExtras && Array.isArray(vehicle.fotosExtras)) {
      const maxExtras = 5 - vehicleImages.length
      vehicle.fotosExtras.slice(0, maxExtras).forEach(img => {
        if (img) vehicleImages.push(img)
      })
    }
    
    // Fecha de actualización
    let lastmod = currentDate
    if (vehicle.updatedAt) {
      try {
        const updateDate = new Date(vehicle.updatedAt)
        if (!isNaN(updateDate.getTime())) {
          lastmod = updateDate.toISOString().split('T')[0]
        }
      } catch (e) {
        // Usar fecha actual si hay error
      }
    }
    
    xmlParts.push(generateUrlEntry(vehicleUrl, {
      lastmod,
      changefreq: 'weekly',
      priority: '0.8',
      images: vehicleImages
    }))
  })
  
  // Footer del XML
  xmlParts.push(`</urlset>`)
  
  return xmlParts.join('\n')
}

/**
 * Handler de Vercel Serverless Function
 */
export default async function handler(req, res) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  // POLÍTICA ESTRICTA: Solo generar sitemap en producción
  // Preview y development retornan 404 para evitar indexación incorrecta
  if (!IS_PRODUCTION) {
    return res.status(404).json({ 
      error: 'Sitemap not available',
      message: 'Sitemap is only generated in production environment'
    })
  }
  
  try {
    // Verificar cache (si existe y no está expirado)
    const now = Date.now()
    if (cachedSitemap && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      return res
        .status(200)
        .setHeader('Content-Type', 'application/xml')
        .setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200')
        .send(cachedSitemap)
    }
    
    // Obtener vehículos desde API
    const vehicles = await fetchAllVehicles()
    
    // Generar sitemap
    const sitemap = generateSitemap(vehicles)
    
    // Guardar en cache
    cachedSitemap = sitemap
    cacheTimestamp = now
    
    // Retornar sitemap
    return res
      .status(200)
      .setHeader('Content-Type', 'application/xml')
      .setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200')
      .send(sitemap)
      
  } catch (error) {
    console.error('Error generando sitemap:', error)
    
    // Retornar sitemap solo con páginas estáticas en caso de error
    const fallbackSitemap = generateSitemap([])
    
    return res
      .status(200) // 200 para que Google no marque error
      .setHeader('Content-Type', 'application/xml')
      .setHeader('Cache-Control', 'public, s-maxage=3600') // Cache más corto en error
      .send(fallbackSitemap)
  }
}

