/**
 * GalleryGrid - Grid de imágenes responsive para galería de modelo
 * 
 * Mobile: 2x2 (4 imágenes)
 * Desktop: 3x2 (6 imágenes)
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import { CloudinaryImage } from '@components/ui/CloudinaryImage'
import styles from './ModelGallery.module.css'

/**
 * GalleryGrid Component
 * @param {Object} props
 * @param {Array} props.images - Array de objetos { publicId, alt }
 * @param {Function} props.onImageClick - Callback al hacer click en imagen
 * @param {string} props.modelName - Nombre del modelo para alt text
 */
export const GalleryGrid = memo(({ 
  images = [], 
  onImageClick,
  modelName = 'Vehículo'
}) => {
  if (!images || images.length === 0) return null

  return (
    <div className={styles.grid}>
      {images.map((image, index) => (
        <button
          key={image.publicId || index}
          type="button"
          className={styles.gridItem}
          onClick={() => onImageClick?.(index)}
          aria-label={`Ver imagen ${index + 1} de ${modelName}`}
        >
          <CloudinaryImage
            image={image.publicId}
            alt={image.alt || `${modelName} - Imagen ${index + 1}`}
            variant="fluid"
            loading="lazy"
            qualityMode="eco"
            className={styles.gridImage}
            sizes="(max-width: 768px) 45vw, 30vw"
          />
          <div className={styles.gridItemOverlay}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M11 8v6" />
              <path d="M8 11h6" />
            </svg>
          </div>
        </button>
      ))}
    </div>
  )
})

GalleryGrid.displayName = 'GalleryGrid'

export default GalleryGrid

