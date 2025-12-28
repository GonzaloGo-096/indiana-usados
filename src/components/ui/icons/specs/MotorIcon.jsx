import React, { memo } from 'react'

export const MotorIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
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
    {/* Bloque motor */}
    <rect x="5" y="8" width="10" height="8" rx="1" />
    {/* Culata con válvulas */}
    <path d="M7 8V6" />
    <path d="M10 8V5" />
    <path d="M13 8V6" />
    {/* Engranaje/polea */}
    <circle cx="18" cy="12" r="3" />
    <circle cx="18" cy="12" r="1" fill={color} stroke="none" />
    {/* Conexión */}
    <path d="M15 12h2" />
    {/* Base */}
    <path d="M5 16v2h10v-2" />
  </svg>
))

MotorIcon.displayName = 'MotorIcon'
