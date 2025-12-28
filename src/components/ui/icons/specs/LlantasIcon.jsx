import React, { memo } from 'react'

export const LlantasIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
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
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill={color} stroke="none" />
    <path d="M12 6v2" />
    <path d="M12 16v2" />
    <path d="M6 12h2" />
    <path d="M16 12h2" />
    <path d="M7.76 7.76l1.41 1.41" />
    <path d="M14.83 14.83l1.41 1.41" />
    <path d="M7.76 16.24l1.41-1.41" />
    <path d="M14.83 9.17l1.41-1.41" />
  </svg>
))

LlantasIcon.displayName = 'LlantasIcon'
