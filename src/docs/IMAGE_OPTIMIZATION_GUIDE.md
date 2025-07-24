# Guía de Optimización de Imágenes

## Descripción General

El sistema de optimización de imágenes de Indiana Usados está diseñado para mejorar significativamente el rendimiento de carga de imágenes, reducir el uso de ancho de banda y proporcionar una mejor experiencia de usuario.

## Componentes Principales

### 1. Hook `useImageOptimization`

Hook personalizado que maneja toda la lógica de optimización de imágenes.

```javascript
import { useImageOptimization } from '../hooks'

const {
    isLoading,
    isLoaded,
    isError,
    currentSrc,
    imgRef,
    srcSet,
    preloadImage,
    reload
} = useImageOptimization({
    src: '/path/to/image.webp',
    alt: 'Descripción de la imagen',
    fallback: '/path/to/fallback.jpg',
    lazy: true,
    sizes: {
        sm: '300px',
        md: '600px',
        lg: '800px',
        xl: '1200px'
    },
    format: 'webp'
})
```

### 2. Componente `OptimizedImage`

Componente React optimizado que utiliza el hook de optimización.

```javascript
import { OptimizedImage } from '../components/ui'

<OptimizedImage
    src="/path/to/image.webp"
    alt="Descripción de la imagen"
    fallback="/path/to/fallback.jpg"
    className="custom-class"
    sizes={{
        sm: '300px',
        md: '600px',
        lg: '800px'
    }}
    format="webp"
    lazy={true}
    showSkeleton={true}
    onLoad={() => console.log('Imagen cargada')}
    onError={() => console.log('Error al cargar imagen')}
/>
```

### 3. Servicio `imageOptimizationService`

Servicio que proporciona utilidades para optimización de imágenes.

```javascript
import { 
    generateOptimizedUrl, 
    generateSrcSet, 
    preloadImage,
    getBestFormat,
    imageCache 
} from '../services/imageOptimizationService'

// Generar URL optimizada
const optimizedUrl = generateOptimizedUrl('/path/to/image.jpg', {
    width: 800,
    height: 600,
    format: 'webp',
    quality: 85
})

// Generar srcset para responsive
const srcSet = generateSrcSet('/path/to/image.jpg', [300, 600, 800, 1200], 'webp')

// Preload imagen crítica
preloadImage('/path/to/critical-image.webp', 'preload')
```

## Características Principales

### 1. Lazy Loading Inteligente

- **Intersection Observer**: Detecta cuando la imagen está cerca del viewport
- **Root Margin**: Precarga imágenes 50px antes de que sean visibles
- **Threshold**: Configurable para diferentes niveles de sensibilidad

### 2. Formatos Optimizados

- **WebP**: Formato moderno con mejor compresión
- **AVIF**: Formato de próxima generación (experimental)
- **JPEG**: Fallback para navegadores antiguos
- **Detección automática**: Detecta el mejor formato soportado

### 3. Imágenes Responsive

- **Srcset**: Genera automáticamente múltiples tamaños
- **Sizes**: Configuración flexible para diferentes breakpoints
- **Art Direction**: Diferentes imágenes para diferentes tamaños

### 4. Manejo de Errores

- **Fallback automático**: Imagen de respaldo cuando falla la principal
- **Skeleton de carga**: Placeholder animado durante la carga
- **Estados de error**: UI clara cuando hay problemas

### 5. Cache Inteligente

- **Cache en memoria**: Almacena URLs optimizadas
- **LRU Cache**: Elimina automáticamente entradas antiguas
- **Tamaño configurable**: Máximo 100 entradas por defecto

## Configuración

### Configuración Global

```javascript
// src/services/imageOptimizationService.js
const OPTIMIZATION_CONFIG = {
    formats: {
        webp: { quality: 85, supported: true },
        avif: { quality: 80, supported: false },
        jpeg: { quality: 90, supported: true }
    },
    sizes: {
        thumbnail: { width: 150, height: 150 },
        small: { width: 300, height: 300 },
        medium: { width: 600, height: 600 },
        large: { width: 800, height: 800 },
        xlarge: { width: 1200, height: 1200 }
    },
    lazyLoading: {
        rootMargin: '50px 0px',
        threshold: 0.1
    }
}
```

### Configuración por Componente

```javascript
// Configuración específica para CardAuto
const cardImageConfig = {
    sizes: {
        sm: '300px',
        md: '400px',
        lg: '500px'
    },
    format: 'webp',
    lazy: true,
    showSkeleton: true
}

// Configuración específica para detalle de vehículo
const detailImageConfig = {
    sizes: {
        sm: '600px',
        md: '800px',
        lg: '1200px'
    },
    format: 'webp',
    lazy: false, // Cargar inmediatamente para imágenes críticas
    showSkeleton: true
}
```

## Casos de Uso

### 1. Imágenes en Lista de Vehículos

```javascript
// CardAuto.jsx
<OptimizedImage
    src={auto.imagen}
    alt={`${auto.marca} ${auto.modelo}`}
    fallback={defaultCarImage}
    className={styles.image}
    sizes={{
        sm: '300px',
        md: '400px',
        lg: '500px'
    }}
    format="webp"
    lazy={true}
    showSkeleton={true}
/>
```

### 2. Imágenes Críticas (Above the Fold)

```javascript
// Hero image o imagen principal
<OptimizedImage
    src={heroImage}
    alt="Imagen principal"
    lazy={false} // Cargar inmediatamente
    sizes={{
        sm: '100vw',
        md: '100vw',
        lg: '1200px'
    }}
    format="webp"
    showSkeleton={false}
/>
```

### 3. Carrusel de Imágenes

```javascript
// ImageCarousel.jsx
{images.map((image, index) => (
    <OptimizedImage
        key={index}
        src={image}
        alt={`Imagen ${index + 1}`}
        fallback={defaultImage}
        className={styles.carouselImage}
        sizes={{
            sm: '100vw',
            md: '800px',
            lg: '1200px'
        }}
        format="webp"
        lazy={index === 0 ? false : true} // Solo la primera imagen carga inmediatamente
        showSkeleton={true}
    />
))}
```

## Mejores Prácticas

### 1. Selección de Formatos

```javascript
// Usar WebP como formato principal
const format = getBestFormat('webp') // Retorna 'webp', 'avif', o 'jpeg'

// Configurar fallbacks
const imageFormats = {
    webp: '/path/to/image.webp',
    jpeg: '/path/to/image.jpg'
}
```

### 2. Tamaños Responsive

```javascript
// Tamaños optimizados para diferentes dispositivos
const responsiveSizes = {
    mobile: '100vw',      // Pantalla completa en móvil
    tablet: '50vw',       // Mitad de pantalla en tablet
    desktop: '400px'      // Tamaño fijo en desktop
}
```

### 3. Preload de Imágenes Críticas

```javascript
// Preload imágenes importantes
useEffect(() => {
    if (isCriticalImage) {
        preloadImage(imageUrl, 'preload')
    }
}, [imageUrl, isCriticalImage])
```

### 4. Manejo de Errores

```javascript
// Configurar fallbacks apropiados
<OptimizedImage
    src={primaryImage}
    fallback={secondaryImage}
    onError={(error) => {
        console.error('Error loading image:', error)
        // Lógica adicional de manejo de errores
    }}
/>
```

## Métricas de Rendimiento

### 1. Métricas a Monitorear

- **LCP (Largest Contentful Paint)**: Tiempo de carga de la imagen más grande
- **CLS (Cumulative Layout Shift)**: Cambios de layout por carga de imágenes
- **Tamaño de archivo**: Reducción en bytes transferidos
- **Tiempo de carga**: Mejora en velocidad de carga

### 2. Herramientas de Medición

```javascript
// Medir tiempo de carga de imagen
const measureImageLoad = (imageUrl) => {
    const start = performance.now()
    
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
            const end = performance.now()
            resolve(end - start)
        }
        img.src = imageUrl
    })
}
```

## Troubleshooting

### 1. Imágenes que no cargan

```javascript
// Verificar soporte de formatos
const supportedFormats = detectFormatSupport()
console.log('Formatos soportados:', supportedFormats)

// Usar formato compatible
const compatibleFormat = getBestFormat('webp')
```

### 2. Problemas de rendimiento

```javascript
// Limpiar cache si es necesario
imageCache.clear()

// Verificar tamaño de cache
console.log('Cache size:', imageCache.cache.size)
```

### 3. Problemas de layout

```javascript
// Usar aspect-ratio CSS para evitar CLS
.image {
    aspect-ratio: 16/9;
    object-fit: cover;
}
```

## Conclusiones

El sistema de optimización de imágenes proporciona:

1. **Mejor rendimiento**: Reducción significativa en tiempo de carga
2. **Menor uso de ancho de banda**: Imágenes optimizadas y comprimidas
3. **Mejor UX**: Skeleton de carga y manejo de errores
4. **Responsive**: Imágenes adaptadas a diferentes dispositivos
5. **Escalable**: Fácil configuración y mantenimiento

Este sistema está diseñado para crecer con la aplicación y adaptarse a las necesidades futuras de optimización. 