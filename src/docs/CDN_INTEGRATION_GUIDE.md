# Guía de Integración y Optimización de Imágenes con CDN - Indiana Usados

## Descripción
Cómo integrar y configurar un CDN (Cloudinary, AWS CloudFront, Imgix, etc.) para optimizar la entrega de imágenes en Indiana Usados.

---

## 1. Configuración del Entorno
- Variables de entorno en `.env`:
```
VITE_USE_CDN=true
VITE_CLOUDINARY_CLOUD_NAME=indiana-usados
VITE_DEFAULT_IMAGE_QUALITY=85
VITE_DEFAULT_IMAGE_FORMAT=webp
```
- Para desarrollo, puedes usar `VITE_USE_CDN=false`.

---

## 2. Servicios de CDN Soportados
- **Cloudinary:** URLs con parámetros de transformación.
- **AWS CloudFront:** URLs con query params (`?w=800&h=600&f=webp`).
- **Imgix:** URLs con query params (`?w=800&h=600&fm=webp`).

---

## 3. Uso en Componentes

### Ejemplo básico
```js
import { OptimizedImage } from '../components/ui/OptimizedImage'
<OptimizedImage
  src="autoPruebaPrincipal"
  alt="Toyota Corolla"
  optimizationOptions={{ size: 'medium', format: 'webp', quality: 85 }}
  useCdn={true}
/>
```

### Imágenes locales
```js
<OptimizedImage
  src="/src/assets/fotos/auto-prueba-principal.webp"
  alt="Auto de prueba"
/>
```

---

## 4. Configuración y Agregado de Imágenes
- Agrega rutas en `src/config/images.js`.
- Usa helpers para obtener la URL optimizada:
```js
import { getOptimizedImage } from '../config/images'
const imageUrl = getOptimizedImage('nuevaImagen', { size: 'large', format: 'webp', quality: 90 })
```

---

## 5. Optimizaciones Avanzadas
- Imágenes responsive: helpers para `srcSet` y tamaños.
- Preload de imágenes críticas.
- Lazy loading inteligente.

---

## 6. Migración desde Imágenes Locales
1. Sube imágenes al CDN.
2. Actualiza rutas en la configuración.
3. Activa el uso de CDN en variables de entorno.

---

## 7. Monitoreo y Troubleshooting
- Medir tiempos de carga y comparar CDN vs local.
- Verificar generación de URLs y fallback automático.
- Usar logs para depurar problemas de carga.

---

## Buenas Prácticas
- Usa WebP como formato principal.
- Centraliza la lógica de optimización en helpers/servicios.
- Implementa fallback a imágenes locales si el CDN falla.
- Ajusta calidad y tamaño según contexto de uso.

---

## Conclusión
La integración con CDN permite entregar imágenes optimizadas, mejorar el rendimiento y escalar fácilmente. Sigue esta guía para una migración gradual y segura. 