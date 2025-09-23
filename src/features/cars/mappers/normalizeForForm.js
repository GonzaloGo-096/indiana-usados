/**
 * normalizeForForm.js - Normaliza detalle de vehículo a initialData del CarFormRHF
 */

/**
 * Normaliza una entrada de imagen a { url, public_id, original_name } o null
 */
const normalizeImage = (entry) => {
    if (!entry) return null
    if (typeof entry === 'string') return { url: entry, public_id: '', original_name: '' }
    if (typeof entry === 'object') {
        const url = entry.url || entry.secure_url || entry.path || entry.src || ''
        if (!url) return null
        return {
            url,
            public_id: entry.public_id || entry.publicId || '',
            original_name: entry.original_name || entry.originalName || entry.filename || ''
        }
    }
    return null
}

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
 */
export const normalizeDetailToFormInitialData = (rawDetail) => {
    const d = unwrapDetail(rawDetail) || {}

    // Obtener fotos extra desde múltiples posibles claves
    const resolveExtras = (obj) => {
        if (!obj || typeof obj !== 'object') return []
        const candidates = [
            obj.fotosExtra,
            obj.fotosExtras,
            obj.gallery,
            obj.imagenes,
            obj.images,
            obj.photos
        ]
        for (let i = 0; i < candidates.length; i++) {
            if (Array.isArray(candidates[i])) return candidates[i]
        }
        return []
    }

    const extrasArr = resolveExtras(d)

    const urls = {
        fotoPrincipal: normalizeImage(d.fotoPrincipal),
        fotoHover: normalizeImage(d.fotoHover),
        fotoExtra1: normalizeImage(extrasArr[0]),
        fotoExtra2: normalizeImage(extrasArr[1]),
        fotoExtra3: normalizeImage(extrasArr[2]),
        fotoExtra4: normalizeImage(extrasArr[3]),
        fotoExtra5: normalizeImage(extrasArr[4]),
        fotoExtra6: normalizeImage(extrasArr[5]),
        fotoExtra7: normalizeImage(extrasArr[6]),
        fotoExtra8: normalizeImage(extrasArr[7])
    }

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


