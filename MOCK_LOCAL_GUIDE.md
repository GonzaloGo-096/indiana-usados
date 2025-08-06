# 🟣 MOCK LOCAL - GUÍA COMPLETA

## 📋 **¿Qué es el Mock Local?**

El **Mock Local** es un sistema de datos de prueba que funciona completamente en el navegador, sin necesidad de conexión a internet o servicios externos. Es perfecto para desarrollo y testing.

## 🚀 **Cómo Implementé el Mock Local**

### **1. Estructura de Datos (`src/api/mockData.js`)**

```javascript
// ✅ DATOS REALES DE VEHÍCULOS
export const mockVehicles = [
    {
        "id": 1,
        "marca": "Toyota",
        "modelo": "Corolla",
        "precio": 10000000,
        // ... más campos
    },
    // ... más vehículos
]

// ✅ FUNCIÓN PARA OBTENER VEHÍCULOS CON PAGINACIÓN
export const getMockVehicles = (page = 1, limit = 6, filters = {}) => {
    let filteredVehicles = [...mockVehicles]
    
    // ✅ APLICAR FILTROS SI EXISTEN
    if (filters && Object.keys(filters).length > 0) {
        filteredVehicles = applyLocalFilters(filteredVehicles, filters)
    }
    
    // ✅ CALCULAR PAGINACIÓN
    const total = filteredVehicles.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex)
    
    return {
        data: paginatedVehicles,
        total,
        currentPage: page,
        hasNextPage: endIndex < total,
        nextPage: endIndex < total ? page + 1 : null
    }
}
```

### **2. Lógica de Filtros (`applyLocalFilters`)**

```javascript
// ✅ FUNCIÓN PARA APLICAR FILTROS LOCALES
export const applyLocalFilters = (vehicles, filters) => {
    return vehicles.filter(vehicle => {
        // ✅ FILTRO POR MARCA
        if (filters.marca && !vehicle.marca.toLowerCase().includes(filters.marca.toLowerCase())) {
            return false
        }
        
        // ✅ FILTRO POR PRECIO
        if (filters.precioMin && vehicle.precio < filters.precioMin) {
            return false
        }
        if (filters.precioMax && vehicle.precio > filters.precioMax) {
            return false
        }
        
        // ✅ FILTRO GENERAL DE BÚSQUEDA
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            const searchableFields = [
                vehicle.marca,
                vehicle.modelo,
                vehicle.version,
                vehicle.color,
                vehicle.categoria,
                vehicle.detalle
            ].join(' ').toLowerCase()
            
            if (!searchableFields.includes(searchTerm)) {
                return false
            }
        }
        
        return true
    })
}
```

### **3. Integración en API (`src/api/vehiclesApi.js`)**

```javascript
// ✅ DETECTAR ENTORNO Y USAR ESTRATEGIA APROPIADA
if (USE_MOCK_API && !USE_POSTMAN_MOCK) {
    // ✅ MOCK LOCAL IMPLEMENTADO
    console.log('🔄 MOCK LOCAL: Obteniendo vehículos sin filtros', { limit, page })
    const result = getMockVehicles(page, limit)
    console.log('✅ MOCK LOCAL: Vehículos obtenidos', result)
    return result
}
```

## 🎯 **Cómo Usar el Mock Local**

### **1. Cambiar a Mock Local**
```bash
npm run env:mock-local
```

### **2. Reiniciar servidor**
```bash
npm run dev
```

### **3. Verificar en consola**
```javascript
🔧 CONFIGURACIÓN VEHICLES API: {
  useMock: true,
  usePostman: false,
  environment: "development"
}

🔄 MOCK LOCAL: Obteniendo vehículos sin filtros { limit: 6, page: 1 }
✅ MOCK LOCAL: Vehículos obtenidos { data: [...], total: 12, ... }
```

## ⚡ **Ventajas del Mock Local**

### **✅ Rendimiento**
- **Sin latencia de red** - datos instantáneos
- **Sin dependencias externas** - funciona offline
- **Respuesta inmediata** - ideal para desarrollo

### **✅ Control Total**
- **Datos consistentes** - siempre los mismos
- **Filtros completos** - todos los filtros funcionan
- **Paginación real** - simula backend real

### **✅ Desarrollo Eficiente**
- **Sin configuración** - funciona inmediatamente
- **Debugging fácil** - logs detallados
- **Testing confiable** - datos predecibles

## 🔧 **Configuración del Mock Local**

### **Variables de Entorno:**
```bash
VITE_USE_MOCK_API=true
VITE_USE_POSTMAN_MOCK=false
VITE_API_TIMEOUT=1000
VITE_API_RETRIES=1
VITE_API_RETRY_DELAY=500
```

### **Características:**
- **Timeout rápido** (1 segundo)
- **Sin reintentos** (respuesta inmediata)
- **Logging detallado** (para debugging)

## 📊 **Datos Incluidos**

### **✅ 12 Vehículos de Prueba:**
1. **Toyota Corolla** - $10,000,000
2. **Toyota Camry** - $8,594,987
3. **Honda Civic** - $7,500,000
4. **Ford Mustang** - $15,000,000
5. **BMW Serie 3** - $12,000,000
6. **Mercedes Clase C** - $13,500,000
7. **Audi A4** - $11,000,000
8. **Volkswagen Golf** - $8,500,000
9. **Chevrolet Cruze** - $6,500,000
10. **Nissan Sentra** - $7,200,000
11. **Hyundai Elantra** - $6,800,000
12. **Kia Forte** - $5,900,000

### **✅ Filtros Soportados:**
- **Marca** (Toyota, Honda, Ford, etc.)
- **Modelo** (Corolla, Camry, Civic, etc.)
- **Precio** (mínimo y máximo)
- **Año** (2019-2022)
- **Kilometraje** (15,000 - 70,000 km)
- **Transmisión** (Manual/Automática)
- **Combustible** (Gasolina, Diésel, etc.)
- **Color** (Blanco, Negro, Rojo, etc.)
- **Búsqueda general** (texto libre)

## 🧪 **Testing con Mock Local**

### **✅ Casos de Prueba:**
```javascript
// ✅ Filtro por marca
filters: { marca: 'Toyota' }
// Resultado: 2 vehículos (Corolla, Camry)

// ✅ Filtro por precio
filters: { precioMin: 5000000, precioMax: 10000000 }
// Resultado: 8 vehículos

// ✅ Filtro por año
filters: { añoMin: 2020, añoMax: 2022 }
// Resultado: 6 vehículos

// ✅ Búsqueda general
filters: { search: 'deportivo' }
// Resultado: 2 vehículos (Mustang, Golf GTI)
```

## 🔄 **Comparación de Entornos**

| Entorno | Velocidad | Datos | Filtros | Dependencias |
|---------|-----------|-------|---------|--------------|
| **Mock Local** | ⚡ Instantáneo | ✅ Consistentes | ✅ Completos | ❌ Ninguna |
| **Postman** | 🐌 Lenta | ⚠️ Variables | ⚠️ Limitados | ✅ Internet |
| **Backend Real** | 🐌 Lenta | ✅ Reales | ✅ Completos | ✅ Servidor |

## 🚀 **Flujo de Implementación**

### **1. Detección de Entorno**
```javascript
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'
const USE_POSTMAN_MOCK = import.meta.env.VITE_USE_POSTMAN_MOCK === 'true'

if (USE_MOCK_API && !USE_POSTMAN_MOCK) {
    // Usar Mock Local
}
```

### **2. Llamada a Mock Local**
```javascript
const result = getMockVehicles(page, limit, filters)
```

### **3. Aplicación de Filtros**
```javascript
const filteredVehicles = applyLocalFilters(vehicles, filters)
```

### **4. Paginación**
```javascript
const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex)
```

### **5. Respuesta Estructurada**
```javascript
return {
    data: paginatedVehicles,
    total: filteredVehicles.length,
    currentPage: page,
    hasNextPage: endIndex < total,
    nextPage: hasNextPage ? page + 1 : null
}
```

## 🎯 **Resultado Final**

**✅ Mock Local completamente funcional:**
- ✅ GET sin filtros funciona
- ✅ POST con filtros funciona  
- ✅ Detalle por ID funciona
- ✅ Paginación funciona
- ✅ Todos los filtros funcionan
- ✅ Búsqueda general funciona
- ✅ Logging detallado
- ✅ Performance óptima

**🚀 Cambio instantáneo:**
```bash
npm run env:mock-local
npm run dev
# ¡Listo! Mock local funcionando
```

---

## 📝 **Resumen**

El **Mock Local** es la solución perfecta para:
- **Desarrollo rápido** sin dependencias
- **Testing confiable** con datos consistentes
- **Debugging fácil** con logs detallados
- **Performance óptima** sin latencia de red

**¡Implementado y listo para usar!** 🎉 