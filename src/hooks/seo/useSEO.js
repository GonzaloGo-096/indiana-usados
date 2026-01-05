/**
 * useSEO.js - Hook para manejo dinámico de meta tags SEO
 * 
 * Características:
 * - Actualiza title, description, keywords dinámicamente
 * - Soporta Open Graph y Twitter Cards
 * - Maneja canonical URLs
 * - Limpia tags al desmontar
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import { useEffect } from 'react'
import { SEO_CONFIG } from '@config/seo'
import { normalizeImageUrlSync } from '@utils/seo/normalizeImageUrl'

/**
 * Configuración SEO por defecto (usando configuración centralizada)
 */
const DEFAULT_SEO = {
  siteName: SEO_CONFIG.siteName,
  siteUrl: SEO_CONFIG.siteUrl,
  defaultTitle: SEO_CONFIG.defaultTitle,
  defaultDescription: SEO_CONFIG.defaultDescription,
  defaultKeywords: SEO_CONFIG.defaultKeywords,
  defaultImage: SEO_CONFIG.defaultImage,
  twitterHandle: SEO_CONFIG.twitterHandle
}

/**
 * Formatea precio para mostrar en meta tags
 */
const formatPrice = (price) => {
  if (!price) return ''
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

/**
 * Genera título completo con formato estándar
 */
const generateTitle = (title, siteName = DEFAULT_SEO.siteName) => {
  if (!title) return DEFAULT_SEO.defaultTitle
  return `${title} | ${siteName}`
}

/**
 * Genera URL completa (canonical)
 */
const generateUrl = (path, siteUrl = DEFAULT_SEO.siteUrl) => {
  if (!path) return siteUrl
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${cleanPath}`
}

/**
 * Normaliza URL de imagen para SEO (Open Graph requiere URLs absolutas)
 * Usa función compartida normalizeImageUrlSync
 * 
 * @param {string|Object} image - URL de imagen (string o objeto con url)
 * @param {string} siteUrl - URL base del sitio
 * @returns {string} URL absoluta de la imagen
 */
const normalizeImageUrl = (image, siteUrl = DEFAULT_SEO.siteUrl) => {
  if (!image) return `${siteUrl}${DEFAULT_SEO.defaultImage}`
  
  const normalized = normalizeImageUrlSync(image, siteUrl)
  return normalized || `${siteUrl}${DEFAULT_SEO.defaultImage}`
}

/**
 * Valida y trunca description para meta tags (máx 160 caracteres)
 * 
 * @param {string} description - Descripción original
 * @param {number} maxLength - Longitud máxima (default: 160)
 * @returns {string} Descripción validada y truncada si es necesario
 */
const validateDescription = (description, maxLength = 160) => {
  if (!description) return DEFAULT_SEO.defaultDescription
  if (description.length <= maxLength) return description
  return description.substring(0, maxLength - 3) + '...'
}

/**
 * Valida y trunca title para meta tags (máx 60 caracteres)
 * 
 * @param {string} title - Título original
 * @param {number} maxLength - Longitud máxima (default: 60)
 * @returns {string} Título validado y truncado si es necesario
 */
const validateTitle = (title, maxLength = 60) => {
  if (!title) return DEFAULT_SEO.defaultTitle
  if (title.length <= maxLength) return title
  return title.substring(0, maxLength - 3) + '...'
}

/**
 * Hook para manejo de SEO
 * 
 * @param {Object} seoConfig - Configuración SEO
 * @param {string} seoConfig.title - Título de la página
 * @param {string} seoConfig.description - Descripción meta
 * @param {string} seoConfig.keywords - Keywords (opcional)
 * @param {string} seoConfig.image - Imagen OG (opcional)
 * @param {string} seoConfig.url - URL canónica (opcional)
 * @param {string} seoConfig.type - Tipo OG (website, product, article, etc.)
 * @param {boolean} seoConfig.noindex - Si debe tener noindex (default: false)
 */
export const useSEO = (seoConfig = {}) => {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    noindex = false
  } = seoConfig

  useEffect(() => {
    const head = document.head
    const siteUrl = DEFAULT_SEO.siteUrl

    // Helper para crear o actualizar meta tag
    const setMetaTag = (name, content, attribute = 'name') => {
      if (!content) return

      let element = head.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Helper para crear o actualizar link tag
    const setLinkTag = (rel, href) => {
      if (!href) return

      let element = head.querySelector(`link[rel="${rel}"]`)
      if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        head.appendChild(element)
      }
      element.setAttribute('href', href)
    }

    // Verificar que estamos en el navegador (SSR safety)
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    // 1. Title (validado y truncado)
    const fullTitle = validateTitle(generateTitle(title))
    document.title = fullTitle

    // 2. Meta Tags Básicos (description validada)
    const validDescription = validateDescription(description || DEFAULT_SEO.defaultDescription)
    setMetaTag('description', validDescription)
    if (keywords) {
      setMetaTag('keywords', keywords)
    }
    
    // Robots meta tag
    if (noindex) {
      setMetaTag('robots', 'noindex, nofollow')
    } else {
      setMetaTag('robots', 'index, follow')
    }

    // 3. Canonical URL
    const canonicalUrl = url ? generateUrl(url) : window.location.href.split('?')[0]
    setLinkTag('canonical', canonicalUrl)

    // 4. Open Graph Tags (imagen normalizada a URL absoluta)
    const ogImage = normalizeImageUrl(image, siteUrl)
    setMetaTag('og:title', fullTitle, 'property')
    setMetaTag('og:description', validDescription, 'property')
    setMetaTag('og:image', ogImage, 'property')
    setMetaTag('og:url', canonicalUrl, 'property')
    setMetaTag('og:type', type, 'property')
    setMetaTag('og:locale', 'es_AR', 'property')
    setMetaTag('og:site_name', DEFAULT_SEO.siteName, 'property')

    // 5. Twitter Cards
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', fullTitle)
    setMetaTag('twitter:description', validDescription)
    setMetaTag('twitter:image', ogImage)
    if (DEFAULT_SEO.twitterHandle) {
      setMetaTag('twitter:site', DEFAULT_SEO.twitterHandle)
    }

    // Cleanup: No necesitamos limpiar porque los meta tags se actualizan, no se acumulan
    // (cada página reemplaza los anteriores)
  }, [title, description, keywords, image, url, type, noindex])
}

/**
 * Hook específico para páginas de vehículos (detalle)
 * 
 * @param {Object} vehicle - Datos del vehículo
 */
export const useVehicleSEO = (vehicle) => {
  if (!vehicle) {
    return useSEO({
      title: 'Vehículo no encontrado',
      description: 'El vehículo que buscas no está disponible.',
      noindex: true
    })
  }

  // Extraer datos con valores por defecto seguros
  const marca = vehicle.marca || ''
  const modelo = vehicle.modelo || ''
  const anio = vehicle.anio || ''
  const precio = vehicle.precio || 0
  const kilometraje = vehicle.kilometraje || null
  const transmision = vehicle.transmision || null
  const combustible = vehicle.combustible || null
  const fotoPrincipal = vehicle.fotoPrincipal || null

  // Validar que al menos tenga marca y modelo
  if (!marca || !modelo) {
    return useSEO({
      title: 'Vehículo',
      description: 'Información del vehículo no disponible completamente.',
      noindex: true
    })
  }

  // Generar título (filtrar valores vacíos)
  const vehicleTitleParts = [marca, modelo, anio].filter(Boolean)
  const vehicleTitle = vehicleTitleParts.length > 0 ? vehicleTitleParts.join(' ') : 'Vehículo'
  const priceFormatted = formatPrice(precio)
  const title = priceFormatted ? `${vehicleTitle} - ${priceFormatted}` : vehicleTitle

  // Generar description con validación
  const kmText = kilometraje ? `${kilometraje.toLocaleString('es-AR')} km` : 'kilometraje no especificado'
  const transmissionText = transmision || 'transmisión no especificada'
  const fuelText = combustible || 'combustible no especificado'
  const description = `${vehicleTitle} usado en venta. ${kmText}, ${transmissionText}, ${fuelText}.${priceFormatted ? ` Precio: ${priceFormatted}.` : ''} Ver fotos y características completas.`

  // URL de imagen (normalizada)
  const imageUrl = fotoPrincipal || null

  // URL canónica (usar ID por ahora, luego cambiar a slug)
  const vehicleId = vehicle.id || vehicle._id
  const vehicleUrl = vehicleId ? `/vehiculo/${vehicleId}` : '/usados'

  // Keywords dinámicos
  const keywords = [
    `${marca} ${modelo} usado`,
    `comprar ${marca} ${modelo} usado`,
    anio ? `${marca} ${modelo} ${anio} precio` : null
  ].filter(Boolean).join(', ')

  return useSEO({
    title,
    description,
    keywords,
    image: imageUrl,
    url: vehicleUrl,
    type: 'product'
  })
}

/**
 * Hook específico para listado de vehículos
 * 
 * @param {number} vehicleCount - Cantidad de vehículos disponibles
 */
export const useVehiclesListSEO = (vehicleCount = 0) => {
  const title = 'Catálogo de Autos Usados'
  const description = vehicleCount > 0
    ? `Explorá nuestro catálogo completo de autos usados. Más de ${vehicleCount} vehículos disponibles con garantía. Filtrá por marca, modelo, precio y más.`
    : 'Explorá nuestro catálogo completo de autos usados. Amplia selección de vehículos usados con garantía. Filtrá por marca, modelo, precio y más.'

  return useSEO({
    title,
    description,
    keywords: 'catálogo autos usados, vehículos usados disponibles, comprar auto usado, autos usados con garantía',
    url: '/usados',
    type: 'website'
  })
}

export default useSEO

