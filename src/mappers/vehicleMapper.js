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
export const mapListResponse = (apiResponse, currentCursor = null) => {
  try {
    // ✅ DEBUG: Solo para vehículos sin imagen

    let vehicles = []
    let total = 0
    let hasNextPage = false
    let nextPage = null

    // ✅ DETECTAR SI ES RESPUESTA DEL BACKEND
    if (apiResponse?.allPhotos?.docs && Array.isArray(apiResponse.allPhotos.docs)) {
      // Respuesta del backend
      const backendData = apiResponse.allPhotos
      vehicles = backendData.docs
      total = Number(backendData.totalDocs) || vehicles.length
      hasNextPage = Boolean(backendData.hasNextPage)
      nextPage = backendData.nextPage || null
      
      // ✅ DEBUG: Solo para vehículos sin imagen
    } else if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      // Respuesta mock (mantener compatibilidad)
      vehicles = apiResponse.data
      total = Number(apiResponse.total) || vehicles.length
      hasNextPage = Boolean(apiResponse.hasNextPage)
      nextPage = apiResponse.nextPage || null
      
      // ✅ DEBUG: Solo para vehículos sin imagen
    } else if (Array.isArray(apiResponse)) {
      // Array directo
      vehicles = apiResponse
      total = vehicles.length
      hasNextPage = false
      nextPage = null
    }

    // Normalizar cada vehículo según el tipo de respuesta
    const normalizedVehicles = vehicles
      .map(vehicle => {
        // Si es respuesta del backend, usar mapeo específico
        if (apiResponse?.allPhotos?.docs) {
          return mapListVehicleToFrontend(vehicle) // ✅ NUEVO: Usar mapper optimizado para listado
        }
        // Si es mock, usar mapeo existente
        return mapApiVehicleToModel(vehicle)
      })
      .filter(vehicle => vehicle !== null)

    // ✅ DEBUG: Solo para vehículos sin imagen

    return {
      vehicles: normalizedVehicles,
      data: normalizedVehicles, // Mantener compatibilidad
      total: normalizedVehicles.length,
      totalItems: normalizedVehicles.length,
      currentCursor,
      hasNextPage,
      nextPage,
      totalPages: Math.ceil(normalizedVehicles.length / 12)
    }
  } catch (error) {
    console.error('❌ Vehicle mapper: error procesando respuesta:', error, apiResponse)
    return { data: [], total: 0, currentCursor, hasNextPage: false, nextPage: null, totalPages: 0 }
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
 * Mapea un vehículo del backend para listado optimizado (solo datos necesarios)
 * @param {Object} backendVehicle - Vehículo tal como viene del backend
 * @returns {Object} - Vehículo normalizado para listado
 */
export const mapListVehicleToFrontend = (backendVehicle) => {
  if (!backendVehicle || typeof backendVehicle !== 'object') {
    console.warn('⚠️ List mapper: datos inválidos recibidos:', backendVehicle)
    return null
  }

  try {
    const result = {
      // Identificación
      id: backendVehicle._id || backendVehicle.id || 0,
      
      // Información básica (solo campos necesarios para CardAuto)
      marca: String(backendVehicle.marca || '').trim(),
      modelo: String(backendVehicle.modelo || '').trim(),
      precio: Number(backendVehicle.precio || 0),
      año: Number(backendVehicle.anio || 0),
      kilometraje: Number(backendVehicle.kilometraje || 0),
      
      // ✅ IMÁGENES: Nueva estructura (objetos con .url)
      imágenes: [
        backendVehicle.fotoPrincipal?.url,
        backendVehicle.fotoHover?.url,
        ...(backendVehicle.fotosExtra?.map(img => img.url) || [])
      ].filter(Boolean),
      
      // ✅ CAMPOS INDIVIDUALES: Nueva estructura
      fotoPrincipal: backendVehicle.fotoPrincipal?.url || '',
      fotoHover: backendVehicle.fotoHover?.url || '',
      imagen: backendVehicle.fotoPrincipal?.url || '',
      
      
      // Campos derivados
      title: `${backendVehicle.marca} ${backendVehicle.modelo}`.trim(),
      
      // Datos originales para debugging
      raw: backendVehicle
    }
    
    
    return result
  } catch (error) {
    console.error('❌ List mapper: error procesando vehículo:', error, backendVehicle)
    return null
  }
}

/**
 * Mapea un vehículo del backend al modelo interno del frontend
 * @param {Object} backendVehicle - Vehículo tal como viene del backend
 * @returns {Object} - Vehículo normalizado para el frontend
 */
export const mapBackendVehicleToFrontend = (backendVehicle) => {
  if (!backendVehicle || typeof backendVehicle !== 'object') {
    console.warn('⚠️ Backend mapper: datos inválidos recibidos:', backendVehicle)
    return null
  }

  try {
    // Mapeo de campos principales
    const normalized = {
      // Identificación
      id: backendVehicle._id || backendVehicle.id || 0,
      
      // Información básica (mapeo directo)
      marca: String(backendVehicle.marca || '').trim(),
      modelo: String(backendVehicle.modelo || '').trim(),
      version: String(backendVehicle.version || '').trim(),
      anio: Number(backendVehicle.anio || 0),
      
      // Características técnicas
      kilometraje: Number(backendVehicle.kilometraje || 0),
      caja: String(backendVehicle.caja || '').trim(),
      combustible: String(backendVehicle.combustible || '').trim(),
      transmision: String(backendVehicle.transmision || '').trim(),
      cilindrada: Number(backendVehicle.cilindrada || 0),
      color: String(backendVehicle.color || '').trim(),
      
      // Precio y estado
      precio: Number(backendVehicle.precio || 0),
      segmento: String(backendVehicle.segmento || '').trim(),
      
      // Características adicionales
      traccion: String(backendVehicle.traccion || '').trim(),
      tapizado: String(backendVehicle.tapizado || '').trim(),
      categoriaVehiculo: String(backendVehicle.categoriaVehiculo || '').trim(),
      frenos: String(backendVehicle.frenos || '').trim(),
      turbo: String(backendVehicle.turbo || '').trim(),
      llantas: String(backendVehicle.llantas || '').trim(),
      HP: String(backendVehicle.HP || '').trim(),
      detalle: String(backendVehicle.detalle || '').trim(),
      
      // ✅ NUEVAS IMÁGENES (estructura del backend actualizada) CON FALLBACKS
      fotoPrincipal: backendVehicle.fotoPrincipal?.url || 
                    backendVehicle.fotoFrontal?.url || 
                    backendVehicle.imagen || 
                    '',
      fotoHover: backendVehicle.fotoHover?.url || 
                 backendVehicle.fotoTrasera?.url || 
                 backendVehicle.fotoLateralDerecha?.url || 
                 backendVehicle.fotoLateralIzquierda?.url || 
                 '',
      fotosExtra: backendVehicle.fotosExtra?.map(img => img.url) || [],
      
      // ✅ COMPATIBILIDAD: Imágenes individuales (estructura antigua)
      fotoFrontal: backendVehicle.fotoFrontal || null,
      fotoTrasera: backendVehicle.fotoTrasera || null,
      fotoLateralIzquierda: backendVehicle.fotoLateralIzquierda || null,
      fotoLateralDerecha: backendVehicle.fotoLateralDerecha || null,
      fotoInterior: backendVehicle.fotoInterior || null,
      
      // ✅ COMPATIBILIDAD: Imágenes para frontend actual CON FALLBACKS MEJORADOS
      imagen: backendVehicle.fotoPrincipal?.url || 
              backendVehicle.fotoFrontal?.url || 
              backendVehicle.imagen || 
              '',
      gallery: [
        backendVehicle.fotoPrincipal?.url,
        backendVehicle.fotoHover?.url,
        ...(backendVehicle.fotosExtra?.map(img => img.url) || []),
        // Fallbacks para estructura antigua
        backendVehicle.fotoFrontal?.url,
        backendVehicle.fotoTrasera?.url,
        backendVehicle.fotoLateralIzquierda?.url,
        backendVehicle.fotoLateralDerecha?.url,
        backendVehicle.fotoInterior?.url
      ].filter(Boolean),
      
      // Campos derivados
      title: `${backendVehicle.marca} ${backendVehicle.modelo}`.trim(),
      slug: `${backendVehicle.marca}-${backendVehicle.modelo}-${backendVehicle.anio}`.toLowerCase().replace(/\s+/g, '-'),
      
      // Metadatos
      createdAt: backendVehicle.createdAt || new Date().toISOString(),
      updatedAt: backendVehicle.updatedAt || new Date().toISOString(),
      
      // Datos originales para debugging
      raw: backendVehicle
    }

    // Validar campos requeridos
    if (!normalized.marca || !normalized.modelo) {
      console.warn('⚠️ Backend mapper: campos requeridos faltantes:', { 
        marca: normalized.marca, 
        modelo: normalized.modelo 
      })
      return null
    }

    return normalized
  } catch (error) {
    console.error('❌ Backend mapper: error procesando vehículo:', error, backendVehicle)
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