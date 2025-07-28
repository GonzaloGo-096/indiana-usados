# 🚀 Guía de Migración a Backend Real

## 📋 Resumen de Cambios

Esta migración transforma el proyecto de usar datos mock a conectarse con un backend real, manteniendo la compatibilidad y funcionalidad existente.

## 🎯 Objetivos Cumplidos

✅ **Compatibilidad**: El código existente sigue funcionando  
✅ **Axios Centralizado**: Instancia configurada en `/src/api/axiosInstance.js`  
✅ **Variables de Entorno**: Configuración desde `.env` con `VITE_API_URL`  
✅ **Hooks Actualizados**: Migración gradual con fallback a mock data  
✅ **Paginación Real**: Soporte para cursor-based pagination  
✅ **Código Modular**: Arquitectura limpia y escalable  
✅ **Preparado para Producción**: Buenas prácticas implementadas  

## 📁 Archivos Creados/Modificados

### Nuevos Archivos

```
src/api/
├── axiosInstance.js          # Instancia centralizada de Axios
└── vehiclesApi.js           # Servicio de API para vehículos

src/hooks/
├── useVehiclesInfinite.js   # Hook con useInfiniteQuery para paginación real
└── useVehicleDetail.js      # Hook para detalles de vehículo

src/components/test/
└── ApiTest.jsx             # Componente de prueba (solo desarrollo)

.env                        # Variables de entorno
.env.example               # Template de variables de entorno
MIGRATION_GUIDE.md         # Esta documentación
```

### Archivos Modificados

```
src/hooks/
├── useGetCars.jsx         # Actualizado con fallback a API real
├── useAutoDetail.js       # Actualizado con fallback a API real
└── index.js              # Exportaciones actualizadas

src/App.jsx               # Agregado componente de prueba
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Configuración del Backend
VITE_API_URL=https://api.indiana-usados.com

# Configuración de la aplicación
VITE_APP_NAME=Indiana Usados
VITE_APP_VERSION=2.0.0

# Configuración de desarrollo
VITE_DEV_MODE=true
VITE_ENABLE_MOCK_DATA=true
```

### Endpoints del Backend

El backend debe implementar estos endpoints:

```javascript
// GET /api/autos
// Parámetros: limit, cursor, filters
// Respuesta: { data: [...], nextCursor: "123", total: 100 }

// GET /api/autos/:id
// Respuesta: { id, marca, modelo, precio, año, ... }

// POST /api/autos/filter
// Body: { filters: {...}, pagination: { limit, cursor } }
// Respuesta: { data: [...], nextCursor: "123", total: 100, filteredCount: 50 }
```

## 🎮 Uso de los Nuevos Hooks

### Hook de Paginación Infinita

```javascript
import { useVehiclesInfinite } from '../hooks';

const MyComponent = () => {
    const {
        vehicles,
        totalVehicles,
        hasNextPage,
        isLoading,
        isError,
        loadMore,
        reload
    } = useVehiclesInfinite({
        filters: { marca: 'Toyota', año: 2020 },
        limit: 6,
        enabled: true
    });

    return (
        <div>
            {vehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
            
            {hasNextPage && (
                <button onClick={loadMore} disabled={isLoading}>
                    Cargar Más
                </button>
            )}
        </div>
    );
};
```

### Hook de Detalle de Vehículo

```javascript
import { useVehicleDetail } from '../hooks';

const VehicleDetail = ({ vehicleId }) => {
    const {
        vehicle,
        isLoading,
        isError,
        error
    } = useVehicleDetail(vehicleId);

    if (isLoading) return <div>Cargando...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>{vehicle.marca} {vehicle.modelo}</h1>
            <p>Precio: ${vehicle.precio}</p>
        </div>
    );
};
```

## 🔄 Estrategia de Migración

### Fase 1: Preparación ✅
- [x] Configuración de Axios centralizada
- [x] Variables de entorno configuradas
- [x] Servicios de API creados
- [x] Hooks nuevos implementados

### Fase 2: Integración Gradual ✅
- [x] Hooks existentes actualizados con fallback
- [x] Componente de prueba implementado
- [x] Compatibilidad mantenida

### Fase 3: Testing y Validación 🔄
- [ ] Probar con backend real
- [ ] Validar paginación
- [ ] Verificar manejo de errores
- [ ] Optimizar performance

### Fase 4: Producción 🚀
- [ ] Remover fallbacks a mock data
- [ ] Configurar variables de producción
- [ ] Optimizar cache y performance
- [ ] Documentación final

## 🧪 Testing

### Componente de Prueba

El componente `ApiTest` se muestra automáticamente en modo desarrollo y permite:

- ✅ Verificar conexión con la API
- ✅ Probar paginación infinita
- ✅ Validar detalles de vehículos
- ✅ Monitorear estados de carga
- ✅ Revisar configuración de entorno

### Cómo Probar

1. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Verificar el panel de prueba:**
   - Aparece en la esquina superior derecha
   - Solo visible en modo desarrollo
   - Muestra estado de la API en tiempo real

3. **Probar funcionalidades:**
   - Clic en "Cargar Más" para paginación
   - Clic en "Recargar" para refrescar datos
   - Clic en vehículos para ver detalles

## 🚨 Manejo de Errores

### Estrategia de Fallback

```javascript
// Los hooks intentan primero la API real
try {
    return await vehiclesApi.getVehicles(params);
} catch (error) {
    console.log('⚠️ Fallback a mock data:', error.message);
    // Si falla, usa datos mock
    return await autoService.getVehicles(params);
}
```

### Tipos de Errores Manejados

- 🔐 **401**: Error de autenticación
- 🚫 **403**: Error de autorización  
- 🔍 **404**: Recurso no encontrado
- 💥 **500**: Error del servidor
- 🌐 **Network**: Error de conexión
- ⏰ **Timeout**: Tiempo de espera agotado

## 📊 Performance

### Optimizaciones Implementadas

- ✅ **Cache inteligente**: React Query con staleTime y gcTime
- ✅ **Paginación eficiente**: Solo carga datos necesarios
- ✅ **Interceptors**: Logging y manejo centralizado de errores
- ✅ **Memoización**: useMemo para cálculos costosos
- ✅ **Lazy loading**: Carga bajo demanda

### Métricas a Monitorear

- Tiempo de respuesta de la API
- Número de requests por sesión
- Tamaño de datos transferidos
- Uso de memoria del cache
- Tiempo de carga de páginas

## 🔧 Configuración Avanzada

### Personalizar Timeouts

```javascript
// En src/api/axiosInstance.js
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 segundos
    // ...
});
```

### Configurar Cache

```javascript
// En los hooks
const {
    staleTime = 1000 * 60 * 5, // 5 minutos
    cacheTime = 1000 * 60 * 30, // 30 minutos
} = options;
```

### Agregar Autenticación

```javascript
// En src/api/axiosInstance.js
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

## 🎯 Próximos Pasos

1. **Conectar con Backend Real**
   - Configurar URL real en `.env`
   - Probar endpoints
   - Validar formato de respuesta

2. **Optimizar Performance**
   - Ajustar tamaños de cache
   - Implementar prefetching
   - Optimizar queries

3. **Mejorar UX**
   - Agregar loading states
   - Implementar error boundaries
   - Optimizar skeleton loaders

4. **Preparar Producción**
   - Configurar variables de producción
   - Remover código de desarrollo
   - Optimizar bundle

## 📞 Soporte

Para dudas o problemas durante la migración:

1. Revisar logs en la consola del navegador
2. Verificar configuración en `.env`
3. Probar con el componente `ApiTest`
4. Consultar esta documentación

---

**¡La migración está lista para conectar con tu backend real! 🚀** 