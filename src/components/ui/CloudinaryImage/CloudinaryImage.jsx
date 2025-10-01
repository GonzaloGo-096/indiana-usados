/**
 * CloudinaryImage - Componente para imágenes optimizadas con Cloudinary
 * 
 * Genera srcset automáticamente usando public_id de Cloudinary
 * con auto-detección de tipo de imagen y fallback inteligente
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Auto-detección y API simplificada
 */

import React, { memo, useState } from 'react'
import { cldUrl, cldSrcset, cldPlaceholderUrl } from '@utils/cloudinaryUrl'
import { IMAGE_WIDTHS } from '@constants/imageSizes'
import { extractPublicIdFromUrl, isCloudinaryUrl } from '@utils/extractPublicId'
import styles from './CloudinaryImage.module.css'

/**
 * Componente CloudinaryImage
 * @param {Object} props - Propiedades del componente
 * @param {*} props.image - Imagen (objeto con public_id, URL, o public_id string) [NUEVO - Recomendado]
 * @param {string} props.publicId - Public ID de Cloudinary [LEGACY - Mantener compatibilidad]
 * @param {string} props.fallbackUrl - URL de fallback [LEGACY - Mantener compatibilidad]
 * @param {string} props.alt - Texto alternativo
 * @param {'fluid'|'cover-16-9'} props.variant - Variante de transformación
 * @param {Array} props.widths - Anchos para srcset
 * @param {string} props.sizes - Atributo sizes
 * @param {'lazy'|'eager'} props.loading - Estrategia de carga
 * @param {'high'|'low'|'auto'} props.fetchpriority - Prioridad de carga
 * @param {boolean} props.isCritical - Si es imagen crítica (preload)
 * @param {'auto'|'eco'} props.qualityMode - Modo de calidad (auto=máxima, eco=80%)
 * @param {string} props.className - Clases CSS
 * @param {Object} props.style - Estilos inline
 */
export const CloudinaryImage = memo(({
  image,
  publicId,
  fallbackUrl,
  alt,
  variant = 'fluid',
  widths,
  sizes = '100vw',
  loading = 'lazy',
  fetchpriority,
  isCritical = false,
  qualityMode = 'auto',
  className,
  style,
  showPlaceholder = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // ✅ AUTO-DETECCIÓN: Determinar public_id y fallbackUrl desde prop 'image'
  const { finalPublicId, finalFallbackUrl } = React.useMemo(() => {
    // Prioridad 1: Si viene image prop (nuevo API)
    if (image !== undefined && image !== null) {
      
      // Caso A: Objeto con public_id (estructura backend)
      if (typeof image === 'object' && image?.public_id) {
        return {
          finalPublicId: image.public_id,
          finalFallbackUrl: image.url || null
        }
      }
      
      // Caso B: String URL de Cloudinary
      if (typeof image === 'string' && isCloudinaryUrl(image)) {
        return {
          finalPublicId: extractPublicIdFromUrl(image),
          finalFallbackUrl: image
        }
      }
      
      // Caso C: String public_id directo
      if (typeof image === 'string') {
        return {
          finalPublicId: image,
          finalFallbackUrl: null
        }
      }
      
      // Caso D: Objeto solo con url (sin public_id)
      if (typeof image === 'object' && image?.url) {
        const url = image.url
        return {
          finalPublicId: isCloudinaryUrl(url) 
            ? extractPublicIdFromUrl(url) 
            : null,
          finalFallbackUrl: url
        }
      }
    }
    
    // Prioridad 2: Props legacy (compatibilidad hacia atrás)
    let legacyPublicId = publicId
    
    // Si no hay publicId pero hay fallbackUrl de Cloudinary, extraer public_id
    if (!legacyPublicId && fallbackUrl && isCloudinaryUrl(fallbackUrl)) {
      legacyPublicId = extractPublicIdFromUrl(fallbackUrl)
    }
    
    return {
      finalPublicId: legacyPublicId,
      finalFallbackUrl: fallbackUrl
    }
  }, [image, publicId, fallbackUrl])

  // Si aún no hay publicId, usar finalFallbackUrl directamente
  if (!finalPublicId) {
    if (!finalFallbackUrl) return null
    
    return (
      <img
        src={finalFallbackUrl}
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
    qualityMode,  // Propagar qualityMode a cldUrl
    ...(variant === 'cover-16-9' && {
      aspectRatio: '16:9',
      crop: 'fill',
      gravity: 'auto'
    }),
    ...(variant === 'fluid' && {
      crop: 'limit'
    })
  }

  // Generar src (usar ancho pequeño para forzar uso de srcset)
  const src = cldUrl(finalPublicId, {
    ...baseOptions,
    width: defaultWidths[0] // Usar el ancho más pequeño
  })

  // Generar srcset
  const srcSet = cldSrcset(finalPublicId, defaultWidths, baseOptions)

  // Determinar fetchpriority para imágenes críticas
  const finalFetchpriority = isCritical ? 'high' : (fetchpriority || 'auto')

  // Generar placeholder borroso si está habilitado
  const placeholderSrc = showPlaceholder ? cldPlaceholderUrl(finalPublicId) : null

  // Calcular dimensiones intrínsecas para aspect-ratio (evita CLS)
  const intrinsicWidth = defaultWidths[defaultWidths.length - 1]  // Usar el ancho más grande
  const intrinsicHeight = variant === 'cover-16-9' 
    ? Math.round(intrinsicWidth * 9 / 16)  // 16:9 aspect ratio
    : undefined  // Dejar que la imagen mantenga su aspect ratio natural
  
  // Style object con aspect-ratio
  const imageStyle = {
    aspectRatio: variant === 'cover-16-9' ? '16 / 9' : undefined,
    ...style
  }

  // Manejar carga de imagen
  const handleLoad = () => {
    // Delay más largo para asegurar solapamiento completo
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)
  }

  // Si no hay publicId, renderizar imagen simple
  if (!finalPublicId) {
    return (
      <img
        src={finalFallbackUrl}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        decoding="async"
        {...props}
      />
    )
  }

  // Renderizar con placeholder borroso si está disponible
  if (placeholderSrc && showPlaceholder) {
    return (
      <div className={`${styles.imageContainer} ${className}`} style={imageStyle}>
        {/* Placeholder borroso */}
        <img
          src={placeholderSrc}
          alt=""
          className={`${styles.placeholder} ${isLoaded ? styles.placeholderHidden : ''}`}
          aria-hidden="true"
        />
        {/* Imagen principal */}
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={intrinsicWidth}
          height={intrinsicHeight}
          className={`${styles.image} ${isLoaded ? styles.imageLoaded : ''}`}
          loading={loading}
          decoding="async"
          fetchpriority={finalFetchpriority}
          onLoad={handleLoad}
          {...props}
        />
      </div>
    )
  }

  // Renderizar imagen normal sin placeholder
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={intrinsicWidth}
      height={intrinsicHeight}
      className={className}
      style={imageStyle}
      loading={loading}
      decoding="async"
      fetchpriority={finalFetchpriority}
      onLoad={handleLoad}
      {...props}
    />
  )
})

CloudinaryImage.displayName = 'CloudinaryImage'

export default CloudinaryImage
