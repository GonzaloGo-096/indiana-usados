/**
 * imageNormalizerOptimized.js - CAPA 2: Normalización completa de imágenes
 * 
 * 🏗️ ARQUITECTURA DEL SISTEMA:
 * ┌─────────────────────────────────────────────────────────┐
 * │ CAPA 1: imageExtractors.js                             │
 * │ → Extracción rápida: URLs como strings                 │
 * │ → Performance: ~2-3 operaciones/vehículo               │
 * └─────────────────────────────────────────────────────────┘
 *                          ↓ Usa cuando necesita objetos
 * ┌─────────────────────────────────────────────────────────┐
 * │ CAPA 2: imageNormalizerOptimized.js (ESTE ARCHIVO)     │
 * │ → Normalización completa: {url, public_id, original_name}│
 * │ → Performance: ~15-20 operaciones/vehículo            │
 * │ → Uso: Formularios admin, casos que necesitan public_id│
 * └─────────────────────────────────────────────────────────┘
 *                          ↓ Usa para procesamiento avanzado
 * ┌─────────────────────────────────────────────────────────┐
 * │ CAPA 3: imageUtils.js                                  │
 * │ → Procesamiento avanzado para carruseles                │
 * └─────────────────────────────────────────────────────────┘
 * 
 * ✅ PROPÓSITO: Normalización completa a formato estándar
 * - Convierte cualquier formato a: {url, public_id, original_name}
 * - Busca solo en campos que el backend realmente envía
 * - Optimizado: NO busca en campos legacy inexistentes
 * 
 * 📋 RESPONSABILIDADES:
 * - Normalizar campos individuales de imagen (objetos, strings, null)
 * - Normalizar todas las imágenes de un vehículo (fotoPrincipal, fotoHover, fotosExtra)
 * - Convertir formato normalizado a formato de formulario admin
 * 
 * 🔄 FLUJO DE USO:
 * Backend → normalizeDetailToFormInitialData() → imageNormalizerOptimized.js
 *   - getOnePhoto → normalizeForForm → normalizeVehicleImages() + toFormFormat()
 * 
 * 📍 USO POR PÁGINA:
 * - /admin/dashboard (Editar vehículo): normalizeVehicleImages() + toFormFormat()
 * - imageUtils.js (getCarouselImages): normalizeVehicleImages()
 * - normalizeForForm.js: normalizeVehicleImages() + toFormFormat()
 * 
 * ⚠️ OPTIMIZACIÓN:
 * - Solo busca en: fotoPrincipal, fotoHover, fotosExtra (campos reales del backend)
 * - NO busca en: fotosExtras, gallery, imagenes, imágenes, images, photos (legacy)
 * - Para casos simples (solo URLs): usar imageExtractors.js (más rápido)
 * 
 * 🔗 DEPENDENCIAS:
 * - Ninguna (función pura)
 * 
 * 🔗 USADO POR:
 * - normalizeForForm.js → normalizeDetailToFormInitialData()
 * - imageUtils.js → getCarouselImages()
 * - Dashboard.jsx → extractImageUrls() (helper interno)
 * 
 * @author Indiana Usados
 * @version 1.1.0 - Documentación mejorada: orden arquitectónico y flujos
 */

/**
 * Normaliza un campo de imagen a formato estándar
 * Maneja el formato que el backend SIEMPRE envía: { url, original_name, public_id }
 * 
 * @param {Object|string|null} imageField - Campo de imagen del backend
 * @returns {Object|null} { url, public_id, original_name } o null
 */
export const normalizeImageField = (imageField) => {
  if (!imageField) return null
  
  // Caso 1: String directo (URL)
  if (typeof imageField === 'string') {
    const trimmed = imageField.trim()
    return trimmed === '' || trimmed === 'undefined' ? null : {
      url: trimmed,
      public_id: '',
      original_name: ''
    }
  }
  
  // Caso 2: Objeto del backend (formato estándar)
  if (typeof imageField === 'object' && !Array.isArray(imageField)) {
    const url = String(imageField.url || '').trim()
    if (!url || url === 'undefined') return null
    
    return {
      url,
      public_id: String(imageField.public_id || '').trim(),
      original_name: String(imageField.original_name || '').trim()
    }
  }
  
  return null
}

/**
 * Normaliza imágenes de un vehículo (OPTIMIZADO)
 * Solo busca en campos que el backend realmente envía:
 * - fotoPrincipal, fotoHover, fotosExtra (NO busca en otros 6 campos)
 * 
 * @param {Object} vehicle - Objeto vehículo del backend
 * @returns {Object} { fotoPrincipal, fotoHover, fotosExtra[] }
 */
export const normalizeVehicleImages = (vehicle) => {
  if (!vehicle || typeof vehicle !== 'object' || Array.isArray(vehicle)) {
    return {
      fotoPrincipal: null,
      fotoHover: null,
      fotosExtra: []
    }
  }
  
  // ✅ OPTIMIZADO: Solo normalizar campos que el backend SIEMPRE envía
  const fotoPrincipal = normalizeImageField(vehicle.fotoPrincipal) ||
                        normalizeImageField(vehicle.imagen) ||
                        null
  
  const fotoHover = normalizeImageField(vehicle.fotoHover) || null
  
  // ✅ OPTIMIZADO: Solo buscar en fotosExtra (backend siempre usa este nombre)
  const fotosExtra = []
  const seenUrls = new Set()
  
  if (Array.isArray(vehicle.fotosExtra)) {
    vehicle.fotosExtra.forEach(img => {
      const normalized = normalizeImageField(img)
      if (normalized && !seenUrls.has(normalized.url)) {
        seenUrls.add(normalized.url)
        fotosExtra.push(normalized)
      }
    })
  }
  
  return {
    fotoPrincipal,
    fotoHover,
    fotosExtra
  }
}

/**
 * Convierte imágenes normalizadas a formato de formulario admin
 * Compatible con useImageReducer y CarFormRHF
 * 
 * @param {Object} normalizedImages - Objeto de normalizeVehicleImages()
 * @returns {Object} { fotoPrincipal, fotoHover, fotoExtra1 ... fotoExtra8 }
 */
export const toFormFormat = (normalizedImages) => {
  const { fotoPrincipal, fotoHover, fotosExtra } = normalizedImages
  
  return {
    fotoPrincipal: fotoPrincipal || null,
    fotoHover: fotoHover || null,
    fotoExtra1: fotosExtra[0] || null,
    fotoExtra2: fotosExtra[1] || null,
    fotoExtra3: fotosExtra[2] || null,
    fotoExtra4: fotosExtra[3] || null,
    fotoExtra5: fotosExtra[4] || null,
    fotoExtra6: fotosExtra[5] || null,
    fotoExtra7: fotosExtra[6] || null,
    fotoExtra8: fotosExtra[7] || null
  }
}

