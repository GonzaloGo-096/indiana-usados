import React, { memo } from 'react'

export const CajaIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
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
    {/* Patrón H de cambios */}
    <circle cx="7" cy="5" r="1.5" />
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="17" cy="5" r="1.5" />
    <path d="M7 6.5v5" />
    <path d="M12 6.5v5" />
    <path d="M17 6.5v5" />
    <path d="M7 11.5h10" />
    <path d="M7 11.5v5" />
    <path d="M12 11.5v5" />
    <path d="M17 11.5v5" />
    <circle cx="7" cy="18" r="1.5" />
    <circle cx="12" cy="18" r="1.5" />
    <circle cx="17" cy="18" r="1.5" />
  </svg>
))

CajaIcon.displayName = 'CajaIcon'
