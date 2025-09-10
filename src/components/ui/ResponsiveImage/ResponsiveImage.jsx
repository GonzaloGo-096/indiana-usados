/**
 * ResponsiveImage - Componente para imágenes responsive con Cloudinary
 * 
 * Genera srcset automáticamente usando public_id de Cloudinary
 * con fallback a URL tradicional para registros viejos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React, { memo } from 'react'
import { cldUrl, cldSrcset } from '@utils/cloudinaryUrl'
import { IMAGE_WIDTHS } from '@constants/imageSizes'
import { extractPublicIdFromUrl, isCloudinaryUrl } from '@utils/extractPublicId'

/**
 * Componente ResponsiveImage
 * @param {Object} props - Propiedades del componente
 * @param {string} props.publicId - Public ID de Cloudinary (preferido)
 * @param {string} props.fallbackUrl - URL de fallback para registros viejos
 * @param {string} props.alt - Texto alternativo
 * @param {'fluid'|'cover-16-9'} props.variant - Variante de transformación
 * @param {Array} props.widths - Anchos para srcset
 * @param {string} props.sizes - Atributo sizes
 * @param {'lazy'|'eager'} props.loading - Estrategia de carga
 * @param {'high'|'low'|'auto'} props.fetchpriority - Prioridad de carga
 * @param {boolean} props.isCritical - Si es imagen crítica (preload)
 * @param {string} props.className - Clases CSS
 * @param {Object} props.style - Estilos inline
 */
export const ResponsiveImage = memo(({
  publicId,
  fallbackUrl,
  alt,
  variant = 'fluid',
  widths,
  sizes = '100vw',
  loading = 'lazy',
  fetchpriority,
  isCritical = false,
  className,
  style,
  ...props
}) => {
  // Determinar el public_id a usar
  let finalPublicId = publicId
  
  // Si no hay publicId pero hay fallbackUrl de Cloudinary, extraer public_id
  if (!finalPublicId && fallbackUrl && isCloudinaryUrl(fallbackUrl)) {
    finalPublicId = extractPublicIdFromUrl(fallbackUrl)
  }

  // Si aún no hay publicId, usar fallbackUrl directamente
  if (!finalPublicId) {
    if (!fallbackUrl) return null
    
    return (
      <img
        src={fallbackUrl}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        decoding="async"
        {...props}
      />
    )
  }

  // Determinar widths por defecto según variant
  const defaultWidths = widths || (
    variant === 'cover-16-9' 
      ? IMAGE_WIDTHS.hero 
      : IMAGE_WIDTHS.card
  )

  // Configurar opciones según variant
  const baseOptions = {
    variant,
    ...(variant === 'cover-16-9' && {
      aspectRatio: '16:9',
      crop: 'fill',
      gravity: 'auto'
    }),
    ...(variant === 'fluid' && {
      crop: 'limit'
    })
  }

  // Generar src (usar el ancho más grande como fallback optimizado)
  const src = cldUrl(finalPublicId, {
    ...baseOptions,
    width: defaultWidths[defaultWidths.length - 1]
  })

  // Generar srcset
  const srcSet = cldSrcset(finalPublicId, defaultWidths, baseOptions)

  // Determinar fetchpriority para imágenes críticas
  const finalFetchpriority = isCritical ? 'high' : (fetchpriority || 'auto')

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      fetchpriority={finalFetchpriority}
      {...props}
    />
  )
})

ResponsiveImage.displayName = 'ResponsiveImage'

export default ResponsiveImage
