# CAMBIOS REALIZADOS - PASOS 1 Y 2

## PASO 1 - Eliminación de timestamps en paths temporales

### Archivo: `src/utils/imageUtils.js`

#### ❌ ANTES (líneas 249, 258):
```javascript
path: `temp/${fieldName}_${Date.now()}_${file.name}`
```
**Problema**: Generaba paths diferentes cada vez, rompiendo caché de Cloudinary.

#### ✅ DESPUÉS:
```javascript
path: `temp/${fieldName}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
```
**Solución**: Path determinístico basado solo en fieldName y fileName sanitizado.

**Comentario agregado**: "El public_id lo define backend; este path temporal NO debe afectar el ID final en Cloudinary"

---

## PASO 2 - Selección determinística de imágenes

### Archivo: `src/config/images.js`

#### ❌ ANTES (línea 54):
```javascript
return images[Math.floor(Math.random() * images.length)]
```
**Problema**: Selección aleatoria generaba URLs inconsistentes entre recargas.

#### ✅ DESPUÉS:
```javascript
// Función hash determinística (djb2) para selección estable
function djb2(str) {
    let h = 5381
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) + h) + str.charCodeAt(i)
    }
    return h >>> 0
}

export function pickStable(arr, seedStr) {
    if (!arr?.length) return null
    const idx = djb2(seedStr) % arr.length
    return arr[idx]
}

export const getRandomCarouselImage = (options = {}) => {
    const images = getCarouselImages(options)
    const seed = options.seed || options.vehicleId || images[0]?.public_id || 'default'
    return pickStable(images, String(seed))
}
```
**Solución**: Hash determinístico que garantiza misma selección para mismo seed.

---

## PASO 3 - Caché en memoria para URLs de Cloudinary

### Archivo: `src/utils/cloudinaryUrl.js`

#### ✅ IMPLEMENTACIÓN DEL CACHÉ:

**Declaración del caché (líneas 13-15):**
```javascript
// Caché en memoria para URLs de Cloudinary (evita recomputes innecesarios)
const urlCache = new Map()
const URL_CACHE_MAX = 300
```

**Lógica de caché en cldUrl (líneas 54-76):**
```javascript
// Verificar caché antes de generar URL
const key = `${publicId}|${transformString}`
if (urlCache.has(key)) {
  return urlCache.get(key)
}

// ... generar URL ...

// Guardar en caché con límite simple (FIFO)
if (urlCache.size >= URL_CACHE_MAX) {
  const firstKey = urlCache.keys().next().value
  urlCache.delete(firstKey)
}
urlCache.set(key, url)
```

**Beneficio**: Evita recomputes de URLs idénticas, memoria controlada (300 URLs max).

---

## PASO 4 - OptimizedImage sin useEffect, con useMemo + atributos

### Archivo: `src/components/ui/OptimizedImage/OptimizedImage.jsx`

#### ❌ ANTES (regeneraba URLs en runtime):
```javascript
// useEffect problemático
useEffect(() => {
  const optimizedSrc = getOptimizedSrc()
  setState(prev => ({ ...prev, currentSrc: optimizedSrc }))
}, [src, format, useCdn, optimizationOptions, getOptimizedSrc])

// img sin atributos de performance
<img src={state.currentSrc} loading={lazy ? 'lazy' : 'eager'} />
```

#### ✅ DESPUÉS (URLs memoizadas, sin regeneración):
```javascript
// URLs generadas con useMemo (sin useEffect)
const optimizedSrc = useMemo(() => {
  if (effectivePublicId) {
    return cldUrl(effectivePublicId, { ...base, ...stableOpts })
  }
  // ... fallback logic
}, [effectivePublicId, base.variant, stableOpts, src, fallbackUrl, format, useCdn])

// img con atributos de performance (paridad con ResponsiveImage)
<img
  src={optimizedSrc}
  srcSet={optimizedSrcSet}
  loading={lazy ? 'lazy' : 'eager'}
  decoding="async"                    // ✅ AGREGADO
  fetchpriority={finalFetchpriority}  // ✅ AGREGADO
/>
```

**Beneficio**: URLs estables sin "parpadeos", atributos de performance consistentes.

---

## IMPACTO

- **Paso 1**: Paths temporales consistentes → public_id estable → URLs de Cloudinary idénticas
- **Paso 2**: Selección de imágenes determinística → URLs consistentes entre recargas
- **Paso 3**: Caché en memoria → Evita recomputes innecesarios de URLs
- **Paso 4**: URLs memoizadas → Sin regeneración en runtime, atributos de performance
- **Resultado**: Caché de Cloudinary efectivo y URLs predecibles
