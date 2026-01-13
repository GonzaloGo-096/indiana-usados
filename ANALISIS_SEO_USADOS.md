# Análisis SEO - Referencias a "Usados" en Google

## 📋 Resumen Ejecutivo

Análisis completo del SEO relacionado con la sección de "usados" en el frontend de Indiana Usados. Se identificaron **4 problemas críticos** y **2 oportunidades de mejora**.

---

## 🔴 Problemas Críticos Encontrados

### 1. **Inconsistencia de Dominio** ⚠️ CRÍTICO
**Problema**: El dominio base está inconsistente entre archivos.

- ✅ `src/config/seo.js`: `https://indiana.com.ar` (CORRECTO)
- ✅ `api/sitemap.xml.js`: `https://indiana.com.ar` (CORRECTO)
- ❌ `public/robots.txt`: `https://indianausados.com` (INCORRECTO)
- ❌ `src/utils/seo/generateSitemap.js`: `https://indianausados.com` (INCORRECTO)

**Impacto**: Google puede indexar con URLs incorrectas, causando problemas de canonicidad.

**Solución**: Unificar todos los archivos para usar `https://indiana.com.ar`

---

### 2. **Inconsistencia de Rutas en Sitemap** ⚠️ CRÍTICO
**Problema**: El sitemap referencia `/vehiculos` pero la ruta real es `/usados`.

**Archivos afectados**:
- `api/sitemap.xml.js` línea 224: tiene `/vehiculos` (debería ser `/usados`)
- `public/robots.txt` línea 57: tiene `/vehiculos` (debería ser `/usados`)

**Impacto**: Google puede indexar URLs incorrectas o no encontrar la página principal de usados.

**Solución**: Cambiar todas las referencias de `/vehiculos` a `/usados` en sitemap y robots.txt.

---

### 3. **Falta de Structured Data (JSON-LD)** ⚠️ IMPORTANTE
**Problema**: No hay implementación de Schema.org para mejorar el SEO.

**Oportunidades perdidas**:
- No hay `Organization` schema en Home
- No hay `ItemList` schema en `/usados`
- No hay `Product` schema en detalle de vehículos
- No hay `BreadcrumbList` schema

**Impacto**: Google no puede mostrar rich snippets (estrellas, precios, breadcrumbs) en los resultados de búsqueda.

**Solución**: Implementar JSON-LD para:
- Organization (Home)
- ItemList (Listado de usados)
- Product (Detalle de vehículo)
- BreadcrumbList (Navegación)

---

### 4. **Keywords Podrían Mejorarse** ⚠️ MEJORA
**Estado actual**: Keywords básicos pero genéricos.

**Actual**:
```
'autos usados, concesionaria, vehículos usados, autos usados Argentina, comprar auto usado, garantía autos usados'
```

**Oportunidades**:
- Agregar keywords más específicos por ubicación
- Incluir marcas populares
- Agregar términos de búsqueda local

---

## ✅ Aspectos Positivos

1. **Meta Tags Correctos**: Títulos y descripciones están bien configurados
2. **Open Graph**: Implementado correctamente
3. **Canonical URLs**: Configuradas correctamente
4. **Sitemap Dinámico**: Genera sitemap con vehículos reales
5. **Robots.txt**: Bien estructurado (solo necesita corrección de rutas)

---

## 📊 Configuración Actual de SEO para "Usados"

### Página Principal (`/usados`)
- **Título**: "Catálogo de Autos Usados | Indiana Usados"
- **Descripción**: Dinámica según cantidad de vehículos
- **Keywords**: "catálogo autos usados, vehículos usados disponibles, comprar auto usado, autos usados con garantía"
- **URL Canónica**: `/usados`
- **Tipo OG**: `website`

### Home (`/`)
- **Título**: "Indiana Usados - Autos Usados con Garantía en Argentina"
- **Descripción**: "Indiana Usados es una concesionaria de autos usados en Argentina..."
- **Keywords**: "autos usados, concesionaria, vehículos usados, autos usados Argentina, comprar auto usado, garantía autos usados"

---

## 🔧 Acciones Recomendadas

### Prioridad ALTA (Hacer ahora)
1. ✅ Corregir dominio inconsistente (unificar a `indiana.com.ar`)
2. ✅ Corregir rutas en sitemap (`/vehiculos` → `/usados`)
3. ✅ Corregir robots.txt (rutas y dominio)

### Prioridad MEDIA (Próximas semanas)
4. Implementar Structured Data (JSON-LD)
5. Mejorar keywords con términos más específicos
6. Agregar breadcrumbs con schema

### Prioridad BAJA (Mejoras futuras)
7. Implementar hreflang si hay múltiples idiomas
8. Agregar FAQ schema si hay sección de preguntas
9. Implementar Review schema si hay reseñas

---

## 📝 Notas Técnicas

- El sitemap se genera dinámicamente en producción
- Los meta tags se actualizan dinámicamente con React
- Hay política de noindex en preview/development (correcto)
- El canonical URL se genera automáticamente según entorno

---

## 🎯 Resultado Esperado

Después de las correcciones:
- ✅ Google indexará correctamente `/usados`
- ✅ No habrá conflictos de canonicidad
- ✅ Rich snippets en resultados de búsqueda (con structured data)
- ✅ Mejor posicionamiento para búsquedas de "autos usados"


