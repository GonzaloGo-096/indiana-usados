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
  // ✅ OPTIMIZADO: Verificación más eficiente
  const allPhotos = raw?.allPhotos;
  
  if (!allPhotos?.docs?.length) {
    // ✅ OPTIMIZADO: Objeto inmutable para reutilizar
    return EMPTY_PAGE_RESULT;
  }
  
  // ✅ OPTIMIZADO: Destructuring directo
  const { docs, totalDocs, hasNextPage, nextPage } = allPhotos;
  
  return {
    items: docs,
    total: totalDocs || 0,
    hasNextPage: Boolean(hasNextPage),
    next: nextPage || undefined
  };
}

// ✅ OPTIMIZADO: Resultado vacío reutilizable
const EMPTY_PAGE_RESULT = Object.freeze({
  items: [],
  total: 0,
  hasNextPage: false,
  next: undefined
});
