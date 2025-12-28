import React, { memo } from 'react'

export const AirbagsIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
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
    {/* Cabeza */}
    <circle cx="17" cy="5" r="2.5" />
    {/* Cuerpo inclinado */}
    <path d="M17 7.5l-2 4" />
    {/* Brazos hacia airbag */}
    <path d="M15 11.5l-4-1" />
    <path d="M15 11.5l-3 2" />
    {/* Piernas */}
    <path d="M15 11.5l1 5" />
    <path d="M16 16.5l2 3" />
    <path d="M16 16.5l-1 3" />
    {/* Airbag círculo */}
    <circle cx="7" cy="11" r="4.5" />
  </svg>
))

AirbagsIcon.displayName = 'AirbagsIcon'
