/**
 * vehicleMapper.js - Transformación de datos de vehículos
 * 
 * Transforma respuestas del backend a modelo frontend consistente
 * 
 * ✅ REFACTORIZADO v5.0.0: Simplificación radical
 * - Eliminado normalizeVehiclesPage duplicado
 * - Todo en una función simple y directa
 * - Sin archivos intermedios innecesarios
 * 
 * @author Indiana Usados
 * @version 5.0.0 - Mapper simple y directo
 */

import { logger } from '@utils/logger'
import { extractVehicleImageUrls, extractAllImageUrls } from '@utils/imageExtractors'

/**
 * Transforma una página de vehículos del backend al formato frontend
 * 
 * Estructura backend esperada:
 * {
 *   allPhotos: {
 *     docs: [{ _id, marca, modelo, precio, anio, ... }],
 *     totalDocs: number,
 *     hasNextPage: boolean,
 *     nextPage: number
 *   }
 * }
 * 
 * @param {Object} backendPage - Página cruda del backend
 * @param {number} currentCursor - Cursor actual (opcional)
 * @returns {Object} Página transformada: { vehicles, total, hasNextPage, nextPage }
 */
export const mapVehiclesPage = (backendPage, currentCursor = null) => {
  try {
    // ✅ Extraer estructura de paginación del backend (conocemos el formato)
    const { docs = [], totalDocs = 0, hasNextPage = false, nextPage } = backendPage?.allPhotos || {}
    
    // ✅ Mapear cada vehículo a formato frontend
    const vehicles = docs.map(v => {
      if (!v || typeof v !== 'object') return null
      
      // Extraer imágenes usando helpers centralizados
      const { principal, hover } = extractVehicleImageUrls(v)
      const allImages = extractAllImageUrls(v)
      
      return {
        // Identificación
        id: v._id || v.id || 0,
        
        // Información básica
        marca: String(v.marca || '').trim(),
        modelo: String(v.modelo || '').trim(),
        version: String(v.version || '').trim(),
        precio: Number(v.precio || 0),
        año: Number(v.anio || 0),
        kilometraje: Number(v.kilometraje || 0),
        caja: String(v.caja || '').trim(),
        cilindrada: Number(v.cilindrada || 0),
        
        // Imágenes (usando extractors centralizados)
        fotoPrincipal: principal || '',
        fotoHover: hover || '',
        imagen: principal || '',
        imágenes: allImages,
        
        // Título compuesto
        title: v.marca && v.modelo 
          ? `${String(v.marca).trim()} ${String(v.modelo).trim()}` 
          : String(v.marca || v.modelo || '').trim(),
        
        // ✅ Raw data solo en desarrollo (debugging)
        ...(process.env.NODE_ENV === 'development' && { _original: v })
      }
    }).filter(Boolean)
    
    return {
      vehicles,
      total: totalDocs || 0,
      hasNextPage: Boolean(hasNextPage),
      nextPage: nextPage || null,
      currentCursor: currentCursor || undefined,
      totalPages: Math.ceil((totalDocs || 0) / 12)
    }
  } catch (error) {
    logger.error('mapper:vehicles', 'Error transformando página de vehículos', { 
      error: error.message,
      page: backendPage 
    })
    
    // ✅ Fallback seguro en caso de error
    return {
      vehicles: [],
      total: 0,
      hasNextPage: false,
      nextPage: null,
      currentCursor: currentCursor || undefined,
      totalPages: 0
    }
  }
}

/**
 * Transforma un vehículo individual del backend
 * Útil para casos donde solo necesitas mapear 1 vehículo
 * 
 * @param {Object} backendVehicle - Vehículo del backend
 * @returns {Object|null} Vehículo transformado o null si es inválido
 */
export const mapVehicle = (backendVehicle) => {
  if (!backendVehicle || typeof backendVehicle !== 'object') {
    return null
  }
  
  try {
    const { principal, hover } = extractVehicleImageUrls(backendVehicle)
    const allImages = extractAllImageUrls(backendVehicle)
    
    return {
      id: backendVehicle._id || backendVehicle.id || 0,
      marca: String(backendVehicle.marca || '').trim(),
      modelo: String(backendVehicle.modelo || '').trim(),
      version: String(backendVehicle.version || '').trim(),
      precio: Number(backendVehicle.precio || 0),
      año: Number(backendVehicle.anio || 0),
      kilometraje: Number(backendVehicle.kilometraje || 0),
      caja: String(backendVehicle.caja || '').trim(),
      cilindrada: Number(backendVehicle.cilindrada || 0),
      fotoPrincipal: principal || '',
      fotoHover: hover || '',
      imagen: principal || '',
      imágenes: allImages,
      title: backendVehicle.marca && backendVehicle.modelo 
        ? `${String(backendVehicle.marca).trim()} ${String(backendVehicle.modelo).trim()}` 
        : String(backendVehicle.marca || backendVehicle.modelo || '').trim(),
      ...(process.env.NODE_ENV === 'development' && { _original: backendVehicle })
    }
  } catch (error) {
    logger.error('mapper:vehicle', 'Error transformando vehículo', { error: error.message })
    return null
  }
}
