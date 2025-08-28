/**
 * Icono de velocímetro moderno/kilómetros
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'

export const RouteIcon = ({ className = '', size = 20, color = 'currentColor' }) => {
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
      {/* Círculo exterior del velocímetro */}
      <circle cx="12" cy="12" r="8" />
      {/* Aguja del velocímetro */}
      <line x1="12" y1="12" x2="12" y2="6" />
      {/* Solo 4 marcas principales para claridad */}
      <line x1="12" y1="4" x2="12" y2="5" />
      <line x1="18" y1="8" x2="17" y2="9" />
      <line x1="18" y1="16" x2="17" y2="15" />
      <line x1="12" y1="20" x2="12" y2="19" />
    </svg>
  )
}

export default RouteIcon
