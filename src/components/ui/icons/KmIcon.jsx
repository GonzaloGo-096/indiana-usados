/**
 * Icono de Kilometraje - Velocímetro
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import velocimetroIcon from '@assets/icono-detalle-auto/icons8-velocímetro-50.webp'

export const KmIcon = ({ className = '', size = 24, color = 'currentColor' }) => {
  return (
    <img
      src={velocimetroIcon}
      alt="Kilometraje"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  )
}

export default KmIcon

