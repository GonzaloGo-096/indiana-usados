# Variables de Entorno - Mejoras de Imágenes

## 📋 CONFIGURACIÓN RECOMENDADA

```bash
# ===========================================
# CONFIGURACIÓN DE IMÁGENES - INDIANA USADOS
# ===========================================

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=duuwqmpmn

# ===========================================
# FEATURE FLAGS - MEJORAS DE IMÁGENES
# ===========================================

# Progressive JPEG - Mejora perceived performance
# Solo afecta imágenes JPEG (no AVIF/WebP)
VITE_IMG_PROGRESSIVE_JPEG=true

# Blur Placeholders (LQIP) - UX premium
# Genera placeholders borrosos para loading states
VITE_IMG_PLACEHOLDER_BLUR=true

# CDN Metrics - Monitoreo de performance
# Captura métricas de carga de imágenes via Performance API
VITE_IMG_METRICS=true


# ===========================================
# CONFIGURACIÓN GENERAL
# ===========================================

# Entorno de ejecución
VITE_ENVIRONMENT=development

# API Base URL
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🔧 NOTAS DE CONFIGURACIÓN

### **1. Progressive JPEG**
- **true**: Agrega `fl_progressive` a transformaciones
- **false**: Sin progressive JPEG (default)
- **Impacto**: Solo en imágenes JPEG, mejora perceived performance

### **2. Blur Placeholders**
- **true**: Genera placeholders borrosos (24px, blur:200)
- **false**: Sin placeholders (default)
- **Impacto**: UX premium, loading states profesionales

### **3. CDN Metrics**
- **true**: Captura métricas via Performance API
- **false**: Sin métricas (default)
- **Impacto**: Envío a `/metrics/images` endpoint


## 🚀 ACTIVACIÓN RECOMENDADA

### **Para desarrollo local:**
```bash
VITE_IMG_PROGRESSIVE_JPEG=true
VITE_IMG_PLACEHOLDER_BLUR=true
VITE_IMG_METRICS=false
```

### **Para producción:**
```bash
VITE_IMG_PROGRESSIVE_JPEG=true
VITE_IMG_PLACEHOLDER_BLUR=true
VITE_IMG_METRICS=true
```

## 🧪 VARIANTES DE PRUEBA PARA STAGING

### **Variante A (Baseline)**
```bash
VITE_IMG_PLACEHOLDER_BLUR=false
VITE_IMG_PROGRESSIVE_JPEG=false
VITE_IMG_METRICS=true
```

### **Variante B (Blur LQIP)**
```bash
VITE_IMG_PLACEHOLDER_BLUR=true
VITE_IMG_PROGRESSIVE_JPEG=false
VITE_IMG_METRICS=true
```

### **Variante C (Blur + Progressive)**
```bash
VITE_IMG_PLACEHOLDER_BLUR=true
VITE_IMG_PROGRESSIVE_JPEG=true
VITE_IMG_METRICS=true
```

## 📊 ENDPOINT DE MÉTRICAS

Las métricas se envían a:
- **Endpoint**: `POST /metrics/images`
- **Formato**: JSON con batch de métricas
- **Rate Limit**: 20 requests/minuto, payload máx 8KB
- **Campos**: k, ts, eb, db, dur, cache, route, role, width, placeholder, format
