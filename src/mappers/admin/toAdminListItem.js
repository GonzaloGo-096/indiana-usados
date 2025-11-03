/**
 * toAdminListItem - Mapper de presentación para la lista del Dashboard
 * Normaliza campos y asegura firstImageUrl seguro.
 */

import { extractFirstImageUrl } from '@utils/imageExtractors'

export function toAdminListItem(vehicle = {}) {
  const v = vehicle || {}
  const anio = v.anio ?? v.año ?? v.year ?? ''
  const kilometraje = v.kilometraje ?? v.kms ?? v.kilometers ?? 0
  const precio = v.precio ?? v.price ?? 0
  const firstImageUrl = extractFirstImageUrl(v) || ''

  return {
    id: v._id || v.id,
    marca: v.marca || '',
    modelo: v.modelo || '',
    version: v.version || '',
    anio,
    kilometraje,
    precio,
    firstImageUrl,
    _original: v
  }
}


