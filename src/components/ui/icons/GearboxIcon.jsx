/**
 * Icono de palanca de cambios tipo joystick - GRANDE SIN RELLENO
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'

export const GearboxIcon = ({ className = '', size = 20, color = 'currentColor' }) => {
  return (
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
    >
      {/* Base del joystick - SIN RELLENO, SOLO CONTORNO */}
      <rect x="5" y="18" width="14" height="4" rx="2" />
      {/* Palanca vertical - MÁS LARGA */}
      <line x1="12" y1="18" x2="12" y2="6" />
      {/* Cabeza de la palanca - SIN RELLENO, SOLO CONTORNO */}
      <circle cx="12" cy="6" r="4" />
      {/* Indicador de posición en la base */}
      <circle cx="12" cy="20" r="1.5" />
    </svg>
  )
}

export default GearboxIcon
