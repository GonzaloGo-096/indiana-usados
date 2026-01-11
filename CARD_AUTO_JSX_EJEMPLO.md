# CardAuto - Ejemplo JSX Comentado

## Integración con CloudinaryImage

Este ejemplo muestra cómo integrar correctamente `CloudinaryImage` con placeholder blur y lazy loading en `CardAuto`.

### Estructura HTML Renderizada (Producción)

```html
<!-- Contenedor principal de la card -->
<div class="card">
  
  <!-- ✅ CONTENEDOR DE IMAGEN (nuestro CSS controla esto) -->
  <div class="card__image-container">
    
    <!-- ✅ WRAPPER INTERNO DE CLOUDINARY (CloudinaryImage renderiza esto) -->
    <div class="imageContainer">
      
      <!-- Placeholder blur (posición absoluta, no aporta altura) -->
      <img class="placeholder" src="blur-placeholder.jpg" alt="" />
      
      <!-- Imagen real (posición absoluta, no aporta altura) -->
      <img class="image imageLoaded" src="real-image.jpg" alt="..." />
      
    </div>
  </div>
  
  <!-- Resto del contenido... -->
</div>
```

### JSX del Componente (CardAuto.jsx)

```jsx
/**
 * CardAuto - Componente para mostrar información de un vehículo
 * 
 * BUENAS PRÁCTICAS IMPLEMENTADAS:
 * 
 * 1. MEMOIZACIÓN: useMemo para cálculos costosos (formatters, derivaciones)
 * 2. CALLBACKS: useCallback para handlers (evita re-renders innecesarios)
 * 3. LAZY LOADING: CloudinaryImage maneja lazy loading automáticamente
 * 4. PREFETCH: Prefetch inteligente al hover (mejora percepción de velocidad)
 * 5. ACCESIBILIDAD: ARIA labels, roles, keyboard navigation
 * 
 * @author Indiana Usados
 * @version 8.0.0 - Optimizado para producción
 */
import React, { memo, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CloudinaryImage from '@/components/ui/CloudinaryImage/CloudinaryImage'
import { IMAGE_SIZES, IMAGE_WIDTHS } from '@constants/imageSizes'
import styles from './CardAuto.module.css'

export const CardAuto = memo(({ auto }) => {
    const navigate = useNavigate()
    
    // ✅ MEMOIZACIÓN: URL de imagen (evita re-renders si no cambia)
    const primaryImage = useMemo(() => {
        return auto.fotoPrincipal || auto.imagen || '/auto1.jpg'
    }, [auto.fotoPrincipal, auto.imagen])
    
    // ✅ CALLBACK: Handler memoizado para evitar re-renders
    const handleCardClick = useCallback(() => {
        const vehicleId = auto.id || auto._id
        if (!vehicleId) return
        navigate(`/vehiculo/${vehicleId}`)
    }, [auto, navigate])
    
    // ✅ ALT TEXT: Memoizado para consistencia y SEO
    const altText = useMemo(() => {
        return `${auto.marca} ${auto.modelo} - ${auto.año || auto.anio}`
    }, [auto.marca, auto.modelo, auto.año, auto.anio])
    
    return (
        <div 
            className={styles.card}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick()
                }
            }}
            aria-label={`Ver detalles de ${auto.marca} ${auto.modelo}`}
        >
            {/* 
                ✅ CONTENEDOR DE IMAGEN
                
                Este contenedor tiene:
                - aspect-ratio: 16/9 (define altura desde CSS)
                - flex-shrink: 0 (previene colapso en flexbox)
                - contain: layout style paint (optimización)
                
                Compatible con wrappers internos de Cloudinary:
                - CloudinaryImage renderiza <div className="imageContainer"> dentro
                - Ese wrapper contiene placeholder + imagen (ambos position: absolute)
                - Nuestro CSS asegura que el contenedor NO colapsa incluso si los hijos no aportan altura
            */}
            <div className={styles['card__image-container']}>
                <CloudinaryImage
                    image={primaryImage}
                    alt={altText}
                    variant="fluid"
                    widths={IMAGE_WIDTHS.card}
                    sizes={IMAGE_SIZES.card}
                    
                    /* ✅ LAZY LOADING: Automático con IntersectionObserver */
                    loading="lazy"
                    
                    /* ✅ PRIORIDAD: auto (el navegador decide) */
                    fetchpriority="auto"
                    
                    /* ✅ CALIDAD: eco (80%) - Balance entre calidad y tamaño */
                    qualityMode="eco"
                    
                    /* ✅ PLACEHOLDER: Blur automático habilitado por defecto */
                    showPlaceholder={true}
                    
                    /* ✅ CLASE CSS: Se aplica al wrapper interno .imageContainer */
                    className={styles['card__image']}
                />
            </div>
            
            {/* Resto del contenido de la card... */}
        </div>
    )
})
```

### Flujo de Renderizado

1. **Inicial**: `.card__image-container` tiene `aspect-ratio: 16/9` → reserva espacio inmediatamente
2. **Cloudinary renderiza**: `<div class="imageContainer">` dentro del contenedor
3. **Placeholder**: Se muestra blur mientras carga (position: absolute, no afecta layout)
4. **Imagen carga**: Fade-in suave, placeholder desaparece
5. **Hover**: Zoom sutil activado con `will-change: transform` (GPU)

### Compatibilidad con Wrappers de Cloudinary

El CSS está diseñado para funcionar con esta estructura DOM:

```html
.card__image-container          <!-- Nuestro CSS: aspect-ratio + flex-shrink -->
  └─ .imageContainer            <!-- Cloudinary wrapper: height: 100% + aspect-ratio fallback -->
      ├─ .placeholder           <!-- position: absolute, no aporta altura -->
      └─ .image                 <!-- position: absolute, no aporta altura -->
```

**Por qué funciona:**
- `.card__image-container` tiene altura definida desde `aspect-ratio`
- `.imageContainer` tiene `height: 100%` (heredado) + `aspect-ratio: 16/9` (fallback)
- Las imágenes absolutas no afectan el layout, pero el contenedor ya tiene altura
- `flex-shrink: 0` previene contracción incluso durante lazy loading

