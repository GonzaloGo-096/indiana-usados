/**
 * Hook para manejar cambios en sliders de rango
 * 
 * @param {Function} setValue - Función setValue de React Hook Form
 * @returns {Object} - Objeto con handlers para cada tipo de rango
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const useRangeHandlers = (setValue) => {
  const handleAñoChange = ([min, max]) => setValue('año', [min, max])
  const handlePrecioChange = ([min, max]) => setValue('precio', [min, max])
  const handleKilometrajeChange = ([min, max]) => setValue('kilometraje', [min, max])

  return {
    handleAñoChange,
    handlePrecioChange,
    handleKilometrajeChange
  }
}
