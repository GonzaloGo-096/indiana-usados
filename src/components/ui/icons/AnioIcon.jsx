/**
 * Icono de Año - Calendario
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import calendarioIcon from '@assets/icono-detalle-auto/icons8-calendario-64.webp'

export const AnioIcon = ({ className = '', size = 24, color = 'currentColor' }) => {
  return (
    <img
      src={calendarioIcon}
      alt="Año"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  )
}

export default AnioIcon



