/**
 * Icono de ruta/camino - Representa kilometraje y distancia recorrida
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

export const KilometrajeIcon = ({ className = '', size = 24, color = 'currentColor' }) => {
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
      {/* Camino/ruta con curvas */}
      <path d="M3 12 Q8 8 12 12 T21 12" strokeWidth="2" />
      {/* Líneas divisorias del camino */}
      <path d="M4 10 Q8.5 6.5 12 10 T20 10" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
      {/* Marcadores de distancia a lo largo del camino */}
      <circle cx="6" cy="11" r="1" fill={color} />
      <circle cx="12" cy="12" r="1" fill={color} />
      <circle cx="18" cy="12" r="1" fill={color} />
      {/* Flecha al final indicando dirección */}
      <path d="M19 12 L21 12 M20 11 L21 12 L20 13" strokeWidth="1.5" />
      {/* Puntos de inicio y fin */}
      <circle cx="3" cy="12" r="1.5" fill={color} />
    </svg>
  )
}

export default KilometrajeIcon

