/**
 * Mappers para normalización de datos de vehículos
 * Convierte datos del backend a un modelo interno consistente
 * 
 * @author Indiana Usados
 * @version 2.0.0 - LIMPIEZA Y OPTIMIZACIÓN
 */

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

  // ✅ DEBUG: Log del vehículo que se está procesando
  console.log('🔍 MAPPER DEBUG - Procesando vehículo:', {
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

    // ✅ DEBUG: Log del resultado del mapeo
    console.log('🔍 MAPPER DEBUG - Vehículo normalizado:', {
      id: normalized.id,
      brand: normalized.brand,
      model: normalized.model,
      year: normalized.year,
      price: normalized.price,
      title: normalized.title
    })

    return normalized
  } catch (error) {
    console.error('❌ Vehicle mapper: error procesando vehículo:', error, apiVehicle)
    return null
  }
}

/**
 * Mapea una respuesta de lista del backend al modelo interno
 * @param {Object} apiResponse - Respuesta del backend
 * @param {number} currentPage - Página actual
 * @returns {Object} - Respuesta normalizada
 */
export const mapListResponse = (apiResponse, currentPage = 1) => {
  try {
    console.log('🔍 MAPPER DEBUG - Respuesta recibida:', {
      hasData: Boolean(apiResponse?.data),
      dataType: Array.isArray(apiResponse?.data) ? 'array' : typeof apiResponse?.data,
      dataLength: Array.isArray(apiResponse?.data) ? apiResponse.data.length : 'N/A',
      total: apiResponse?.total,
      hasNextPage: apiResponse?.hasNextPage,
      nextPage: apiResponse?.nextPage
    })

    let vehicles = []
    let total = 0
    let hasNextPage = false
    let nextPage = null

    if (apiResponse && typeof apiResponse === 'object') {
      if (Array.isArray(apiResponse)) {
        vehicles = apiResponse
        total = vehicles.length
      } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
        vehicles = apiResponse.data
        total = Number(apiResponse.total) || vehicles.length
        hasNextPage = Boolean(apiResponse.hasNextPage)
        nextPage = apiResponse.nextPage || null
      }
    }

    // Normalizar cada vehículo
    const normalizedVehicles = vehicles
      .map(mapApiVehicleToModel)
      .filter(vehicle => vehicle !== null)

    console.log('🔍 MAPPER DEBUG - Resultado final:', {
      totalVehicles: vehicles.length,
      normalizedCount: normalizedVehicles.length,
      currentPage,
      hasNextPage,
      nextPage
    })

    return {
      vehicles: normalizedVehicles,
      data: normalizedVehicles, // Mantener compatibilidad
      total: normalizedVehicles.length,
      totalItems: normalizedVehicles.length,
      currentPage,
      hasNextPage,
      nextPage,
      totalPages: Math.ceil(normalizedVehicles.length / 12)
    }
  } catch (error) {
    console.error('❌ Vehicle mapper: error procesando respuesta:', error, apiResponse)
    return { data: [], total: 0, currentPage, hasNextPage: false, nextPage: null, totalPages: 0 }
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
    console.error('❌ Vehicle mapper: error procesando detalle:', error, apiResponse)
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
         vehicle.brand && 
         vehicle.model && 
         vehicle.price > 0
}

/**
 * Filtra vehículos según criterios específicos
 * @param {Array} vehicles - Lista de vehículos
 * @param {Object} filters - Criterios de filtrado
 * @returns {Array} - Vehículos filtrados
 */
export const filterVehicles = (vehicles, filters = {}) => {
  if (!Array.isArray(vehicles)) {
    console.warn('⚠️ Vehicle mapper: vehicles no es un array:', vehicles)
    return []
  }

  return vehicles.filter(vehicle => {
    // Filtro por marca
    if (filters.brand && !vehicle.brand?.toLowerCase().includes(filters.brand.toLowerCase())) {
      return false
    }
    
    // Filtro por modelo
    if (filters.model && !vehicle.model?.toLowerCase().includes(filters.model.toLowerCase())) {
      return false
    }
    
    // Filtro por precio
    if (filters.priceMin && vehicle.price < filters.priceMin) {
      return false
    }
    if (filters.priceMax && vehicle.price > filters.priceMax) {
      return false
    }
    
    // Filtro por año
    if (filters.yearMin && vehicle.year < filters.yearMin) {
      return false
    }
    if (filters.yearMax && vehicle.year > filters.yearMax) {
      return false
    }
    
    // Filtro por kilómetros
    if (filters.kilometersMin && vehicle.kilometers < filters.kilometersMin) {
      return false
    }
    if (filters.kilometersMax && vehicle.kilometers > filters.kilometersMax) {
      return false
    }
    
            // Filtro por caja
        if (filters.caja && vehicle.caja !== filters.caja) {
            return false
        }
    
    // Filtro por combustible
    if (filters.fuel && vehicle.fuel !== filters.fuel) {
      return false
    }
    
    // Filtro por color
    if (filters.color && vehicle.color !== filters.color) {
      return false
    }
    
    // Filtro general de búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const searchableFields = [
        vehicle.brand,
        vehicle.model,
        vehicle.description
      ].join(' ').toLowerCase()
      
      if (!searchableFields.includes(searchTerm)) {
        return false
      }
    }
    
    return true
  })
} 