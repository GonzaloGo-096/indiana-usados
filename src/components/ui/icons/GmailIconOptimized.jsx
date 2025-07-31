import React from 'react'

const GmailIconOptimized = ({ className = '', size = 20 }) => {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.409L12 13.09l10.955-9.269h.409c.904 0 1.636.732 1.636 1.636z"/>
    </svg>
  )
}

export default GmailIconOptimized 