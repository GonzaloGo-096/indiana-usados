/**
 * vehicleMapper.js - Mapper: Transformación de datos backend → frontend
 * 
 * 🏗️ ARQUITECTURA DEL SISTEMA:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Backend API                                             │
 * │ → getAllPhotos (lista) / getOnePhoto (detalle)         │
 * └────────────────────┬──────────────────────────────────┘
 *                      │
 *                      ▼
 * ┌─────────────────────────────────────────────────────────┐
 * │ vehicleMapper.js (ESTE ARCHIVO)                        │
 * │ → Transforma datos backend a formato frontend         │
 * │ → USA imageExtractors.js (CAPA 1) para performance     │
 * └────────────────────┬──────────────────────────────────┘
 *                      │
 *                      ▼
 * ┌─────────────────────────────────────────────────────────┐
 * │ Componentes Frontend                                    │
 * │ → CardAuto, CardDetalle, ImageCarousel, Dashboard      │
 * └─────────────────────────────────────────────────────────┘
 * 
 * ✅ PROPÓSITO: Transformación de datos con optimización de performance
 * - Usa extractors (CAPA 1) para velocidad: ~2-3 ops/vehículo
 * - Passthrough completo: conserva todos los campos del backend
 * - Consistencia: mismo formato entre lista y detalle
 * 
 * 📋 RESPONSABILIDADES:
 * - Transformar página de vehículos (mapVehiclesPage)
 * - Transformar vehículo individual (mapVehicle)
 * - Extraer URLs de imágenes usando extractors (performance)
 * - Mantener compatibilidad con componentes existentes
 * 
 * 🔄 FLUJO DE USO:
 * 
 * LISTADO (/usados):
 * Backend.getAllPhotos() → mapVehiclesPage()
 *   ├─ extractVehicleImageUrls() → {principal, hover}
 *   ├─ extractAllImageUrls(v, {includeExtras: false})
 *   └─ Retorna: vehículos con fotoPrincipal, fotoHover (strings)
 *   ↓
 * AutosGrid → CardAuto → usa strings directamente
 * 
 * DETALLE (/vehiculo/:id):
 * Backend.getOnePhoto(id) → mapVehicle()
 *   ├─ extractVehicleImageUrls() → {principal, hover}
 *   ├─ extractAllImageUrls(v, {includeExtras: true})
 *   └─ Retorna: vehículo con fotoPrincipal, fotoHover, imágenes[] (strings)
 *   ↓
 * CardDetalle → ImageCarousel → usa strings directamente
 * 
 * 📍 DIFERENCIAS ENTRE LISTA Y DETALLE:
 * - Lista: includeExtras: false (backend no envía fotosExtra en getAllPhotos)
 * - Detalle: includeExtras: true (backend envía fotosExtra en getOnePhoto)
 * 
 * ⚠️ CUÁNDO NO USAR:
 * - Si necesitas objetos con public_id → usar imageNormalizerOptimized.js directamente
 * - Si necesitas normalizar para formularios → usar normalizeForForm.js
 * 
 * 🔗 DEPENDENCIAS:
 * - @utils/imageExtractors → extractVehicleImageUrls, extractAllImageUrls
 * - @utils/logger → logging de errores
 * 
 * 🔗 USADO POR:
 * - useVehiclesList → mapVehiclesPage() (lista pública)
 * - useVehicleDetail → mapVehicle() (detalle público)
 * - Dashboard.jsx → useVehiclesList() → mapVehiclesPage() (lista admin)
 * 
 * @author Indiana Usados
 * @version 7.1.0 - Documentación mejorada: orden arquitectónico y flujos
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
      
      // ✅ OPTIMIZADO: Lista solo tiene fotoPrincipal y fotoHover (backend no envía fotosExtra)
      // Extracción simple y directa - solo busca donde realmente está
      const { principal, hover } = extractVehicleImageUrls(v)
      const allImages = extractAllImageUrls(v, { includeExtras: false }) // No buscar extras en lista
      
      return {
        // ✅ Passthrough completo de todos los campos del backend
        ...v,
        
        // Identificación
        id: v._id || v.id || 0,
        
        // ✅ Imágenes como strings (compatibilidad con componentes existentes)
        fotoPrincipal: principal || '',
        fotoHover: hover || '',
        imagen: principal || '',  // Alias para compatibilidad
        imágenes: allImages,
        
        // Título compuesto (mantener por compatibilidad si se usa)
        title: v.marca && v.modelo 
          ? `${String(v.marca).trim()} ${String(v.modelo).trim()}` 
          : String(v.marca || v.modelo || '').trim(),
        
        // ✅ Raw data solo en desarrollo (debugging)
        ...(import.meta.env.DEV && { _original: v })
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
    // ✅ OPTIMIZADO: Detalle incluye fotoPrincipal, fotoHover y fotosExtra
    // Extracción específica - solo busca en campos que el backend realmente usa
    const { principal, hover } = extractVehicleImageUrls(backendVehicle)
    const allImages = extractAllImageUrls(backendVehicle, { includeExtras: true }) // Incluir extras en detalle
    
    return {
      // ✅ Passthrough completo: conservar todas las claves del backend
      ...backendVehicle,
      
      // Identificación
      id: backendVehicle._id || backendVehicle.id || 0,
      
      // ✅ Imágenes como strings (compatibilidad con componentes existentes)
      fotoPrincipal: principal || '',
      fotoHover: hover || '',
      imagen: principal || '',  // Alias para compatibilidad
      imágenes: allImages
    }
  } catch (error) {
    logger.error('mapper:vehicle', 'Error transformando vehículo', { error: error.message })
    return null
  }
}
