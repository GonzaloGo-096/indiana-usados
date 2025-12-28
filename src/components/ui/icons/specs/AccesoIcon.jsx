import React, { memo } from 'react'

export const AccesoIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
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
    {/* Silueta auto vista lateral */}
    <path d="M3 14h18" />
    <path d="M5 14l1-4h4l2-2h4l2 2h1l1 4" />
    <circle cx="7" cy="14" r="2" />
    <circle cx="17" cy="14" r="2" />
    {/* Señal inalámbrica / llave */}
    <path d="M12 6v-2" />
    <path d="M9 5a4 4 0 0 1 6 0" />
    <path d="M7 3a7 7 0 0 1 10 0" />
  </svg>
))

AccesoIcon.displayName = 'AccesoIcon'
