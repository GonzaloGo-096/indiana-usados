# Paginación de Vehículos

## Arquitectura

### Backend
- **Tipo**: Page-based (mongoose-paginate-v2)
- **Endpoint**: `/photos/getallphotos`
- **Estructura de respuesta**:
  ```javascript
  {
    allPhotos: {
      docs: [...],           // Array de vehículos
      totalDocs: number,     // Total de documentos
      hasNextPage: boolean,  // Si hay página siguiente
      nextPage: number       // Número de la siguiente página
    }
  }
  ```

### Frontend
- **Hook**: `useInfiniteQuery` (React Query)
- **Página inicial**: `pageParam = 1`
- **Navegación**: `nextPage` del backend
- **Tamaño de página**: `PAGE_SIZE = 8` (fijo)

## Componentes

### Normalizador
- **Archivo**: `src/api/vehicles.normalizer.js`
- **Función**: `normalizeVehiclesPage(raw)`
- **Propósito**: Convierte respuesta del backend a formato estándar

### Mapper
- **Archivo**: `src/mappers/vehicleMapper.js`
- **Función**: `mapListResponse(apiResponse)`
- **Propósito**: Mapea datos normalizados a formato de UI

### Hook
- **Archivo**: `src/hooks/vehicles/useVehiclesList.js`
- **Características**:
  - `PAGE_SIZE = 8`
  - `loadMore`: función para cargar más páginas
  - `isLoadingMore`: estado de carga de páginas adicionales
  - `hasNextPage`: indica si hay más páginas

### UI
- **Componente**: `src/components/AutosGrid.jsx`
- **Funcionalidades**:
  - Botón "Cargar más" cuando `hasNextPage = true`
  - Estado "Cargando…" durante carga
  - Manejo de errores con botón "Reintentar"
  - Preserva datos previos en caso de error

## Configuración de Caché

- **staleTime**: 5 minutos
- **gcTime**: 30 minutos
- **retry**: 2 intentos
- **placeholderData**: mantiene datos previos durante recarga

## Flujo de Datos

1. **Hook** → `getMainVehicles()` con `cursor` y `signal`
2. **API** → `/photos/getallphotos?cursor=X&limit=8`
3. **Backend** → Respuesta con `allPhotos.{docs,totalDocs,hasNextPage,nextPage}`
4. **Normalizador** → Convierte a formato estándar
5. **Mapper** → Mapea vehículos individuales
6. **UI** → Renderiza grid con botón "Cargar más"

## Manejo de Errores

- **Primera carga**: Error general (no afecta UI existente)
- **Cargar más**: Error local con botón "Reintentar"
- **Cancelación**: `signal` en requests para evitar requests colgados
- **Preservación**: Datos previos se mantienen en caso de error

## Decisiones de Diseño

- **Sin IntersectionObserver**: Control manual con botón
- **Página fija**: 8 elementos por página (no configurable)
- **Caché inteligente**: `placeholderData` evita flicker
- **QueryKey**: Incluye `limit` para evitar mezcla de caché
- **Compatibilidad**: Mantiene interfaz existente sin cambios
