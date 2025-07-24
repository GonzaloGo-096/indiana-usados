# Integración de CDN con Backend para Imágenes - Indiana Usados

## Descripción
Guía para conectar el backend y el frontend con un CDN (Cloudinary, AWS CloudFront, Imgix, etc.) para servir imágenes optimizadas en Indiana Usados.

---

## Flujo Recomendado
1. **Backend** devuelve rutas simples de imágenes (ej: `vehicles/auto.jpg`).
2. **Frontend** transforma esas rutas en URLs optimizadas del CDN según contexto (tamaño, formato, calidad).
3. **CDN** entrega la imagen optimizada al usuario final.

---

## Opciones de Implementación

### Opción A (Recomendada): Backend como intermediario
- Backend solo almacena rutas simples.
- Frontend genera la URL CDN según necesidad.

### Opción B: Backend devuelve URLs completas
- Backend ya devuelve la URL optimizada del CDN.
- Menos flexible para cambios de optimización en frontend.

---

## Ejemplo de Flujo (Opción A)
```js
// Backend responde:
{
  id: 1,
  marca: "Toyota",
  imagen: "vehicles/toyota-corolla.jpg"
}

// Frontend procesa:
const url = generateCloudinaryUrl('vehicles/toyota-corolla.jpg', { width: 800, height: 600, quality: 85, format: 'webp' })
// Resultado: https://res.cloudinary.com/indiana-usados/image/upload/w_800,h_600,q_85,f_webp,c_fill,fl_progressive/vehicles/toyota-corolla.jpg
```

---

## Implementación Backend
- Almacenar solo rutas simples en la base de datos.
- Endpoints devuelven rutas relativas.
- (Opcional) Middleware para procesar imágenes antes de enviar.

---

## Implementación Frontend
- Usar un servicio para transformar rutas en URLs CDN.
- Ejemplo con Cloudinary:
```js
const generateCloudinaryUrl = (imagePath, { width, height, quality = 85, format = 'webp' }) => {
  const base = 'https://res.cloudinary.com/indiana-usados/image/upload'
  const params = [`w_${width}`, `h_${height}`, `q_${quality}`, `f_${format}`, 'c_fill', 'fl_progressive']
  return `${base}/${params.join(',')}/${imagePath}`
}
```

---

## Variables de Entorno
```
VITE_USE_CDN=true
VITE_CLOUDINARY_CLOUD_NAME=indiana-usados
```

---

## Ejemplos de CDNs
- **Cloudinary:** URLs con parámetros de transformación.
- **AWS CloudFront:** URLs con query params (`?w=800&h=600&f=webp`).
- **Imgix:** URLs con query params (`?w=800&h=600&fm=webp`).

---

## Buenas Prácticas
- Mantener rutas simples en backend para flexibilidad.
- Centralizar la lógica de generación de URLs CDN en el frontend.
- Usar variables de entorno para cambiar de CDN fácilmente.
- Implementar fallback a imágenes locales en desarrollo.

---

## Próximos Pasos
1. Configurar y subir imágenes al CDN.
2. Actualizar backend para devolver rutas simples.
3. Implementar lógica de generación de URLs en frontend.
4. Medir y monitorear el rendimiento.

---

**Ventajas:**
- Flexibilidad y escalabilidad.
- Optimización automática de imágenes.
- Fácil migración entre CDNs. 