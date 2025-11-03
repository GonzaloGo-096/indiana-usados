/**
 * normalizeForForm.js - Normaliza detalle de vehículo a initialData del CarFormRHF
 * 
 * ✅ OPTIMIZADO v2.0.0: Usa normalizador optimizado (imageNormalizerOptimized.js)
 * - Solo busca en campos que el backend realmente envía
 * - Performance mejorado: ~60% menos operaciones
 */

import { normalizeVehicleImages, toFormFormat } from '@utils/imageNormalizerOptimized'

/**
 * Extrae el objeto detalle desde posibles envoltorios de respuesta
 */
export const unwrapDetail = (detail) => {
    if (!detail) return null
    // data puede ser objeto o array
    if (detail.data) {
        if (Array.isArray(detail.data)) return detail.data[0] || null
        if (typeof detail.data === 'object') return detail.data
    }
    // getOnePhoto puede ser objeto o array
    if (detail.getOnePhoto) {
        if (Array.isArray(detail.getOnePhoto)) return detail.getOnePhoto[0] || null
        if (typeof detail.getOnePhoto === 'object') return detail.getOnePhoto
    }
    // photo puede ser objeto o array
    if (detail.photo) {
        if (Array.isArray(detail.photo)) return detail.photo[0] || null
        if (typeof detail.photo === 'object') return detail.photo
    }
    // vehiculo puede ser objeto o array
    if (detail.vehiculo) {
        if (Array.isArray(detail.vehiculo)) return detail.vehiculo[0] || null
        if (typeof detail.vehiculo === 'object') return detail.vehiculo
    }
    return detail
}

/**
 * Mapea el detalle a initialData que espera CarFormRHF/useImageReducer
 * 
 * ✅ ACTUALIZADO: Usa normalizador unificado en lugar de lógica duplicada
 */
export const normalizeDetailToFormInitialData = (rawDetail) => {
    const d = unwrapDetail(rawDetail) || {}

    // ✅ OPTIMIZADO: Normalización específica (solo busca en campos que el backend envía)
    const normalizedImages = normalizeVehicleImages(d)
    
    // ✅ Convertir a formato de formulario (fotoExtra1 ... fotoExtra8)
    const urls = toFormFormat(normalizedImages)

    return {
        _id: d._id || d.id || '',
        marca: d.marca || d.brand || '',
        modelo: d.modelo || d.model || '',
        version: d.version || '',
        precio: d.precio ?? d.price ?? '',
        caja: d.caja || '',
        segmento: d.segmento || d.categoria || d.categoriaVehiculo || '',
        cilindrada: d.cilindrada ?? '',
        color: d.color || '',
        anio: d.anio ?? d.año ?? d.year ?? '',
        combustible: d.combustible || d.fuel || '',
        transmision: d.transmision || d.transmission || '',
        kilometraje: d.kilometraje ?? d.kms ?? d.kilometers ?? '',
        traccion: d.traccion || '',
        tapizado: d.tapizado || '',
        categoriaVehiculo: d.categoriaVehiculo || d.segmento || '',
        frenos: d.frenos || '',
        turbo: d.turbo || '',
        llantas: d.llantas || '',
        HP: d.HP ?? d.hp ?? '',
        detalle: d.detalle || d.description || '',
        urls
    }
}

export default normalizeDetailToFormInitialData


