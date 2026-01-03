/**
 * Icono de transmisión/caja de cambios - Patrón H mejorado con engranajes
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const TransmisionIcon = ({ className = '', size = 24, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Patrón H de cambios - más visible */}
      {/* Columna izquierda */}
      <circle cx="7" cy="5" r="1.5" />
      <path d="M7 6.5v4.5" />
      <circle cx="7" cy="12" r="1.5" />
      <path d="M7 13.5v4.5" />
      <circle cx="7" cy="19" r="1.5" />
      
      {/* Columna central */}
      <circle cx="12" cy="5" r="1.5" />
      <path d="M12 6.5v4.5" />
      <path d="M7 12h5" strokeWidth="2" />
      <path d="M12 13.5v4.5" />
      <circle cx="12" cy="19" r="1.5" />
      
      {/* Columna derecha */}
      <circle cx="17" cy="5" r="1.5" />
      <path d="M17 6.5v4.5" />
      <circle cx="17" cy="12" r="1.5" />
      <path d="M17 13.5v4.5" />
      <circle cx="17" cy="19" r="1.5" />
      
      {/* Engranaje pequeño arriba para representar transmisión */}
      <circle cx="20" cy="8" r="2" />
      <circle cx="20" cy="8" r="0.8" fill={color} />
      <path d="M20 6.5 L20 5.5 M20 9.5 L20 10.5 M18.5 8 L17.5 8 M21.5 8 L22.5 8" strokeWidth="1" />
    </svg>
  )
}

export default TransmisionIcon

