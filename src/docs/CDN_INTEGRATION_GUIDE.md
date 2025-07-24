# Guía de Integración con CDN

## Descripción General

Esta guía explica cómo integrar y configurar CDN (Content Delivery Network) en el proyecto Indiana Usados para optimizar la entrega de imágenes.

## Configuración del Entorno

### 1. Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
# Configuración del entorno
VITE_ENVIRONMENT=development

# Configuración de CDN
VITE_USE_CDN=false

# Configuración de Cloudinary (ejemplo)
VITE_CLOUDINARY_CLOUD_NAME=indiana-usados
VITE_CLOUDINARY_API_KEY=your_api_key_here
VITE_CLOUDINARY_API_SECRET=your_api_secret_here

# Configuración de AWS CloudFront (ejemplo)
VITE_AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
VITE_AWS_REGION=us-east-1

# Configuración de optimización de imágenes
VITE_DEFAULT_IMAGE_QUALITY=85
VITE_DEFAULT_IMAGE_FORMAT=webp
```

### 2. Configuración para Producción

Para producción, crear `.env.production`:

```bash
VITE_ENVIRONMENT=production
VITE_USE_CDN=true
VITE_CLOUDINARY_CLOUD_NAME=indiana-usados-prod
```

## Servicios de CDN Soportados

### 1. Cloudinary

**Configuración:**
```javascript
// src/services/cdnService.js
const CDN_CONFIG = {
    primary: {
        baseUrl: 'https://res.cloudinary.com/indiana-usados/image/upload',
        transformations: {
            quality: 'auto',
            format: 'auto',
            fetchFormat: 'auto'
        }
    }
}
```

**Uso:**
```javascript
import { generateCdnUrl } from '../services/cdnService'

const optimizedUrl = generateCdnUrl('vehicles/toyota-corolla.jpg', {
    size: 'medium',
    format: 'webp',
    quality: 85
})
```

### 2. AWS CloudFront

**Configuración:**
```javascript
const CDN_CONFIG = {
    primary: {
        baseUrl: 'https://your-cloudfront-domain.cloudfront.net',
        transformations: {
            quality: '85',
            format: 'webp'
        }
    }
}
```

### 3. Imgix

**Configuración:**
```javascript
const CDN_CONFIG = {
    primary: {
        baseUrl: 'https://indiana-usados.imgix.net',
        transformations: {
            quality: '85',
            format: 'webp'
        }
    }
}
```

## Uso en Componentes

### 1. Uso Básico

```javascript
import { OptimizedImage } from '../components/ui/OptimizedImage'

<OptimizedImage
    src="autoPruebaPrincipal"  // Clave de imagen
    alt="Toyota Corolla"
    optimizationOptions={{
        size: 'medium',
        format: 'webp',
        quality: 85
    }}
    useCdn={true}  // Forzar uso de CDN
/>
```

### 2. Uso con URL Directa

```javascript
<OptimizedImage
    src="https://res.cloudinary.com/indiana-usados/image/upload/vehicles/toyota-corolla.jpg"
    alt="Toyota Corolla"
    optimizationOptions={{
        size: 'large',
        format: 'webp'
    }}
/>
```

### 3. Uso con Imágenes Locales

```javascript
<OptimizedImage
    src="/src/assets/fotos/auto-prueba-principal.webp"
    alt="Auto de prueba"
    // Las imágenes locales se mantienen sin cambios
/>
```

## Configuración de Imágenes

### 1. Agregar Nuevas Imágenes

```javascript
// src/config/images.js
const CDN_IMAGE_PATHS = {
    // Imágenes existentes
    autoPruebaPrincipal: 'vehicles/auto-prueba-principal.webp',
    autoPrueba2: 'vehicles/auto-pueba-2.webp',
    
    // Nueva imagen
    nuevaImagen: 'vehicles/nueva-imagen.webp'
}

const LOCAL_IMAGES = {
    // Importar nueva imagen local
    nuevaImagen: import('../assets/fotos/nueva-imagen.webp'),
    // ... otras imágenes
}
```

### 2. Usar en Componentes

```javascript
import { getOptimizedImage } from '../config/images'

// En el componente
const imageUrl = getOptimizedImage('nuevaImagen', {
    size: 'large',
    format: 'webp',
    quality: 90
})
```

## Optimizaciones Avanzadas

### 1. Imágenes Responsive

```javascript
import { getResponsiveImage } from '../config/images'

const responsiveImage = getResponsiveImage('autoPruebaPrincipal', [300, 600, 800, 1200], {
    format: 'webp',
    quality: 85
})

// Resultado:
// {
//   src: "https://cdn.com/vehicles/auto-prueba-principal.webp",
//   srcSet: "https://cdn.com/vehicles/auto-prueba-principal.webp 300w, ..."
// }
```

### 2. Preload de Imágenes Críticas

```javascript
import { preloadCdnImage } from '../services/cdnService'

// Preload imagen crítica
useEffect(() => {
    preloadCdnImage('autoPruebaPrincipal', {
        size: 'large',
        type: 'preload'
    })
}, [])
```

### 3. Lazy Loading Inteligente

```javascript
<OptimizedImage
    src="autoPruebaPrincipal"
    lazy={true}
    optimizationOptions={{
        size: 'medium',
        format: 'webp'
    }}
    onLoad={() => console.log('Imagen cargada')}
    onError={() => console.log('Error al cargar imagen')}
/>
```

## Migración desde Imágenes Locales

### 1. Subir Imágenes a CDN

```bash
# Usando Cloudinary CLI
cloudinary upload vehicles/auto-prueba-principal.webp

# Usando AWS CLI
aws s3 cp auto-prueba-principal.webp s3://indiana-usados-bucket/vehicles/
```

### 2. Actualizar Configuración

```javascript
// src/config/images.js
const CDN_IMAGE_PATHS = {
    autoPruebaPrincipal: 'vehicles/auto-prueba-principal.webp',
    // ... otras imágenes
}
```

### 3. Activar CDN

```bash
# En producción
VITE_USE_CDN=true
VITE_ENVIRONMENT=production
```

## Monitoreo y Métricas

### 1. Métricas de Rendimiento

```javascript
// Medir tiempo de carga de CDN vs local
const measureCdnPerformance = async (imageKey) => {
    const start = performance.now()
    
    const cdnUrl = getOptimizedImage(imageKey, { useCdn: true })
    const localUrl = getOptimizedImage(imageKey, { useCdn: false })
    
    // Comparar tiempos de carga
    const cdnTime = await measureLoadTime(cdnUrl)
    const localTime = await measureLoadTime(localUrl)
    
    console.log(`CDN: ${cdnTime}ms, Local: ${localTime}ms`)
}
```

### 2. Cache Hit Rate

```javascript
// Verificar cache de CDN
const checkCdnCache = (imageUrl) => {
    fetch(imageUrl, { method: 'HEAD' })
        .then(response => {
            const cacheStatus = response.headers.get('x-cache')
            console.log(`Cache status: ${cacheStatus}`)
        })
}
```

## Troubleshooting

### 1. Imágenes No Cargan

```javascript
// Verificar configuración de CDN
console.log('CDN Config:', CDN_CONFIG)
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT)
console.log('Use CDN:', import.meta.env.VITE_USE_CDN)
```

### 2. URLs Incorrectas

```javascript
// Verificar generación de URLs
const testUrl = generateCdnUrl('vehicles/test.jpg', {
    size: 'medium',
    format: 'webp'
})
console.log('Generated URL:', testUrl)
```

### 3. Fallback a Imágenes Locales

```javascript
// El sistema automáticamente usa imágenes locales si CDN falla
<OptimizedImage
    src="autoPruebaPrincipal"
    fallback={getOptimizedImage('defaultCarImage')}
    useCdn={true}
/>
```

## Mejores Prácticas

### 1. Optimización de Tamaños

```javascript
// Usar tamaños apropiados para cada contexto
const cardImage = getOptimizedImage('autoPruebaPrincipal', { size: 'medium' })
const detailImage = getOptimizedImage('autoPruebaPrincipal', { size: 'large' })
const thumbnailImage = getOptimizedImage('autoPruebaPrincipal', { size: 'thumbnail' })
```

### 2. Formatos Optimizados

```javascript
// Usar WebP como formato principal
const optimizedImage = getOptimizedImage('autoPruebaPrincipal', {
    format: 'webp',
    quality: 85
})
```

### 3. Lazy Loading

```javascript
// Usar lazy loading para imágenes no críticas
<OptimizedImage
    src="autoPruebaPrincipal"
    lazy={true}
    showSkeleton={true}
/>
```

## Conclusiones

La integración con CDN proporciona:

1. **Mejor rendimiento**: Entrega más rápida de imágenes
2. **Menor carga del servidor**: CDN maneja las imágenes
3. **Optimización automática**: Transformaciones en tiempo real
4. **Escalabilidad**: Manejo de tráfico global
5. **Flexibilidad**: Fácil cambio entre CDNs

Esta implementación permite migrar gradualmente de imágenes locales a CDN sin afectar la funcionalidad existente. 