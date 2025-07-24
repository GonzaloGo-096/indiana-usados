# Arquitectura de Imágenes y CDN - Indiana Usados

## Descripción
Guía de la arquitectura para la gestión, optimización y entrega de imágenes usando CDN en Indiana Usados.

---

## 1. Esquema General
- **Frontend (React):** Renderiza imágenes, aplica optimización (lazy loading, responsive, fallback).
- **Backend (API):** Almacena rutas simples, expone endpoints, puede validar/subir imágenes.
- **CDN (Cloudinary, CloudFront, Imgix):** Entrega y transforma imágenes globalmente.

---

## 2. Flujo de Datos
1. Frontend solicita datos al backend.
2. Backend responde con rutas simples de imágenes.
3. Frontend genera URLs optimizadas del CDN según contexto.
4. CDN entrega la imagen optimizada al usuario.

---

## 3. Ejemplo de Uso
```js
// Backend responde:
{
  id: "123",
  title: "Toyota Corolla 2020",
  images: { main: "vehicles/123/main.jpg" }
}
// Frontend genera URL CDN:
const url = generateCloudinaryUrl('vehicles/123/main.jpg', { width: 800, format: 'webp' })
```

---

## 4. Responsabilidades
- **Frontend:**
  - Renderiza imágenes con componentes optimizados.
  - Aplica lazy loading, responsive, fallback.
- **Backend:**
  - Almacena rutas simples.
  - Expone endpoints para datos e imágenes.
- **CDN:**
  - Entrega imágenes optimizadas y cacheadas.

---

## 5. Buenas Prácticas
- Mantener rutas simples en backend.
- Centralizar la lógica de generación de URLs CDN en el frontend.
- Usar variables de entorno para cambiar de CDN fácilmente.
- Implementar fallback a imágenes locales en desarrollo.

---

## 6. Ventajas
- Separación clara de responsabilidades.
- Flexibilidad para cambiar de CDN o ajustar optimización.
- Mejor rendimiento y escalabilidad.

---

## 7. Próximos Pasos
1. Configurar y subir imágenes al CDN.
2. Actualizar backend para devolver rutas simples.
3. Implementar lógica de generación de URLs en frontend.
4. Medir y monitorear el rendimiento.

---

*Esta arquitectura permite una gestión profesional, escalable y mantenible de imágenes en la aplicación.* 