/**
 * FilterIcon - Ícono de filtro (embudo)
 * 
 * Útil para: botones de filtrado, barras de búsqueda.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const FilterIcon = ({ 
  size = 20, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
)

export default FilterIcon

