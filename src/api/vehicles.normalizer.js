/**
 * Normalizador de datos de vehículos para respuestas de API
 * 
 * Convierte respuestas del backend a un formato consistente para el frontend
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Normaliza una respuesta de página de vehículos del backend
 * 
 * @param {any} raw - Respuesta cruda del backend
 * @returns {Object} Página de vehículos normalizada
 */
export function normalizeVehiclesPage(raw) {
  // Verificar si existe la estructura esperada del backend
  const allPhotos = raw?.allPhotos;
  
  if (!allPhotos || !Array.isArray(allPhotos.docs)) {
    // Si no hay allPhotos o docs, devolver valores por defecto
    return {
      items: [],
      total: 0,
      hasNextPage: false
    };
  }
  
  // Mapear datos según la estructura del backend
  return {
    items: allPhotos.docs ?? [],
    total: allPhotos.totalDocs ?? 0,
    hasNextPage: Boolean(allPhotos.hasNextPage),
    next: allPhotos.nextPage ?? undefined
  };
}
