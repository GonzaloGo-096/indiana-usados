/**
 * ArrowUpIcon - Ícono de flecha hacia arriba
 * 
 * Útil para: botón scroll to top, subir, expandir.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const ArrowUpIcon = ({ 
  size = 24, 
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
    <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
)

export default ArrowUpIcon


