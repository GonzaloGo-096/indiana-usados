# 📋 ETAPA 5: Análisis de `pages/`, `styles/` y `assets/`

Este documento analiza las carpetas de páginas, estilos globales y recursos estáticos.

---

## 📁 5.1 Carpeta `pages/`

### 🎯 Propósito y Responsabilidad

**Páginas principales de la aplicación**: Componentes de nivel superior que representan rutas completas.

### 📂 Estructura

```
pages/
├── Home/
│   ├── Home.jsx
│   ├── Home.module.css
│   └── index.js
├── Vehiculos/
│   ├── Vehiculos.jsx
│   ├── Vehiculos.module.css
│   └── index.js
├── VehiculoDetalle/
│   ├── VehiculoDetalle.jsx
│   ├── VehiculoDetalle.module.css
│   └── index.js
├── Nosotros/
│   ├── Nosotros.jsx
│   ├── Nosotros.module.css
│   └── index.js
├── Postventa/
│   ├── Postventa.jsx
│   ├── Postventa.module.css
│   └── index.js
├── NotFound/
│   └── NotFound.jsx
└── admin/
    ├── Dashboard/
    │   ├── Dashboard.jsx
    │   ├── Dashboard.module.css
    │   └── index.js
    └── Login/
        ├── Login.jsx
        ├── Login.module.css
        └── index.js
```

### 📄 Páginas Principales

#### `Home.jsx` - Página Principal

**Responsabilidad**: Landing page de la aplicación.

**Características**:
- ✅ **Hero Carousel**: Carousel de imágenes hero
- ✅ **Sección Features**: Características destacadas (placeholder)
- ✅ **Banner Postventa**: Promoción del servicio post-venta
- ✅ **Navegación**: Links a otras secciones

**Estructura**:
```jsx
<>
  <HeroImageCarousel images={heroImages} />
  <Features />
  <PostventaBanner />
</>
```

**Dependencias**:
- `@ui/HeroImageCarousel`
- `@ui/Button`
- Assets de imágenes

#### `Vehiculos.jsx` - Lista de Vehículos

**Responsabilidad**: Página principal de búsqueda y filtrado de vehículos.

**Características**:
- ✅ **Sistema de filtros unificado**: Filtros sincronizados con URL
- ✅ **Paginación infinita**: `loadMore` con React Query
- ✅ **Sorting**: Ordenamiento de vehículos
- ✅ **Estado de URL**: Filtros y sorting en query params
- ✅ **Lazy loading**: Formulario de filtros cargado bajo demanda

**Hooks Utilizados**:
- `useVehiclesList(filters)`: Hook unificado para vehículos
- `useSearchParams`: Sincronización con URL
- `useMemo`: Optimización de sorting

**Flujo de Filtros**:
```
Usuario aplica filtros
  ↓
LazyFilterFormSimple → onApply(newFilters)
  ↓
serializeFilters(newFilters) → URLSearchParams
  ↓
setSearchParams() → Actualiza URL
  ↓
parseFilters(sp) → Filtros actualizados
  ↓
useVehiclesList(filters) → Refetch automático
  ↓
Vehículos filtrados renderizados
```

**Estado de URL**:
- Filtros en query params: `?marca=Toyota&precio=10000000-50000000`
- Sorting: `?sort=precio-asc`
- Sincronización bidireccional: URL ↔ Estado del componente

**Componentes**:
- `LazyFilterFormSimple`: Formulario de filtros (lazy)
- `SortDropdown`: Dropdown de ordenamiento
- `AutosGrid`: Grid de vehículos
- Skeletons durante carga

#### `VehiculoDetalle.jsx` - Detalle de Vehículo

**Responsabilidad**: Vista detallada de un vehículo individual.

**Características**:
- ✅ **Preservación de scroll**: Restaura posición al volver
- ✅ **Cache de React Query**: Usa datos cacheados si disponibles
- ✅ **Skeleton loading**: Estado de carga elegante
- ✅ **Error handling**: Manejo de errores con ErrorState
- ✅ **Scroll automático**: Scroll a top al cargar

**Hooks Utilizados**:
- `useVehicleDetail(id)`: Hook para detalle con cache
- `useScrollPosition`: Preservación de scroll
- `useParams`: Obtener ID de la URL

**Flujo**:
```
Usuario hace click en vehículo
  ↓
Navega a /vehiculo/:id
  ↓
useVehicleDetail(id) → Busca en cache o fetch
  ↓
Si está en cache: Renderiza inmediatamente
  ↓
Si no está en cache: Fetch y muestra skeleton
  ↓
CardDetalle renderiza vehículo completo
  ↓
Usuario hace "Volver"
  ↓
navigateWithScroll('/vehiculos') → Restaura scroll
```

**Componentes**:
- `CardDetalle`: Vista detallada del vehículo
- `DetalleSkeleton`: Skeleton durante carga
- `ErrorState`: Manejo de errores

#### `Nosotros.jsx` - Página Nosotros

**Responsabilidad**: Información sobre la empresa.

**Características**:
- Página estática con información corporativa
- Estilos propios en módulo CSS

#### `Postventa.jsx` - Página Postventa

**Responsabilidad**: Información sobre servicios post-venta.

**Características**:
- Información de servicios
- Imágenes de taller
- Estilos propios en módulo CSS

#### `NotFound.jsx` - Página 404

**Responsabilidad**: Página de error 404 cuando no se encuentra la ruta.

**Características**:
- Manejo de rutas no encontradas
- Link de retorno a home

#### `admin/Dashboard.jsx` - Panel de Administración

**Responsabilidad**: Panel completo para administrar vehículos.

**Características**:
- ✅ **CRUD completo**: Create, Read, Update, Delete de vehículos
- ✅ **Modal de formulario**: Modal con LazyCarForm
- ✅ **Estado con reducer**: `carModalReducer` para estado del modal
- ✅ **Mutations optimistas**: Actualizaciones optimistas con React Query
- ✅ **Lista de vehículos**: Grid/lista de todos los vehículos
- ✅ **Logout**: Botón de cerrar sesión

**Hooks Utilizados**:
- `useVehiclesList({}, { pageSize: 50 })`: Lista de vehículos
- `useCarMutation()`: Mutations (create, update, delete)
- `useAuth()`: Autenticación y logout
- `useReducer(carModalReducer)`: Estado del modal

**Estados del Modal**:
```javascript
{
  isOpen: boolean,
  mode: 'create' | 'edit' | null,
  vehicleId: string | null,
  isLoading: boolean,
  error: string | null
}
```

**Flujo de Creación**:
```
Usuario hace click en "Agregar"
  ↓
handleOpenCreateForm() → dispatch(openCreateForm())
  ↓
Modal abre con LazyCarForm en modo CREATE
  ↓
Usuario completa formulario y envía
  ↓
createMutation.mutate(formData)
  ↓
Optimistic update: UI actualiza inmediatamente
  ↓
Backend confirma → Invalida queries → Refetch
  ↓
Modal se cierra automáticamente
```

**Flujo de Edición**:
```
Usuario hace click en "Editar"
  ↓
handleOpenEditForm(vehicle) → dispatch(openEditForm(id))
  ↓
Fetch del vehículo completo (si no está en cache)
  ↓
Normaliza datos: normalizeDetailToFormInitialData()
  ↓
Modal abre con LazyCarForm pre-poblado
  ↓
Usuario modifica y envía
  ↓
updateMutation.mutate({ id, data })
  ↓
Optimistic update + Backend confirm
```

**Flujo de Eliminación**:
```
Usuario hace click en "Eliminar"
  ↓
Confirmación (¿eliminar?)
  ↓
deleteMutation.mutate(id)
  ↓
Optimistic update: Vehículo desaparece de la lista
  ↓
Backend confirma → Invalida queries
```

**Componentes**:
- `LazyCarForm`: Formulario lazy de vehículos
- `Alert`: Mensajes de éxito/error
- Grid/lista de vehículos

#### `admin/Login.jsx` - Login Admin

**Responsabilidad**: Página de inicio de sesión para administradores.

**Características**:
- ✅ **Formulario de login**: Usa `LoginForm` component
- ✅ **Redirección automática**: Si ya está autenticado
- ✅ **Manejo de errores**: Muestra errores del hook `useAuth`
- ✅ **Loading state**: Estado de carga durante login

**Flujo**:
```
Usuario accede a /admin/login
  ↓
Si ya está autenticado → Redirige a /admin
  ↓
Usuario ingresa credenciales
  ↓
handleSubmit(values) → login(values)
  ↓
useAuth.login() → authService.login()
  ↓
Si éxito: Token guardado → Redirige a /admin
  ↓
Si error: Muestra error en UI
```

**Componentes**:
- `LoginForm`: Formulario de login reutilizable

---

## 📁 5.2 Carpeta `styles/`

### 🎯 Propósito y Responsabilidad

**Estilos globales** de la aplicación (si existen).

### 📂 Estructura

```
styles/
└── [Estilos globales si existen]
```

**Nota**: La aplicación usa principalmente **CSS Modules** (`.module.css`) en cada componente, no estilos globales centralizados.

**Enfoque de Estilos**:
- ✅ **CSS Modules**: Scoped styles por componente
- ✅ **Sin estilos globales centralizados**: Cada componente tiene su módulo
- ✅ **App.module.css**: Solo estilos básicos del contenedor App

**Ventajas**:
- **Encapsulación**: Estilos no se filtran entre componentes
- **Colisiones evitadas**: Nombres de clases únicos automáticamente
- **Tree-shaking**: Solo estilos usados se incluyen en bundle

**Desventajas Potenciales**:
- No hay design system centralizado en CSS
- Variables CSS globales podrían ser útiles

---

## 📁 5.3 Carpeta `assets/`

### 🎯 Propósito y Responsabilidad

**Recursos estáticos**: Imágenes, fuentes, iconos y otros assets.

### 📂 Estructura

```
assets/
├── index.js                      # Exportaciones centralizadas
├── auto1.jpg                     # Imagen por defecto de vehículo
├── footer-img.png                # Imagen del footer
├── foto-principal.webp           # Imagen principal
├── img-postventa-principal.webp  # Imagen de postventa
├── indiana-nav-logo.png          # Logo de navegación
├── pre-titulo.png                # Imagen de pre-título
├── taller-2.webp                 # Imagen de taller
├── taller-3-jpeg.webp            # Imagen de taller
├── taller-motor.webp             # Imagen de taller
├── fuentes/
│   └── fuentes indiana/
│       ├── barlowcondensed-bold-webfont.woff2
│       ├── barlowcondensed-extralight-webfont.woff2
│       ├── barlowcondensed-medium-webfont.woff2
│       └── barlowcondensed-semibold-webfont.woff2
└── home/
    └── index.js                  # Exportaciones de imágenes hero
```

### 📄 Archivos Principales

#### `index.js` - Exportaciones Centralizadas

**Responsabilidad**: Centraliza exports de assets para facilitar imports.

**Exporta**:
```javascript
export { default as defaultCarImage } from './auto1.jpg'
export { default as indianaNavLogo } from './indiana-nav-logo.png'
export const FONTS = { ... }
export const getDefaultImages = () => ({ ... })
```

**Ventajas**:
- ✅ **Imports limpios**: `import { defaultCarImage } from '@assets'`
- ✅ **Refactoring fácil**: Cambiar ruta solo en un lugar
- ✅ **Tree-shaking**: Solo assets importados se incluyen

#### `home/index.js` - Imágenes Hero

**Responsabilidad**: Exporta imágenes para el carousel hero de Home.

**Uso**:
```javascript
import { heroImages } from '@assets/home'
```

#### Fuentes (Barlow Condensed)

**Ubicación**: `assets/fuentes/fuentes indiana/`

**Formato**: `.woff2` (formato moderno y optimizado)

**Fuentes disponibles**:
- Bold
- Extra Light
- Medium
- Semi Bold

**Nota**: Las fuentes se referencian en CSS, no se importan directamente en JS.

---

## 📊 Resumen de estas Carpetas

### ✅ Fortalezas:

1. **Páginas bien estructuradas**: Cada página tiene su carpeta con módulo CSS
2. **Lazy loading**: Páginas cargadas bajo demanda
3. **CSS Modules**: Encapsulación de estilos
4. **Assets centralizados**: Exportaciones centralizadas facilitan imports
5. **Separación de concerns**: Admin separado de público
6. **Estado de URL**: Filtros y sorting sincronizados con URL

### ⚠️ Áreas de Mejora:

1. **Estilos globales**: Podría beneficiarse de variables CSS globales
2. **Design tokens**: Colores, espaciados, etc. podrían estar centralizados
3. **Tests de páginas**: Falta cobertura de tests en páginas
4. **Error boundaries**: Podrían tener error boundaries específicos por página
5. **SEO**: Algunas páginas podrían beneficiarse de meta tags
6. **Performance**: Algunas imágenes podrían optimizarse más

### 🔄 Flujo General de Navegación:

```
App.jsx
  ↓
PublicRoutes / AdminRoutes
  ↓
Pages (lazy loaded)
  ↓
Components específicos
  ↓
Hooks (useVehiclesList, useAuth, etc.)
  ↓
Services → API → Backend
```

---

## 🎓 Conceptos Clave:

1. **Page Component Pattern**: Componentes de nivel superior por ruta
2. **CSS Modules**: Scoped styles para evitar colisiones
3. **Lazy Loading Pages**: Code splitting por ruta
4. **URL State Management**: Sincronización de estado con URL
5. **Optimistic Updates**: Actualizaciones UI antes de confirmación backend
6. **Asset Management**: Centralización de recursos estáticos

---

**Próxima Etapa**: Resumen ejecutivo final y recomendaciones

