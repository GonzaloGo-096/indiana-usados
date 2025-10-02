/**
 * Validación de rangos para filtros
 * Asegura que min <= max
 * 
 * @param {Array} range - Array [min, max]
 * @returns {Array} - Array [min, max] con valores ordenados correctamente
 * 
 * @example
 * validateRange([100, 50]) // [50, 100]
 * validateRange([50, 100]) // [50, 100]
 */
export const validateRange = ([min, max]) => [Math.min(min, max), Math.max(min, max)]
