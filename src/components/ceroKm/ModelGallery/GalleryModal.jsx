/**
 * GalleryModal - Lightbox modal para ver imágenes en grande
 * 
 * Features:
 * - Navegación prev/next
 * - Cierre con botón, overlay, tecla Escape
 * - Bloquea scroll del body
 * - Render condicional (solo se monta cuando está abierto)
 * - Lazy loading de imágenes grandes
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CloudinaryImage } from '@components/ui/CloudinaryImage'
import { ChevronIcon, CloseIcon } from '@components/ui/icons'
import styles from './ModelGallery.module.css'

/**
 * GalleryModal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar
 * @param {Array} props.images - Array de objetos { publicId, alt }
 * @param {number} props.activeIndex - Índice de imagen activa
 * @param {Function} props.onIndexChange - Callback para cambiar índice
 * @param {string} props.modelName - Nombre del modelo para alt text
 */
export const GalleryModal = memo(({ 
  isOpen,
  onClose,
  images = [],
  activeIndex = 0,
  onIndexChange,
  modelName = 'Vehículo'
}) => {
  // Navegación
  const goToPrev = useCallback(() => {
    const newIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1
    onIndexChange?.(newIndex)
  }, [activeIndex, images.length, onIndexChange])

  const goToNext = useCallback(() => {
    const newIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1
    onIndexChange?.(newIndex)
  }, [activeIndex, images.length, onIndexChange])

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Manejo de teclado
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goToPrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNext()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, goToPrev, goToNext])

  // No renderizar si está cerrado
  if (!isOpen || !images.length) return null

  const currentImage = images[activeIndex]

  const modalContent = (
    <div 
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${modelName}`}
    >
      {/* Contenedor del modal - detener propagación de click */}
      <div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          className={styles.modalCloseBtn}
          onClick={onClose}
          aria-label="Cerrar galería"
        >
          <CloseIcon size={24} />
        </button>

        {/* Imagen principal */}
        <div className={styles.modalImageContainer}>
          <CloudinaryImage
            image={currentImage?.publicId}
            alt={currentImage?.alt || `${modelName} - Imagen ${activeIndex + 1}`}
            variant="fluid"
            loading="eager"
            qualityMode="auto"
            className={styles.modalImage}
            sizes="90vw"
          />
        </div>

        {/* Navegación */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.modalNavBtn} ${styles.modalNavPrev}`}
              onClick={goToPrev}
              aria-label="Imagen anterior"
            >
              <ChevronIcon direction="left" size={32} />
            </button>
            <button
              type="button"
              className={`${styles.modalNavBtn} ${styles.modalNavNext}`}
              onClick={goToNext}
              aria-label="Imagen siguiente"
            >
              <ChevronIcon direction="right" size={32} />
            </button>

            {/* Contador */}
            <div className={styles.modalCounter}>
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* Miniaturas en desktop */}
        <div className={styles.modalThumbnails}>
          {images.map((image, index) => (
            <button
              key={image.publicId || index}
              type="button"
              className={`${styles.modalThumb} ${index === activeIndex ? styles.modalThumbActive : ''}`}
              onClick={() => onIndexChange?.(index)}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <CloudinaryImage
                image={image.publicId}
                alt={`Miniatura ${index + 1}`}
                variant="fluid"
                loading="lazy"
                qualityMode="eco"
                className={styles.modalThumbImage}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Usar portal para renderizar fuera del árbol DOM normal
  return createPortal(modalContent, document.body)
})

GalleryModal.displayName = 'GalleryModal'

export default GalleryModal

