# Plan Técnico: Optimización de Imágenes con Cloudinary

## Contexto Actual
- **Frontend**: Solo consume 1 URL de Cloudinary que viene del backend
- **Sin optimización**: No usa `srcset`, `sizes`, ni variantes por ancho
- **Backend**: Sube/recibe imágenes y devuelve URL (no `public_id`)
- **Cloudinary**: Operativo, sin presets avanzados ni transformaciones nombradas
- **Volumen**: ~50-60 autos, ~8 fotos por auto + ~10 extras

## Objetivo General
Diseñar un plan **simple, profesional y performante** para:
1. Subir 1 original a Cloudinary de forma segura
2. Servir variantes responsivas (320/640/1280/1920) con `srcset/sizes`
3. Mantener buena calidad/peso (WebP/AVIF/JPG con `f_auto,q_auto`)
4. Definir Eager solo donde mejore LCP (hero)
5. Sin sobre-ingeniería, con pasos claros y migración suave

## Principios y Restricciones
- **Prioridad**: Rendimiento (LCP/CLS), claridad, mantenibilidad
- **Evitar sobre-ingeniería**: Lo mínimo necesario para hacer bien las cosas
- **Preferir estándares**: `srcset/sizes`, `f_auto,q_auto`, `c_limit`/`c_fill,g_auto`
- **Seguridad**: Uploads **firmados** (no unsigned en producción)
- **Cloudinary**: **On-the-fly** como base; **Eager solo** para el hero (1280)
- **Mantener compatibilidad**: Transición en fases (no romper el front actual)

---

## 1. Arquitectura Propuesta (Alto Nivel)

### Roles y Responsabilidades

**FRONTEND (Admin/Público):**
- **Admin**: Subida directa a Cloudinary con firma del backend
- **Público**: Consumo de imágenes optimizadas con `srcset/sizes`
- **Componentes**: `<ResponsiveImage>`, `<ImageCarousel>` optimizado

**BACKEND:**
- **Firma de uploads**: Generar parámetros firmados para Cloudinary
- **Metadatos**: Guardar `public_id`, `alt`, `posicion`, dimensiones
- **Endpoints**: Upload firmado, registro de foto, borrado, reorden

**Cloudinary:**
- **Storage**: Almacenamiento seguro con folder structure
- **Transformaciones**: On-the-fly con `f_auto,q_auto`
- **Eager**: Solo para hero (1280px)

### Flujo de Subida Recomendado

```
Admin Frontend → Solicitar firma al Backend → Backend genera parámetros firmados
→ Frontend sube directo a Cloudinary → Cloudinary devuelve public_id
→ Frontend registra foto en Backend → Backend guarda metadatos en DB
```

**Alternativa "Proxy" (NO recomendada):**
- Backend recibe archivo → Backend sube a Cloudinary
- Más lento, consume más recursos del servidor

---

## 2. Plan de Migración por Fases

### Fase 0: Estado Actual (Sin Cambios)
- ✅ **Mantener**: URLs actuales funcionando
- ✅ **No romper**: Frontend sigue consumiendo URLs del backend
- ✅ **Preparar**: Configurar Cloudinary básico

### Fase 1: Backend Expone `public_id` (1-2 días)
- ✅ **Backend**: Modificar respuesta para incluir `public_id` además de URL
- ✅ **Estrategia interina**: Extraer `public_id` de URL existente si es necesario
- ✅ **Frontend**: No cambia, sigue usando URLs

**Ejemplo de respuesta actual → nueva:**
```javascript
// ANTES
{
  fotoPrincipal: { url: "https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123.jpg" }
}

// DESPUÉS (Fase 1)
{
  fotoPrincipal: { 
    url: "https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123.jpg",
    public_id: "vehicles/auto123"
  }
}
```

### Fase 2: Frontend Introduce `srcset/sizes` (3-4 días)
- ✅ **Helper**: Crear `cloudinaryUrl(publicId, options)`
- ✅ **Componente**: `<ResponsiveImage>` con `srcset/sizes`
- ✅ **Migración gradual**: CardAuto → ImageCarousel → Detalle
- ✅ **Fallback**: Si no hay `public_id`, usar URL actual

### Fase 3: Eager para Hero (1 día)
- ✅ **Preset**: Configurar Eager 1280px para hero
- ✅ **Aplicar**: Solo en Home y página de detalle
- ✅ **Medir**: LCP antes/después

### Fase 4: Limpieza y Consolidación (1 día)
- ✅ **Remover**: Código de URLs antiguas
- ✅ **Optimizar**: Eliminar fallbacks innecesarios
- ✅ **Documentar**: Actualizar README

---

## 3. Diseño de Datos (Mínimo)

### Estructura en Base de Datos por Foto

```javascript
// Tabla: vehicle_images
{
  id: "uuid",
  vehicle_id: "vehicle_uuid",
  public_id: "vehicles/auto123_photo1", // ✅ CLAVE: Solo esto necesitas
  alt: "Vista frontal del Toyota Corolla 2020",
  position: 1, // Orden de visualización
  width: 1920, // Opcional: para evitar CLS
  height: 1080, // Opcional: para evitar CLS
  is_hero: false, // Para identificar imagen principal
  created_at: "2024-01-01T00:00:00Z"
}
```

### Por Qué NO Guardar 4 URLs Fijas

❌ **Problemas de guardar URLs fijas:**
- **Rigidez**: No puedes cambiar transformaciones sin migrar DB
- **Espacio**: 4 URLs × 8 fotos × 60 autos = 1920 URLs en DB
- **Mantenimiento**: Cambiar calidad/formato requiere actualizar todas las URLs
- **Flexibilidad**: No puedes experimentar con nuevos tamaños

✅ **Ventajas de guardar solo `public_id`:**
- **Flexibilidad**: Cambias transformaciones sin tocar DB
- **Eficiencia**: 1 `public_id` genera infinitas variantes
- **Mantenimiento**: Cambios centralizados en Cloudinary
- **Experimentos**: Puedes probar nuevos tamaños sin migración

---

## 4. Configuración Cloudinary

### Upload Preset Recomendado

```javascript
// Preset: "indiana_vehicles_signed"
{
  folder: "vehicles",
  use_filename: true,
  unique_filename: true,
  overwrite: false,
  resource_type: "image",
  allowed_formats: ["jpg", "jpeg", "png", "webp"],
  max_file_size: 10485760, // 10MB
  max_image_width: 4000,
  max_image_height: 4000,
  eager: "w_1280,h_720,c_fill,g_auto,f_auto,q_auto", // Solo para hero
  eager_async: true
}
```

### Transformaciones de Entrega

**Base (para todas las imágenes):**
```
f_auto,q_auto,c_limit
```

**Variantes por tamaño:**
- **320px**: `w_320,f_auto,q_auto,c_limit`
- **640px**: `w_640,f_auto,q_auto,c_limit`
- **1280px**: `w_1280,f_auto,q_auto,c_limit`
- **1920px**: `w_1920,f_auto,q_auto,c_limit`

**Para hero específico:**
- **Hero 1280px**: `w_1280,h_720,c_fill,g_auto,f_auto,q_auto`

### Eager Exacto para Hero

```javascript
// String exacto para Eager
"w_1280,h_720,c_fill,g_auto,f_auto,q_auto"

// Explicación:
// w_1280: Ancho 1280px
// h_720: Alto 720px (16:9)
// c_fill: Crop fill (mantiene ratio, corta si es necesario)
// g_auto: Gravity automática (centro inteligente)
// f_auto: Formato automático (WebP/AVIF según soporte)
// q_auto: Calidad automática (optimiza según contenido)
```

### Strict Transformations

**Recomendación: ENCENDIDO**

✅ **Ventajas:**
- **Seguridad**: Solo transformaciones permitidas
- **Performance**: URLs más cortas y eficientes
- **Control**: Evita transformaciones no deseadas

❌ **Desventajas:**
- **Rigidez**: Debes definir todas las transformaciones necesarias
- **Mantenimiento**: Cambios requieren actualizar preset

**Configuración recomendada:**
```javascript
// En Cloudinary Dashboard > Settings > Security
strict_transformations: true
allowed_transformations: [
  "w_320,f_auto,q_auto,c_limit",
  "w_640,f_auto,q_auto,c_limit", 
  "w_1280,f_auto,q_auto,c_limit",
  "w_1920,f_auto,q_auto,c_limit",
  "w_1280,h_720,c_fill,g_auto,f_auto,q_auto"
]
```

---

## 5. Cambios en Backend (Mínimos y Concretos)

### Endpoint para Firmar Uploads

```javascript
// POST /api/cloudinary/sign-upload
{
  "timestamp": 1640995200,
  "signature": "abc123...",
  "cloud_name": "indiana",
  "api_key": "123456789",
  "upload_preset": "indiana_vehicles_signed"
}
```

**Implementación mínima:**
```javascript
// Backend: Express.js
app.post('/api/cloudinary/sign-upload', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, upload_preset: 'indiana_vehicles_signed' },
    process.env.CLOUDINARY_API_SECRET
  )
  
  res.json({
    timestamp,
    signature,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    upload_preset: 'indiana_vehicles_signed'
  })
})
```

### Endpoint para Registrar Foto

```javascript
// POST /api/vehicles/:id/images
{
  "public_id": "vehicles/auto123_photo1",
  "alt": "Vista frontal del Toyota Corolla 2020",
  "position": 1,
  "width": 1920,
  "height": 1080,
  "is_hero": false
}
```

### Endpoint para Borrado

```javascript
// DELETE /api/vehicles/:id/images/:imageId
// También borra de Cloudinary usando destroy()
```

### Estrategia Interina: Extraer `public_id` de URL

```javascript
// Función helper para extraer public_id de URL existente
function extractPublicIdFromUrl(url) {
  // https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123.jpg
  // → vehicles/auto123
  
  const match = url.match(/\/upload\/v\d+\/(.+?)\.(jpg|jpeg|png|webp)/)
  return match ? match[1] : null
}

// Aplicar en respuesta actual
{
  fotoPrincipal: { 
    url: "https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123.jpg",
    public_id: extractPublicIdFromUrl("https://res.cloudinary.com/indiana/image/upload/v1234567890/vehicles/auto123.jpg")
  }
}
```

---

## 6. Cambios en Frontend (Detallado)

### Helper `cloudinaryUrl`

```javascript
// src/utils/cloudinaryUrl.js
const CLOUDINARY_CLOUD_NAME = 'indiana' // Tu cloud_name

export function cloudinaryUrl(publicId, options = {}) {
  if (!publicId) return ''
  
  const {
    width,
    height,
    crop = 'limit',
    gravity = 'auto',
    format = 'auto',
    quality = 'auto',
    ratio
  } = options
  
  let transformations = []
  
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (ratio) transformations.push(`ar_${ratio}`)
  if (crop) transformations.push(`c_${crop}`)
  if (gravity) transformations.push(`g_${gravity}`)
  if (format) transformations.push(`f_${format}`)
  if (quality) transformations.push(`q_${quality}`)
  
  const transformString = transformations.join(',')
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`
}

// Helper para srcset
export function generateSrcSet(publicId, widths = [320, 640, 1280, 1920], options = {}) {
  return widths
    .map(width => `${cloudinaryUrl(publicId, { ...options, width })} ${width}w`)
    .join(', ')
}
```

### Componente `<ResponsiveImage>`

```javascript
// src/components/ui/ResponsiveImage/ResponsiveImage.jsx
import React, { memo } from 'react'
import { cloudinaryUrl, generateSrcSet } from '@utils/cloudinaryUrl'

export const ResponsiveImage = memo(({
  publicId,
  alt = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  widths = [320, 640, 1280, 1920],
  crop = 'limit',
  ratio,
  loading = 'lazy',
  decoding = 'async',
  fetchpriority,
  className = '',
  style = {},
  onLoad,
  onError,
  ...props
}) => {
  if (!publicId) return null
  
  const src = cloudinaryUrl(publicId, { 
    width: widths[widths.length - 1], // Fallback al tamaño más grande
    crop,
    ratio 
  })
  
  const srcSet = generateSrcSet(publicId, widths, { crop, ratio })
  
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchpriority={fetchpriority}
      className={className}
      style={style}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  )
})
```

### Tabla de Breakpoints → Sizes

```javascript
// src/constants/imageSizes.js
export const IMAGE_SIZES = {
  // CardAuto (grid de 3 columnas)
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  
  // ImageCarousel (ancho completo)
  carousel: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw',
  
  // Hero (ancho completo con max-width)
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px',
  
  // Detalle (ancho completo)
  detail: '100vw'
}

export const IMAGE_WIDTHS = {
  // Para cards (más pequeños)
  card: [320, 640, 800],
  
  // Para carrusel (medianos)
  carousel: [320, 640, 1280],
  
  // Para hero (grandes)
  hero: [640, 1280, 1920],
  
  // Para detalle (completos)
  detail: [320, 640, 1280, 1920]
}
```

### Uso de `loading`, `decoding`, `fetchpriority`

```javascript
// Cuándo usar cada atributo:

// loading="eager" + fetchpriority="high"
// ✅ Solo para hero (primera imagen visible)
<ResponsiveImage
  publicId={heroImage.public_id}
  loading="eager"
  fetchpriority="high"
  sizes={IMAGE_SIZES.hero}
  widths={IMAGE_WIDTHS.hero}
/>

// loading="lazy" (default)
// ✅ Para todas las demás imágenes
<ResponsiveImage
  publicId={image.public_id}
  loading="lazy"
  sizes={IMAGE_SIZES.card}
  widths={IMAGE_WIDTHS.card}
/>

// decoding="async" (default)
// ✅ Siempre usar para mejor performance
```

### Cómo Evitar CLS (Cumulative Layout Shift)

```javascript
// Opción 1: Usar width/height del original
<ResponsiveImage
  publicId={image.public_id}
  width={image.width}  // Del backend
  height={image.height} // Del backend
  style={{ aspectRatio: `${image.width}/${image.height}` }}
/>

// Opción 2: Aspect-ratio CSS fijo
<ResponsiveImage
  publicId={image.public_id}
  style={{ aspectRatio: '16/9' }} // Para hero
/>

// Opción 3: Container con padding-bottom
<div style={{ 
  position: 'relative',
  paddingBottom: '56.25%' // 16:9
}}>
  <ResponsiveImage
    publicId={image.public_id}
    style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  />
</div>
```

---

## 7. Crops (Estrategia)

### Cuándo Usar `c_limit` vs `c_fill,g_auto`

**`c_limit` (Recomendado para la mayoría):**
- ✅ **Detalle fluido**: Mantiene proporciones originales
- ✅ **Sin cortes**: Nunca corta partes de la imagen
- ✅ **Flexible**: Se adapta a cualquier ratio de pantalla
- ✅ **Uso**: Cards, carrusel, galería

```javascript
// Ejemplo: CardAuto
<ResponsiveImage
  publicId={image.public_id}
  crop="limit"
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

**`c_fill,g_auto` (Solo para casos específicos):**
- ✅ **Hero fijo**: Cuando necesitas ratio exacto (16:9)
- ✅ **Banners**: Cuando el diseño requiere dimensiones fijas
- ✅ **Thumbnails**: Para miniaturas cuadradas (1:1)

```javascript
// Ejemplo: Hero con ratio fijo
<ResponsiveImage
  publicId={heroImage.public_id}
  width={1280}
  height={720}
  crop="fill"
  gravity="auto"
  sizes="(max-width: 768px) 100vw, 100vw"
/>
```

### Ratios Definidos

```javascript
// src/constants/imageRatios.js
export const IMAGE_RATIOS = {
  // Para hero (16:9)
  hero: '16:9',
  
  // Para cards (4:3 - más cuadrado)
  card: '4:3',
  
  // Para miniaturas (1:1 - cuadrado)
  thumbnail: '1:1',
  
  // Para banners (21:9 - ultra wide)
  banner: '21:9'
}

// Uso en componentes
<ResponsiveImage
  publicId={image.public_id}
  ratio={IMAGE_RATIOS.hero}
  crop="fill"
  gravity="auto"
/>
```

### Criterios Prácticos para Elegir

**Usa `c_limit` cuando:**
- La imagen debe mostrarse completa
- El contenedor es flexible
- No importa si hay espacios en blanco
- Es una galería o detalle de producto

**Usa `c_fill,g_auto` cuando:**
- Necesitas llenar un contenedor exacto
- El diseño requiere ratio específico
- Es un hero o banner principal
- Quieres evitar espacios en blanco

---

## 8. Eager y/o Pre-warm

### Dónde Conviene Eager

**✅ Solo para Hero (1280px):**
- **Home**: Primera imagen del carrusel principal
- **Detalle**: Imagen principal del vehículo
- **LCP crítico**: Estas imágenes impactan directamente el LCP

**❌ NO usar Eager para:**
- Cards en grid (no son LCP críticas)
- Miniaturas (se cargan después)
- Imágenes secundarias (no bloquean renderizado)

### String Exacto para Eager

```javascript
// En el upload preset de Cloudinary
"w_1280,h_720,c_fill,g_auto,f_auto,q_auto"

// Explicación detallada:
// w_1280: Ancho 1280px (balance entre calidad y velocidad)
// h_720: Alto 720px (ratio 16:9)
// c_fill: Crop fill (llena el contenedor)
// g_auto: Gravity automática (centro inteligente)
// f_auto: Formato automático (WebP/AVIF según soporte)
// q_auto: Calidad automática (optimiza según contenido)
```

### Alternativa: Pre-warm On-the-fly

**Si NO quieres usar Eager (más flexible):**

```javascript
// Función para pre-warm después del upload
async function preWarmImage(publicId) {
  const widths = [320, 640, 1280, 1920]
  
  // Hacer HEAD requests para pre-warm
  const preWarmPromises = widths.map(width => {
    const url = cloudinaryUrl(publicId, { width })
    return fetch(url, { method: 'HEAD' })
  })
  
  try {
    await Promise.all(preWarmPromises)
    console.log('✅ Imagen pre-warmed exitosamente')
  } catch (error) {
    console.warn('⚠️ Error en pre-warm:', error)
  }
}

// Usar después del upload
const uploadResult = await uploadToCloudinary(file)
await preWarmImage(uploadResult.public_id)
```

### Comparación: Eager vs Pre-warm

| Aspecto | Eager | Pre-warm |
|---------|-------|----------|
| **Velocidad** | ⚡ Instantáneo | 🐌 Requiere request |
| **Flexibilidad** | ❌ Fijo en upload | ✅ Dinámico |
| **Storage** | 💾 Usa más espacio | 💾 Solo original |
| **Costo** | 💰 Más caro | 💰 Solo cuando se usa |
| **Mantenimiento** | 🔧 Cambios en preset | 🔧 Cambios en código |

**Recomendación**: Usa **Eager solo para hero** (1280px). Para el resto, on-the-fly es más flexible.

---

## 9. Métricas y Pruebas

### Qué Medir (Antes/Después)

**Core Web Vitals:**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms

**Métricas Específicas de Imágenes:**
- **Tiempo de carga de hero**: Medir desde request hasta renderizado
- **Tamaño de archivo**: Comparar antes/después por tamaño de pantalla
- **Formato entregado**: Verificar WebP/AVIF en navegadores compatibles
- **Requests HTTP**: Contar requests de imágenes por página

### Herramientas de Medición

**Lighthouse (Chrome DevTools):**
```bash
# Medir antes
lighthouse https://tu-sitio.com --output=json --output-path=before.json

# Medir después
lighthouse https://tu-sitio.com --output=json --output-path=after.json
```

**WebPageTest:**
- **URL**: https://webpagetest.org
- **Configuración**: 3G, Mobile, Desktop
- **Métricas**: LCP, CLS, First Byte Time

**Chrome DevTools Network:**
- Filtrar por "Img"
- Verificar `Content-Type` (debe ser `image/webp` o `image/avif`)
- Medir `DOMContentLoaded` vs `Load`

### Plan de Rollback Simple

**Si algo rompe:**

1. **Rollback inmediato** (5 minutos):
   ```javascript
   // En el helper cloudinaryUrl
   if (process.env.ROLLBACK_IMAGES === 'true') {
     return originalUrl // Usar URL original
   }
   ```

2. **Rollback de base de datos** (15 minutos):
   ```sql
   -- Restaurar estructura anterior
   ALTER TABLE vehicle_images DROP COLUMN public_id;
   ```

3. **Rollback de Cloudinary** (30 minutos):
   - Desactivar preset con Eager
   - Volver a configuración anterior

**Proceso de rollback:**
```bash
# 1. Activar rollback
export ROLLBACK_IMAGES=true

# 2. Deploy rápido
npm run build && npm run deploy

# 3. Verificar funcionamiento
curl -I https://tu-sitio.com

# 4. Investigar problema
# 5. Corregir y volver a deploy
```

### Checklist de Pruebas

**Antes del deploy:**
- [ ] Imágenes se cargan correctamente
- [ ] `srcset` funciona en diferentes tamaños de pantalla
- [ ] Fallback funciona si no hay `public_id`
- [ ] No hay errores en consola
- [ ] Lighthouse score > 90

**Después del deploy:**
- [ ] LCP mejoró (medir con Lighthouse)
- [ ] CLS no empeoró
- [ ] Imágenes se ven correctamente en móvil/desktop
- [ ] No hay 404s en Network tab
- [ ] WebP/AVIF se sirve correctamente

---

## 10. Checklist de Entrega (Accionable)

### Fase 1: Preparación (1 día)
- [ ] **Configurar Cloudinary**
  - [ ] Crear preset `indiana_vehicles_signed`
  - [ ] Configurar folder `vehicles`
  - [ ] Activar Strict Transformations
  - [ ] Definir transformaciones permitidas

- [ ] **Backend: Endpoint de firma**
  - [ ] `POST /api/cloudinary/sign-upload`
  - [ ] Generar timestamp y signature
  - [ ] Devolver parámetros firmados

- [ ] **Backend: Modificar respuesta**
  - [ ] Incluir `public_id` en respuesta actual
  - [ ] Función `extractPublicIdFromUrl()` como fallback
  - [ ] Probar que no rompe frontend actual

### Fase 2: Frontend Helper (1 día)
- [ ] **Crear `cloudinaryUrl.js`**
  - [ ] Función `cloudinaryUrl(publicId, options)`
  - [ ] Función `generateSrcSet(publicId, widths)`
  - [ ] Constantes para cloud_name

- [ ] **Crear `ResponsiveImage.jsx`**
  - [ ] Componente con `srcset/sizes`
  - [ ] Props: `publicId`, `alt`, `sizes`, `widths`
  - [ ] Fallback a URL original si no hay `public_id`

### Fase 3: Migración Gradual (2 días)
- [ ] **Migrar CardAuto**
  - [ ] Reemplazar `<img>` por `<ResponsiveImage>`
  - [ ] Usar `IMAGE_SIZES.card` y `IMAGE_WIDTHS.card`
  - [ ] Probar en diferentes breakpoints

- [ ] **Migrar ImageCarousel**
  - [ ] Reemplazar imágenes del carrusel
  - [ ] Usar `IMAGE_SIZES.carousel`
  - [ ] Mantener funcionalidad de navegación

- [ ] **Migrar página de detalle**
  - [ ] Hero con `loading="eager"` y `fetchpriority="high"`
  - [ ] Galería con `loading="lazy"`
  - [ ] Usar `IMAGE_SIZES.detail`

### Fase 4: Optimización Hero (1 día)
- [ ] **Configurar Eager**
  - [ ] Agregar Eager al preset: `w_1280,h_720,c_fill,g_auto,f_auto,q_auto`
  - [ ] Aplicar solo a imágenes marcadas como `is_hero: true`
  - [ ] Medir LCP antes/después

- [ ] **Prevenir CLS**
  - [ ] Agregar `aspect-ratio` CSS
  - [ ] Usar `width/height` del backend si está disponible
  - [ ] Probar en diferentes dispositivos

### Fase 5: Testing y Deploy (1 día)
- [ ] **Pruebas locales**
  - [ ] Lighthouse score > 90
  - [ ] Imágenes se cargan en móvil/desktop
  - [ ] `srcset` funciona correctamente
  - [ ] No hay errores en consola

- [ ] **Deploy gradual**
  - [ ] Deploy a staging
  - [ ] Pruebas en staging
  - [ ] Deploy a producción
  - [ ] Monitorear métricas

- [ ] **Verificación post-deploy**
  - [ ] Lighthouse en producción
  - [ ] WebPageTest
  - [ ] Verificar WebP/AVIF en Network tab
  - [ ] Confirmar mejora en LCP

### Rollback Plan (Si algo falla)
- [ ] **Rollback inmediato**
  - [ ] `export ROLLBACK_IMAGES=true`
  - [ ] Deploy rápido
  - [ ] Verificar funcionamiento

- [ ] **Investigación**
  - [ ] Revisar logs de error
  - [ ] Identificar problema específico
  - [ ] Corregir y volver a deploy

---

## Resumen Ejecutivo

### Puntos Clave del Plan:

1. **Migración en 4 fases** (5-6 días total) para transición suave
2. **Arquitectura mínima**: Solo `public_id` en DB, transformaciones on-the-fly
3. **Eager solo para hero** (1280px) para optimizar LCP
4. **Componente `<ResponsiveImage>`** con `srcset/sizes` automático
5. **Rollback plan** simple para seguridad

### Beneficios Esperados:

- **LCP mejorado**: 20-40% más rápido con Eager + WebP/AVIF
- **CLS reducido**: Aspect-ratio CSS + dimensiones del backend
- **Flexibilidad**: Cambios de transformación sin migración de DB
- **Mantenibilidad**: Código centralizado y reutilizable

### Próximos Pasos:

1. **Completar datos técnicos** que mencionaste (cloud_name, breakpoints, etc.)
2. **Comenzar con Fase 1**: Configurar Cloudinary y endpoint de firma
3. **Implementar gradualmente** siguiendo el checklist

---

*Documento generado el: $(date)*
*Versión: 1.0*
*Autor: Consultor Técnico*
