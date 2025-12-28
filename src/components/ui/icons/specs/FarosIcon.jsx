import React, { memo } from 'react'

export const FarosIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
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
    <path d="M3 12h1" />
    <path d="M3 8h3" />
    <path d="M3 16h3" />
    <ellipse cx="12" cy="12" rx="5" ry="6" />
    <circle cx="12" cy="12" r="2.5" fill={color} stroke="none" />
    <path d="M17 9l4-2" />
    <path d="M17 12h4" />
    <path d="M17 15l4 2" />
  </svg>
))

FarosIcon.displayName = 'FarosIcon'
