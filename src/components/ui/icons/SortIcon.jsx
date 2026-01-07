/**
 * SortIcon - Ícono de ordenamiento
 * 
 * Útil para: botones de ordenar, dropdowns de sort.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const SortIcon = ({ 
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
    <path d="M3 6h18" />
    <path d="M6 12h12" />
    <path d="M9 18h6" />
  </svg>
)

export default SortIcon


