import React, { memo } from 'react'

export const SensoresIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
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
    <rect x="6" y="16" width="12" height="4" rx="1" />
    <path d="M9 16v-2a3 3 0 0 1 6 0v2" />
    <path d="M7 12a5 5 0 0 1 10 0" />
    <path d="M5 9a8 8 0 0 1 14 0" />
    <path d="M3 6a11 11 0 0 1 18 0" />
  </svg>
))

SensoresIcon.displayName = 'SensoresIcon'
