/**
 * ModelGallery - Galería de imágenes reutilizable por modelo
 * 
 * Muestra galería fija por modelo (NO por versión).
 * No se re-renderiza al cambiar de versión.
 * 
 * Features:
 * - Grid responsive: 4 imágenes (mobile) / 6 imágenes (desktop)
 * - Lightbox modal al hacer click
 * - Lazy loading
 * - Imágenes desde Cloudinary
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { useState, useMemo, useCallback, memo } from 'react'
import { GalleryGrid } from './GalleryGrid'
import { GalleryModal } from './GalleryModal'
import styles from './ModelGallery.module.css'

/**
 * Hook para detectar si es mobile
 * Usa matchMedia para performance
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(max-width: 768px)').matches
  })

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    
    const handleChange = (e) => {
      setIsMobile(e.matches)
    }

    // Listener moderno
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return isMobile
}

/**
 * ModelGallery Component
 * 
 * @param {Object} props
 * @param {string} props.model - Identificador del modelo (ej: "peugeot-2008")
 * @param {Object} props.images - Objeto con arrays mobile y desktop
 * @param {Array} props.images.mobile - Array de imágenes para mobile (4)
 * @param {Array} props.images.desktop - Array de imágenes para desktop (6)
 * @param {string} props.title - Título opcional para la sección
 */
export const ModelGallery = memo(({ 
  model,
  images,
  title = 'Galería'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = useIsMobile()

  // Seleccionar imágenes según breakpoint
  const displayImages = useMemo(() => {
    if (!images) return []
    return isMobile ? (images.mobile || []) : (images.desktop || [])
  }, [images, isMobile])

  // Todas las imágenes para el modal (siempre desktop si está disponible)
  const allImages = useMemo(() => {
    if (!images) return []
    return images.desktop || images.mobile || []
  }, [images])

  // Handlers
  const handleImageClick = useCallback((index) => {
    // En mobile, mapear el índice a la imagen correcta en desktop
    if (isMobile && images?.desktop && images?.mobile) {
      // Las primeras 4 de mobile corresponden a las primeras 4 de desktop
      setActiveIndex(index)
    } else {
      setActiveIndex(index)
    }
    setIsModalOpen(true)
  }, [isMobile, images])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleIndexChange = useCallback((newIndex) => {
    setActiveIndex(newIndex)
  }, [])

  // Extraer nombre legible del modelo
  const modelName = useMemo(() => {
    if (!model) return 'Vehículo'
    return model
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }, [model])

  if (!displayImages.length) return null

  return (
    <section className={styles.gallery} aria-label={`Galería de ${modelName}`}>
      {title && (
        <h2 className={styles.galleryTitle}>{title}</h2>
      )}
      
      <GalleryGrid 
        images={displayImages}
        onImageClick={handleImageClick}
        modelName={modelName}
      />

      <GalleryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        images={allImages}
        activeIndex={activeIndex}
        onIndexChange={handleIndexChange}
        modelName={modelName}
      />
    </section>
  )
})

ModelGallery.displayName = 'ModelGallery'

export default ModelGallery

