/**
 * Hook para manejar cambios en selects múltiples
 * 
 * @param {Function} setValue - Función setValue de React Hook Form
 * @returns {Object} - Objeto con handlers para cada tipo de select
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const useSelectHandlers = (setValue) => {
  const handleMarcaChange = (values) => setValue('marca', values)
  const handleCombustibleChange = (values) => setValue('combustible', values)
  const handleCajaChange = (values) => setValue('caja', values)

  return {
    handleMarcaChange,
    handleCombustibleChange,
    handleCajaChange
  }
}
