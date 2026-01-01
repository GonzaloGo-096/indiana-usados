/**
 * PdfDownloadButton - Botón reutilizable para descargar PDFs
 * 
 * Características:
 * - Descarga bajo demanda (solo al hacer clic)
 * - No carga el PDF hasta que el usuario lo solicita
 * - Soporta descarga y/o apertura en nueva pestaña
 * - Muestra tamaño del archivo opcionalmente
 * - Estilos consistentes con el sistema de diseño
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import { DownloadIcon } from '@components/ui/icons'
import styles from './PdfDownloadButton.module.css'

/**
 * @param {Object} props
 * @param {string} props.href - Ruta al PDF (relativa a /public)
 * @param {string} props.label - Texto del botón
 * @param {string} [props.fileSize] - Tamaño del archivo (ej: "1,2 MB")
 * @param {boolean} [props.openInNewTab] - Si es true, abre en nueva pestaña además de descargar
 * @param {string} [props.variant] - Variante del botón: 'primary' | 'secondary' | 'outline'
 * @param {string} [props.size] - Tamaño: 'small' | 'medium' | 'large'
 * @param {string} [props.className] - Clases CSS adicionales
 */
export const PdfDownloadButton = memo(({
  href,
  label,
  fileSize,
  openInNewTab = false,
  variant = 'primary',
  size = 'medium',
  className = ''
}) => {
  if (!href || !label) return null

  // Asegurar que href comience con / (ruta relativa desde /public)
  const pdfUrl = href.startsWith('/') ? href : `/${href}`

  // Extraer nombre del archivo para el atributo download
  const fileName = pdfUrl.split('/').pop()

  // Manejar click para descarga o apertura
  const handleClick = (e) => {
    if (!openInNewTab) {
      // Forzar descarga
      e.preventDefault()
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    // Si openInNewTab es true, dejar que el navegador maneje el link normalmente
  }

  // Atributos para el link
  const linkProps = {
    href: pdfUrl,
    className: `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim(),
    'aria-label': fileSize ? `${label} (${fileSize})` : label,
    onClick: handleClick
  }

  // Si openInNewTab es true, abrir en nueva pestaña
  if (openInNewTab) {
    linkProps.target = '_blank'
    linkProps.rel = 'noopener noreferrer'
  }

  return (
    <a
      {...linkProps}
    >
      <DownloadIcon size={18} className={styles.icon} />
      <span className={styles.label}>{label}</span>
      {fileSize && (
        <span className={styles.fileSize} aria-label={`Tamaño del archivo: ${fileSize}`}>
          ({fileSize})
        </span>
      )}
    </a>
  )
})

PdfDownloadButton.displayName = 'PdfDownloadButton'

export default PdfDownloadButton

