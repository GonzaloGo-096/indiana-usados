/**
 * DownloadIcon - Ícono de descarga
 * 
 * Útil para: botones de descarga, links de archivos.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const DownloadIcon = ({ 
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export default DownloadIcon

