/**
 * VersionContent - Contenido de una versión (imagen, color, specs)
 * 
 * Componente reutilizable para mostrar el contenido de una versión.
 * Se usa tanto en mobile (carrusel) como en desktop (layout columnas).
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import { ColorSelector } from '../ColorSelector'
import { ModeloSpecs } from '../ModeloSpecs'
import styles from './VersionContent.module.css'

// Imagen placeholder cuando no hay imagen disponible
const PLACEHOLDER_IMAGE = 'https://res.cloudinary.com/drbeomhcu/image/upload/v1766082588/logo-chico_solid_yv8oot.webp'

/**
 * @param {Object} props
 * @param {Object} props.version - Objeto versión activa
 * @param {string} props.modeloMarca - Marca del modelo (ej: 'Peugeot')
 * @param {string} props.modeloNombre - Nombre del modelo (ej: '2008')
 * @param {Object} props.colorActivo - Objeto color activo
 * @param {Array} props.coloresDisponibles - Array de colores disponibles
 * @param {Object} props.imagenActual - { url, alt, hasImage }
 * @param {Function} props.onColorChange - Callback al cambiar color
 * @param {string} props.layout - 'mobile' | 'desktop'
 */
export const VersionContent = memo(({
  version,
  modeloMarca = '',
  modeloNombre = '',
  colorActivo,
  coloresDisponibles,
  imagenActual,
  onColorChange,
  layout = 'mobile'
}) => {
  if (!version) return null

  const imageUrl = imagenActual?.url || PLACEHOLDER_IMAGE
  const imageAlt = imagenActual?.alt || `${modeloNombre} ${version.nombre}`
  const tituloCompleto = modeloNombre ? `${modeloNombre} ${version.nombre}` : version.nombre

  // Layout mobile: todo en columna
  if (layout === 'mobile') {
    return (
      <article className={styles.mobileContainer}>
        {/* Imagen */}
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt={imageAlt}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Selector de colores */}
        <div className={styles.colorSection}>
          <h3 className={styles.colorTitle}>Colores</h3>
          <ColorSelector
            colores={coloresDisponibles}
            colorActivo={colorActivo?.key}
            onColorChange={onColorChange}
            size="md"
          />
          {colorActivo && (
            <span className={styles.colorLabel}>{colorActivo.label}</span>
          )}
        </div>

        {/* Info */}
        <div className={styles.infoSection}>
          <h2 className={styles.versionTitle}>{tituloCompleto}</h2>
          <p className={styles.versionDescription}>{version.descripcion}</p>
        </div>

        {/* Specs */}
        <div className={styles.specsSection}>
          <ModeloSpecs specs={version.specs} variant="compact" />
        </div>
      </article>
    )
  }

  // Layout desktop: 2 columnas (imagen izq, info der)
  return (
    <article className={styles.desktopContainer}>
      {/* Columna izquierda: Imagen + Color */}
      <div className={styles.leftColumn}>
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt={imageAlt}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.colorSection}>
          <h3 className={styles.colorTitle}>Colores</h3>
          <ColorSelector
            colores={coloresDisponibles}
            colorActivo={colorActivo?.key}
            onColorChange={onColorChange}
            size="lg"
          />
          {colorActivo && (
            <span className={styles.colorLabel}>{colorActivo.label}</span>
          )}
        </div>
      </div>

      {/* Columna derecha: Info + Specs */}
      <div className={styles.rightColumn}>
        <h2 className={styles.versionTitle}>{tituloCompleto}</h2>
        <p className={styles.versionDescription}>{version.descripcion}</p>
        
        <div className={styles.specsSection}>
          <h3 className={styles.specsTitle}>Especificaciones</h3>
          <ModeloSpecs specs={version.specs} variant="compact" />
        </div>

        {/* CTA WhatsApp */}
        <a
          href={`https://wa.me/543816295959?text=${encodeURIComponent(`Hola! Me interesa el ${modeloMarca} ${modeloNombre} ${version.nombreCorto} en color ${colorActivo?.label || ''}`)}`}
          className={styles.ctaButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar por este modelo
        </a>
      </div>
    </article>
  )
})

VersionContent.displayName = 'VersionContent'

export default VersionContent
