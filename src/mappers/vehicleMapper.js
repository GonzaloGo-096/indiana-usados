/**
 * Mappers para normalización de datos de vehículos
 * Convierte datos del backend a un modelo interno consistente
 * 
 * @author Indiana Usados
 * @version 2.0.0 - LIMPIEZA Y OPTIMIZACIÓN
 */

import { normalizeVehiclesPage } from '@api/vehicles.normalizer'
import { logger } from '@utils/logger'

/**
 * Mapea un vehículo individual del backend al modelo interno
 * @param {Object} apiVehicle - Vehículo tal como viene del backend
 * @returns {Object} - Vehículo normalizado
 */
export const mapApiVehicleToModel = (apiVehicle) => {
  if (!apiVehicle || typeof apiVehicle !== 'object') {
    console.warn('⚠️ Vehicle mapper: datos inválidos recibidos:', apiVehicle)
    return null
  }

  // ✅ DEBUG: Solo en desarrollo
  logger.log('MAPPER - Procesando vehículo:', {
    id: apiVehicle.id,
    brand: apiVehicle.brand,
    model: apiVehicle.model,
    year: apiVehicle.year,
    price: apiVehicle.price
  })

  try {
    // Normalizar campos básicos
    const normalized = {
      // Identificación
      id: Number(apiVehicle.id) || 0,
      
      // Información básica
      brand: String(apiVehicle.brand || '').trim(),
      model: String(apiVehicle.model || '').trim(),
      year: Number(apiVehicle.year || 0),
      
      // Características técnicas
      kilometers: Number(apiVehicle.kilometers || 0),
              caja: String(apiVehicle.caja || '').trim(),
      fuel: String(apiVehicle.fuel || '').trim(),
      
      // Precio y estado
      price: Number(apiVehicle.price || 0),
      condition: String(apiVehicle.condition || 'usado').trim(),
      
      // Imágenes
      imageUrl: String(apiVehicle.image || '').trim(),
      gallery: Array.isArray(apiVehicle.gallery) 
        ? apiVehicle.gallery.filter(Boolean)
        : [],
      
      // Información adicional
      description: String(apiVehicle.description || '').trim(),
      features: Array.isArray(apiVehicle.features)
        ? apiVehicle.features.filter(Boolean)
        : [],
      
      // Metadatos
      createdAt: apiVehicle.createdAt || new Date().toISOString(),
      updatedAt: apiVehicle.updatedAt || new Date().toISOString(),
      
      // Datos originales para debugging
      raw: apiVehicle
    }

    // Validar campos requeridos
    if (!normalized.brand || !normalized.model) {
      console.warn('⚠️ Vehicle mapper: campos requeridos faltantes:', { brand: normalized.brand, model: normalized.model })
      return null
    }

    // Generar campos derivados
    normalized.title = `${normalized.brand} ${normalized.model}`.trim()
    normalized.slug = `${normalized.brand}-${normalized.model}-${normalized.year}`.toLowerCase().replace(/\s+/g, '-')
    
    // Formatear precio
    normalized.priceFormatted = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(normalized.price)
    
    // Formatear kilómetros
    normalized.kilometersFormatted = new Intl.NumberFormat('es-AR').format(normalized.kilometers)
    
    // Formatear año
    normalized.yearFormatted = String(normalized.year)

    // ✅ DEBUG: Solo en desarrollo
    logger.log('MAPPER - Vehículo normalizado:', {
      id: normalized.id,
      brand: normalized.brand,
      model: normalized.model,
      year: normalized.year,
      price: normalized.price,
      title: normalized.title
    })

    return normalized
  } catch (error) {
    logger.error('Vehicle mapper: error procesando vehículo:', error, apiVehicle)
    return null
  }
}

/**
 * Mapea una respuesta de lista del backend al modelo interno
 * @param {Object} apiResponse - Respuesta del backend
 * @param {number} currentPage - Página actual
 * @returns {Object} - Respuesta normalizada
 */
export const mapListResponse = (apiResponse, currentCursor = null) => {
  try {
    // Usar el normalizador para procesar la respuesta
    const page = normalizeVehiclesPage(apiResponse)
    
    // ✅ OPTIMIZADO: Mapear una sola vez y reutilizar
    const mappedVehicles = (page.items || []).map(mapListVehicleToFrontend).filter(Boolean)

    return {
      vehicles: mappedVehicles,
      total: page.total || 0,
      hasNextPage: !!page.hasNextPage,
      nextPage: typeof page.next === 'number' ? page.next : null,
      // ✅ OPTIMIZADO: Reutilizar array mapeado
      data: mappedVehicles, // Mantener compatibilidad
      totalItems: page.total || 0, // Mantener compatibilidad
      currentCursor: currentCursor || undefined,
      totalPages: Math.ceil((page.total || 0) / 12)
    }
  } catch (error) {
    logger.error('Vehicle mapper: error procesando respuesta:', error, apiResponse)
    return { 
      vehicles: [], 
      data: [], 
      total: 0, 
      totalItems: 0,
      currentCursor: currentCursor || undefined, 
      hasNextPage: false, 
      nextPage: null, 
      totalPages: 0 
    }
  }
}

/**
 * Mapea una respuesta de detalle del backend al modelo interno
 * @param {Object} apiResponse - Respuesta del backend
 * @returns {Object} - Vehículo normalizado
 */
export const mapDetailResponse = (apiResponse) => {
  try {
    if (apiResponse && typeof apiResponse === 'object') {
      if (Array.isArray(apiResponse) && apiResponse.length > 0) {
        return mapApiVehicleToModel(apiResponse[0])
      } else if (apiResponse.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
        return mapApiVehicleToModel(apiResponse.data[0])
      } else if (apiResponse.id) {
        return mapApiVehicleToModel(apiResponse)
      }
    }
    return null
  } catch (error) {
    logger.error('Vehicle mapper: error procesando detalle:', error, apiResponse)
    return null
  }
}

/**
 * Mapea un vehículo del backend para listado optimizado (solo datos necesarios)
 * @param {Object} backendVehicle - Vehículo tal como viene del backend
 * @returns {Object} - Vehículo normalizado para listado
 */
export const mapListVehicleToFrontend = (backendVehicle) => {
  if (!backendVehicle || typeof backendVehicle !== 'object') {
    logger.warn('List mapper: datos inválidos recibidos:', backendVehicle)
    return null
  }

  try {
    // ✅ OPTIMIZADO: Extraer valores una sola vez
    const marca = String(backendVehicle.marca || '').trim()
    const modelo = String(backendVehicle.modelo || '').trim()
    
    const result = {
      // Identificación
      id: backendVehicle._id || backendVehicle.id || 0,
      
      // Información básica (solo campos necesarios para CardAuto)
      marca,
      modelo,
      precio: Number(backendVehicle.precio || 0),
      año: Number(backendVehicle.anio || 0),
      kilometraje: Number(backendVehicle.kilometraje || 0),
      caja: String(backendVehicle.caja || '').trim(),
      
      // ✅ OPTIMIZADO: Imágenes con fallback más eficiente
      fotoPrincipal: backendVehicle.fotoPrincipal?.url || backendVehicle.fotoPrincipal || '',
      fotoHover: backendVehicle.fotoHover?.url || backendVehicle.fotoHover || '',
      imagen: backendVehicle.fotoPrincipal?.url || backendVehicle.fotoPrincipal || '',
      
      // ✅ OPTIMIZADO: Solo crear array si es necesario
      imágenes: (() => {
        const images = []
        if (backendVehicle.fotoPrincipal?.url) images.push(backendVehicle.fotoPrincipal.url)
        if (backendVehicle.fotoHover?.url) images.push(backendVehicle.fotoHover.url)
        if (backendVehicle.fotosExtra?.length) {
          images.push(...backendVehicle.fotosExtra.map(img => img.url).filter(Boolean))
        }
        return images
      })(),
      
      // ✅ OPTIMIZADO: Reutilizar variables
      title: marca && modelo ? `${marca} ${modelo}` : marca || modelo || '',
      
      // ✅ OPTIMIZADO: Solo incluir raw en desarrollo
      ...(process.env.NODE_ENV === 'development' && { raw: backendVehicle })
    }
    
    return result
  } catch (error) {
    logger.error('List mapper: error procesando vehículo:', error, backendVehicle)
    return null
  }
}


/**
 * Valida que un vehículo tenga los campos requeridos
 * @param {Object} vehicle - Vehículo a validar
 * @returns {boolean} - True si es válido
 */
export const validateVehicle = (vehicle) => {
  return vehicle && 
         vehicle.id && 
         vehicle.marca && 
         vehicle.modelo && 
         vehicle.precio > 0
}
