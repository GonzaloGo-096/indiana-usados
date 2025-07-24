# Optimización de Imágenes en Frontend con CDN - Indiana Usados

## Descripción
Guía para optimizar la carga y visualización de imágenes en el frontend usando hooks, componentes y servicios, aprovechando un CDN.

---

## 1. Componentes Clave
- **Hook:** `useImageOptimization` (gestiona carga, formatos, srcset, lazy, fallback)
- **Componente:** `OptimizedImage` (usa el hook, props para tamaños, formato, lazy, skeleton)
- **Servicio:** `imageOptimizationService` (helpers para generar URLs, srcset, preload, cache)

---

## 2. Ejemplo de Uso
```js
<OptimizedImage
  src={auto.imagen}
  alt={`${auto.marca} ${auto.modelo}`}
  fallback={defaultCarImage}
  sizes={{ sm: '300px', md: '400px', lg: '500px' }}
  format="webp"
  lazy={true}
  showSkeleton={true}
/>
```

---

## 3. Características Principales
- Lazy loading inteligente (Intersection Observer)
- Formatos modernos (WebP, AVIF, fallback JPEG)
- Responsive con srcset y sizes
- Fallback automático y skeleton de carga
- Cache inteligente en memoria

---

## 4. Configuración
- Centraliza formatos, tamaños y lazy en el servicio.
- Ajusta por componente según contexto (ej: CardAuto vs Detalle).

---

## 5. Buenas Prácticas
- Usa WebP como formato principal.
- Preload de imágenes críticas.
- Ajusta tamaños según dispositivo.
- Implementa fallback y skeleton para mejor UX.
- Limpia y monitorea el cache si es necesario.

---

## 6. Troubleshooting
- Verifica soporte de formatos y fallback.
- Usa aspect-ratio CSS para evitar CLS.
- Usa logs para depurar carga y errores.

---

## Conclusión
El sistema permite imágenes rápidas, adaptables y con excelente experiencia de usuario, escalable para futuras optimizaciones. 