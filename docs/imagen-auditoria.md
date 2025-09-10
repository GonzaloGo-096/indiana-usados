# Auditoría de Imágenes - Indiana Usados

## 1. Resumen Ejecutivo

**Framework/Build**: React 18 + Vite 5.0.12 + JavaScript (no TypeScript)
**SSR/SSG**: No (SPA con Vite)
**Imágenes**: Se usa `<img>` nativo, NO `<Image>` de Next.js
**Carga actual**: URLs directas de Cloudinary desde backend, sin `srcset/sizes`
**Backend**: Devuelve objetos con `.url` pero NO `public_id` (solo URLs completas)
**Riesgos principales**: Sin optimización responsive, sin `public_id`, overfetching en móvil, potencial CLS

## 2. Stack y Configuración

**Versiones**:
- Node: No especificado en package.json
- React: 18.2.0
- Vite: 5.0.12
- JavaScript (no TypeScript)

**Estructura relevante**:
```
src/
├── components/
│   ├── ui/OptimizedImage/     # Componente existente (no usado)
│   ├── ui/ImageCarousel/      # Carrusel principal
│   └── vehicles/Card/CardAuto/ # Cards del listado
├── pages/
│   ├── Home/                  # Página principal (básica)
│   └── VehiculoDetalle/       # Página de detalle
├── utils/imageUtils.js        # Helpers de imágenes
├── config/images.js           # Config de imágenes locales
└── constants/breakpoints.js   # Breakpoints CSS
```

**Styling**: CSS Modules + CSS Variables (no Tailwind)
**Breakpoints**: 576px, 768px, 992px, 1200px, 1400px

## 3. Contratos de Datos (API / Tipos)

**Endpoints principales**:
- `GET /photos/getallphotos` - Listado de vehículos
- `GET /photos/getonephoto/:id` - Detalle de vehículo
- `POST /photos/create` - Crear vehículo (admin)

**Shape actual del objeto imagen**:
```javascript
// Ejemplo real del mapper (src/mappers/vehicleMapper.js:190-200)
{
  fotoPrincipal: { url: "https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123.jpg" },
  fotoHover: { url: "https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123_hover.jpg" },
  fotosExtra: [
    { url: "https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123_extra1.jpg" }
  ]
}
```

**Tipos/Interfaces**: No hay TypeScript, solo JSDoc básico
**public_id**: ❌ NO viene del backend, solo URLs completas
**Dimensiones**: ❌ No se guardan width/height

## 4. Dónde se Renderizan Imágenes (Mapa de Uso)

### 4.1 CardAuto (Listado de vehículos)
**Archivo**: `src/components/vehicles/Card/CardAuto/CardAuto.jsx:171-188`
```javascript
<img 
    src={primaryImage} 
    alt={altText}
    className={`${styles['card__image']} ${styles['card__image_primary']}`}
    loading="lazy"
    decoding="async"
/>
```
- **Data source**: `auto.fotoPrincipal?.url || auto.imagen || '/src/assets/auto1.jpg'`
- **srcset/sizes**: ❌ No usa
- **Contenedor**: Fluido (sin aspect-ratio fijo)
- **CLS risk**: ⚠️ Alto (sin dimensiones)

### 4.2 ImageCarousel (Página de detalle)
**Archivo**: `src/components/ui/ImageCarousel/ImageCarousel.jsx:175-181`
```javascript
<img 
    src={allImages[currentIndex]} 
    alt={`${altText} ${currentIndex + 1} de ${allImages.length}`}
    className={styles.mainImage}
    loading="lazy"
    decoding="async"
/>
```
- **Data source**: Array procesado por `processImages(images)`
- **srcset/sizes**: ❌ No usa
- **Contenedor**: Fluido (sin aspect-ratio fijo)
- **CLS risk**: ⚠️ Alto (sin dimensiones)

### 4.3 OptimizedImage (No usado actualmente)
**Archivo**: `src/components/ui/OptimizedImage/OptimizedImage.jsx:172-182`
```javascript
<img
    src={state.currentSrc}
    alt={alt}
    srcSet={getSrcSet()}
    className={`${styles.image} ${className} ${state.isLoaded ? styles.loaded : ''}`}
    style={style}
    loading={lazy ? 'lazy' : 'eager'}
    onLoad={handleLoad}
    onError={handleError}
    {...props}
/>
```
- **srcset/sizes**: ✅ Sí usa (pero no se usa en producción)
- **Estado**: Componente existente pero no implementado

## 5. Breakpoints y "Sizes" Actuales

**Breakpoints reales** (src/constants/breakpoints.js):
- xs: 0px
- sm: 576px  
- md: 768px
- lg: 992px
- xl: 1200px
- 2xl: 1400px

**Análisis por vista**:

### Cards (Grid de 3 columnas)
- **Ancho máximo**: ~400px por card
- **Sizes propuesto**: `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`
- **Overfetching**: ⚠️ Sí (descarga imagen completa en móvil)

### Carrusel (Página detalle)
- **Ancho máximo**: ~800px en desktop
- **Sizes propuesto**: `(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw`
- **Overfetching**: ⚠️ Sí (descarga imagen completa en móvil)

### Hero (No existe actualmente)
- **Estado**: No hay hero definido en Home
- **Sizes propuesto**: `(max-width: 768px) 100vw, 100vw`

## 6. Helpers / Loaders Existentes

### Helpers Cloudinary
**Archivo**: `src/utils/imageUtils.js`
- `processImages()` - Convierte objetos a URLs
- `getCarouselImages()` - Extrae imágenes del vehículo
- `isValidImage()` - Valida estructura de imagen

**Archivo**: `src/config/images.js`
- `getOptimizedImage()` - Solo para imágenes locales
- `getResponsiveImage()` - Genera srcset (no usado)

### Transformaciones Cloudinary
**Estado actual**: ❌ No se usan transformaciones
- No hay `w_`, `c_`, `f_auto`, `q_auto` en URLs
- URLs son del tipo: `https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123.jpg`

### Loaders externos
- ❌ No se usa Next.js Image
- ❌ No hay loaders específicos
- ✅ Solo `<img>` nativo

## 7. Cloudinary y Envs

### Cloud Name
**Detectado**: `indiana` (hardcodeado en URLs)
**Envs**: No hay variables de entorno para Cloudinary
**Referencias**: 78 matches de "cloudinary" en el código

### Configuración actual
- **Strict Transformations**: No configurado
- **Named transformations**: No configurado  
- **Delivery firmado**: No configurado
- **Delivery type**: Solo `upload` (no `fetch`)

### URLs Cloudinary encontradas
```javascript
// Patrón típico en el código:
"https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123.jpg"
```

## 8. Riesgos y Edge Cases

### public_id faltante
- ❌ **Problema**: Backend NO devuelve `public_id`
- ⚠️ **Impacto**: No se pueden generar transformaciones dinámicas
- 🔧 **Solución**: Extraer de URL o modificar backend

### CLS (Cumulative Layout Shift)
- ⚠️ **Cards**: Sin dimensiones ni aspect-ratio
- ⚠️ **Carrusel**: Sin dimensiones ni aspect-ratio
- 🔧 **Solución**: Agregar `aspect-ratio` CSS o dimensiones del backend

### Alt text
- ✅ **Cards**: Tiene alt text (`${marca} ${modelo} - ${año}`)
- ✅ **Carrusel**: Tiene alt text (`${altText} ${currentIndex + 1} de ${allImages.length}`)

### Gravity innecesaria
- ❌ **No se usa**: No hay `g_auto` con `c_limit` (correcto)

### Dependencias problemáticas
- ❌ **No hay**: Sliders que fuercen tamaños raros
- ✅ **ImageCarousel**: Usa CSS fluido (compatible con responsive)

## 9. "Puntos de Inserción" (Dif-ready)

### 9.1 CardAuto
**Archivo**: `src/components/vehicles/Card/CardAuto/CardAuto.jsx:171-188`
**Reemplazar**:
```javascript
<img 
    src={primaryImage} 
    alt={altText}
    className={`${styles['card__image']} ${styles['card__image_primary']}`}
    loading="lazy"
    decoding="async"
/>
```
**Por**:
```javascript
<ResponsiveImage
    publicId={extractPublicId(primaryImage)}
    fallbackUrl={primaryImage}
    alt={altText}
    variant="card"
    className={`${styles['card__image']} ${styles['card__image_primary']}`}
    loading="lazy"
/>
```

**Props esperadas**:
- `publicId`: string (extraído de URL)
- `fallbackUrl`: string (URL actual como fallback)
- `variant`: "card" | "carousel" | "hero" | "detail"
- `alt`: string
- `className`: string
- `loading`: "lazy" | "eager"

### 9.2 ImageCarousel
**Archivo**: `src/components/ui/ImageCarousel/ImageCarousel.jsx:175-181`
**Reemplazar**:
```javascript
<img 
    src={allImages[currentIndex]} 
    alt={`${altText} ${currentIndex + 1} de ${allImages.length}`}
    className={styles.mainImage}
    loading="lazy"
    decoding="async"
/>
```
**Por**:
```javascript
<ResponsiveImage
    publicId={extractPublicId(allImages[currentIndex])}
    fallbackUrl={allImages[currentIndex]}
    alt={`${altText} ${currentIndex + 1} de ${allImages.length}`}
    variant="carousel"
    className={styles.mainImage}
    loading="lazy"
/>
```

### 9.3 Miniaturas del Carrusel
**Archivo**: `src/components/ui/ImageCarousel/ImageCarousel.jsx:252-258`
**Reemplazar**:
```javascript
<img 
    src={image} 
    alt={`Miniatura ${index + 1}`}
    className={styles.thumbnailImage}
    loading="lazy"
    decoding="async"
/>
```
**Por**:
```javascript
<ResponsiveImage
    publicId={extractPublicId(image)}
    fallbackUrl={image}
    alt={`Miniatura ${index + 1}`}
    variant="thumbnail"
    className={styles.thumbnailImage}
    loading="lazy"
/>
```

### Constantes a crear
```javascript
// src/constants/imageSizes.js
export const IMAGE_SIZES = {
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  carousel: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw',
  thumbnail: '(max-width: 768px) 20vw, 10vw',
  hero: '(max-width: 768px) 100vw, 100vw'
}

export const IMAGE_WIDTHS = {
  card: [320, 640, 800],
  carousel: [320, 640, 1280],
  thumbnail: [90, 180],
  hero: [640, 1280, 1920]
}
```

## 10. Preguntas Puntuales

1. **¿El Hero es 16:9 fijo?** 
   - **Respuesta inferida**: No hay hero definido actualmente en Home.jsx

2. **¿Necesito soporte 2x (retina) en hero?**
   - **Respuesta inferida**: Sí, incluir 1920px en IMAGE_WIDTHS.hero

3. **¿El backend puede devolver public_id?**
   - **Respuesta inferida**: No actualmente, necesita modificación

4. **¿Hay hero fijo en Home/Detalle?**
   - **Respuesta inferida**: No en Home, sí en Detalle (ImageCarousel)

5. **¿Breakpoints reales del layout?**
   - **Respuesta inferida**: 576px, 768px, 992px, 1200px, 1400px (confirmado en código)

---

**Conclusión**: El proyecto tiene una base sólida pero necesita implementación completa de `srcset/sizes` y extracción de `public_id` del backend para optimización real de imágenes.
