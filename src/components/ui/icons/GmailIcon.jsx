/**
 * GmailIcon - Componente de icono de Gmail
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'

/**
 * Componente GmailIcon
 * @param {Object} props - Propiedades del componente
 * @param {number} props.width - Ancho del icono (por defecto: 24)
 * @param {number} props.height - Alto del icono (por defecto: 24)
 * @param {string} props.fill - Color de relleno (por defecto: 'currentColor')
 * @param {string} props.className - Clases CSS adicionales
 */
export const GmailIcon = ({ 
    width = 24, 
    height = 24, 
    fill = 'currentColor',
    className = ''
}) => (
    <svg 
        width={width} 
        height={height} 
        viewBox="0 0 24 24" 
        fill={fill}
        className={className}
    >
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
) 