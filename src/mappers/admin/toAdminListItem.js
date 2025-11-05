/**
 * toAdminListItem - Mapper de presentación para la lista del Dashboard
 * 
 * Normaliza campos inconsistentes del backend y asegura estructura predecible para UI.
 * - Normaliza variantes de año (anio/año/year)
 * - Normaliza variantes de kilometraje (kilometraje/kms/kilometers)
 * - Asegura tipos numéricos correctos
 * - Extrae firstImageUrl de manera segura
 * - Preserva objeto original para operaciones admin (editar/eliminar)
 * 
 * @param {Object} vehicle - Vehículo raw del backend
 * @returns {Object} Vehículo normalizado para render en lista admin
 */
import { extractFirstImageUrl } from '@utils/imageExtractors'

export function toAdminListItem(vehicle = {}) {
  const v = vehicle || {}
  
  // Normalizar año (variantes: anio/año/year)
  const anio = String(v.anio ?? v.año ?? v.year ?? '').trim()
  
  // Normalizar kilometraje (variantes: kilometraje/kms/kilometers)
  const rawKm = v.kilometraje ?? v.kms ?? v.kilometers ?? 0
  const kilometraje = Number(rawKm) || 0
  
  // Normalizar precio (variantes: precio/price)
  const rawPrice = v.precio ?? v.price ?? 0
  const precio = Number(rawPrice) || 0
  
  // Extraer imagen de manera segura
  const firstImageUrl = extractFirstImageUrl(v) || ''
  
  // ID seguro (prioridad: _id > id)
  const id = v._id || v.id || null

  return {
    id,
    marca: String(v.marca || '').trim(),
    modelo: String(v.modelo || '').trim(),
    version: String(v.version || '').trim(),
    anio,
    kilometraje,
    precio,
    firstImageUrl,
    // Preservar original para operaciones que requieren datos completos
    _original: v
  }
}


