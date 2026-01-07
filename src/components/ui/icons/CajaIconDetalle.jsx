/**
 * Icono de Caja - Palanca de cambios
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import palancaIcon from '@assets/icono-detalle-auto/icons8-palanca-de-cambios-64.webp'

export const CajaIconDetalle = ({ className = '', size = 24, color = 'currentColor' }) => {
  return (
    <img
      src={palancaIcon}
      alt="Caja de cambios"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  )
}

export default CajaIconDetalle


