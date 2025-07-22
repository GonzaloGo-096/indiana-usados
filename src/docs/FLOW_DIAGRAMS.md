# 🔄 **Diagramas de Flujo - Sistema de Filtrado Indiana Usados**

## 📋 **Índice de Diagramas**

1. **Flujo Principal del Sistema**
2. **Flujo de Aplicación de Filtros**
3. **Flujo de Limpieza de Filtros**
4. **Flujo de Paginación Infinita**
5. **Flujo Responsive (Desktop vs Mobile)**
6. **Flujo de Estados y Cache**
7. **Flujo de Manejo de Errores**

---

## 🏗️ **1. Flujo Principal del Sistema**

```mermaid
graph TD
    A[Usuario entra a la página] --> B[FilterProvider se inicializa]
    B --> C[useFilterSystem se ejecuta]
    C --> D[Estado inicial: currentFilters = {}]
    D --> E[Query infinita se ejecuta]
    E --> F[autoService.getAutos() sin filtros]
    F --> G[Mock data retorna todos los vehículos]
    G --> H[React Query cachea resultado]
    H --> I[UI muestra todos los vehículos]
    
    I --> J[Usuario interactúa con filtros]
    J --> K{¿Es Desktop?}
    K -->|Sí| L[FilterForm en sidebar]
    K -->|No| M[FilterButton flotante]
    
    L --> N[Usuario configura filtros]
    M --> O[Usuario hace clic en FilterButton]
    O --> P[FilterDrawer se abre]
    P --> N
    
    N --> Q[handleFiltersChange() actualiza pendingFilters]
    Q --> R[FilterSummary muestra filtros pendientes]
    R --> S[Usuario hace clic en "Aplicar Filtros"]
    S --> T[applyFilters() se ejecuta]
    T --> U[currentFilters = pendingFilters]
    U --> V[Query infinita detecta cambio]
    V --> W[autoService.getAutos() con filtros]
    W --> X[Mock data filtra vehículos]
    X --> Y[React Query cachea resultado]
    Y --> Z[UI muestra vehículos filtrados]
    
    Z --> AA[Usuario hace scroll]
    AA --> BB[Intersection Observer detecta final]
    BB --> CC[loadMore() se ejecuta]
    CC --> DD[fetchNextPage() carga más vehículos]
    DD --> EE[Vehículos se agregan al array]
    EE --> Z
```

---

## 🎯 **2. Flujo de Aplicación de Filtros**

```mermaid
sequenceDiagram
    participant U as Usuario
    participant FF as FilterForm
    participant FS as useFilterSystem
    participant AQ as React Query
    participant AS as autoService
    participant MD as Mock Data
    participant UI as AutosGrid

    U->>FF: Configura filtros (marca: Toyota, año: 2020)
    FF->>FS: handleFiltersChange({marca: "Toyota", año: 2020})
    FS->>FS: setPendingFilters(filters)
    FS->>FF: pendingFilters actualizado
    FF->>U: FilterSummary muestra filtros pendientes
    
    U->>FF: Hace clic en "Aplicar Filtros"
    FF->>FS: applyFilters()
    FS->>FS: setCurrentFilters(pendingFilters)
    FS->>AQ: Query key cambia: ['autos', 'list', {marca: "Toyota", año: 2020}]
    AQ->>AS: getAutos({pageParam: 1, filters: "marca=Toyota&año=2020"})
    AS->>MD: filterVehicles(mockVehicles, filters)
    MD->>AS: Vehículos filtrados
    AS->>AQ: Resultado con vehículos Toyota 2020
    AQ->>FS: Datos cacheados
    FS->>UI: cars actualizado
    UI->>U: Muestra solo vehículos Toyota 2020
    
    Note over FS: Notificación de éxito
    FS->>U: "Filtros aplicados correctamente. X vehículos encontrados."
```

---

## 🧹 **3. Flujo de Limpieza de Filtros**

```mermaid
sequenceDiagram
    participant U as Usuario
    participant FS as FilterSummary
    participant HF as useFilterSystem
    participant AQ as React Query
    participant AS as autoService
    participant UI as AutosGrid

    U->>FS: Hace clic en [X] de filtro "marca"
    FS->>HF: clearFilter("marca")
    HF->>HF: delete currentFilters.marca
    HF->>HF: delete pendingFilters.marca
    HF->>AQ: Query key cambia: ['autos', 'list', {año: 2020}]
    AQ->>AS: getAutos({pageParam: 1, filters: "año=2020"})
    AS->>AS: filterVehicles(mockVehicles, {año: 2020})
    AS->>AQ: Vehículos del año 2020 (cualquier marca)
    AQ->>HF: Datos actualizados
    HF->>UI: cars actualizado
    UI->>U: Muestra vehículos del año 2020
    
    Note over HF: Notificación
    HF->>U: "Filtro marca removido."

    U->>FS: Hace clic en "Limpiar todos"
    FS->>HF: clearAllFilters()
    HF->>HF: setCurrentFilters({})
    HF->>HF: setPendingFilters({})
    HF->>AQ: Query key cambia: ['autos', 'list', {}]
    AQ->>AS: getAutos({pageParam: 1, filters: ""})
    AS->>AS: Retorna todos los vehículos
    AS->>AQ: Todos los vehículos
    AQ->>HF: Datos actualizados
    HF->>UI: cars actualizado
    UI->>U: Muestra todos los vehículos
    
    Note over HF: Notificación
    HF->>U: "Todos los filtros han sido limpiados."
```

---

## 📄 **4. Flujo de Paginación Infinita**

```mermaid
sequenceDiagram
    participant U as Usuario
    participant AG as AutosGrid
    participant IO as Intersection Observer
    participant HF as useFilterSystem
    participant AQ as React Query
    participant AS as autoService

    U->>AG: Hace scroll hacia abajo
    AG->>IO: Usuario se acerca al final
    IO->>AG: Trigger detectado
    AG->>HF: loadMore()
    HF->>AQ: fetchNextPage()
    AQ->>AS: getAutos({pageParam: 2, filters: currentFilters})
    AS->>AS: paginateVehicles(filteredVehicles, 2, 6)
    AS->>AQ: Página 2 de vehículos
    AQ->>HF: Datos agregados al array existente
    HF->>AG: cars actualizado con más vehículos
    AG->>U: Muestra vehículos adicionales
    
    Note over AG: Si hay más páginas
    AG->>IO: Continúa observando para siguiente página
    IO->>AG: Trigger para página 3
    AG->>HF: loadMore() nuevamente
    HF->>AQ: fetchNextPage() para página 3
    AQ->>AS: getAutos({pageParam: 3, filters: currentFilters})
    AS->>AQ: Página 3 de vehículos
    AQ->>HF: Más vehículos agregados
    HF->>AG: cars actualizado
    AG->>U: Muestra aún más vehículos
    
    Note over AG: Cuando no hay más páginas
    AS->>AQ: hasMore: false
    AQ->>HF: hasNextPage: false
    HF->>AG: No más páginas disponibles
    AG->>U: Muestra mensaje "No hay más vehículos"
```

---

## 📱 **5. Flujo Responsive (Desktop vs Mobile)**

```mermaid
graph TD
    A[Usuario accede a la página] --> B{¿Es Desktop?}
    
    B -->|Sí| C[Layout Desktop]
    B -->|No| D[Layout Mobile]
    
    C --> E[FilterForm en sidebar fijo]
    E --> F[FilterSummary debajo del formulario]
    F --> G[AutosGrid en área principal]
    G --> H[Usuario configura filtros en sidebar]
    H --> I[Usuario aplica filtros]
    I --> J[Resultados se muestran en grid]
    
    D --> K[FilterButton flotante visible]
    K --> L[Usuario hace clic en FilterButton]
    L --> M[FilterDrawer se abre desde la derecha]
    M --> N[FilterForm dentro del drawer]
    N --> O[Usuario configura filtros en drawer]
    O --> P[Usuario aplica filtros]
    P --> Q[FilterDrawer se cierra]
    Q --> R[FilterSummary en área principal]
    R --> S[AutosGrid muestra resultados]
    
    J --> T[Scroll independiente]
    S --> U[Scroll completo de la página]
    
    T --> V[Intersection Observer para paginación]
    U --> V
    V --> W[Carga más vehículos automáticamente]
```

---

## 🔄 **6. Flujo de Estados y Cache**

```mermaid
stateDiagram-v2
    [*] --> Inicial: Página cargada
    
    Inicial --> Cargando: Query infinita iniciada
    Cargando --> ConDatos: Datos cargados exitosamente
    Cargando --> Error: Error en la carga
    
    ConDatos --> ConfigurandoFiltros: Usuario cambia filtros
    ConfigurandoFiltros --> ConDatos: Usuario cancela
    ConfigurandoFiltros --> AplicandoFiltros: Usuario aplica filtros
    
    AplicandoFiltros --> ConDatosFiltrados: Filtros aplicados
    AplicandoFiltros --> Error: Error al aplicar filtros
    
    ConDatosFiltrados --> ConfigurandoFiltros: Usuario cambia filtros
    ConDatosFiltrados --> ConDatos: Usuario limpia todos los filtros
    ConDatosFiltrados --> CargandoMas: Usuario hace scroll
    
    CargandoMas --> ConDatosFiltrados: Más datos cargados
    CargandoMas --> Error: Error al cargar más
    
    Error --> ConDatos: Reintento exitoso
    Error --> Inicial: Recarga de página
    
    ConDatosFiltrados --> SinMasDatos: No hay más páginas
    SinMasDatos --> ConDatosFiltrados: Usuario cambia filtros
    
    note right of Inicial
        Estado inicial sin filtros
        Cache vacío
    end note
    
    note right of ConDatos
        Todos los vehículos cargados
        Cache: ['autos', 'list', {}]
    end note
    
    note right of ConDatosFiltrados
        Vehículos filtrados
        Cache: ['autos', 'list', {filtros}]
    end note
    
    note right of CargandoMas
        Paginación infinita
        Intersection Observer activo
    end note
```

---

## ⚠️ **7. Flujo de Manejo de Errores**

```mermaid
graph TD
    A[Operación iniciada] --> B{¿Hay error?}
    
    B -->|No| C[Operación exitosa]
    B -->|Sí| D[Error detectado]
    
    D --> E{¿Tipo de error?}
    
    E -->|Error de red| F[Mostrar notificación de error]
    E -->|Error de validación| G[Mostrar error en formulario]
    E -->|Error de servidor| H[Mostrar mensaje de servidor]
    E -->|Error de cache| I[Limpiar cache y reintentar]
    
    F --> J[Usuario puede reintentar]
    G --> K[Usuario debe corregir datos]
    H --> L[Usuario puede reintentar]
    I --> M[Sistema reintenta automáticamente]
    
    J --> N{¿Reintento exitoso?}
    K --> O{¿Datos corregidos?}
    L --> P{¿Reintento exitoso?}
    M --> Q{¿Reintento exitoso?}
    
    N -->|Sí| C
    N -->|No| R[Mostrar error persistente]
    
    O -->|Sí| S[Continuar operación]
    O -->|No| T[Mostrar error de validación]
    
    P -->|Sí| C
    P -->|No| U[Mostrar error de servidor persistente]
    
    Q -->|Sí| C
    Q -->|No| V[Mostrar error de cache persistente]
    
    R --> W[Usuario puede recargar página]
    T --> X[Usuario debe corregir formulario]
    U --> Y[Usuario puede contactar soporte]
    V --> Z[Sistema puede usar datos offline]
    
    C --> AA[Operación completada]
    W --> BB[Recargar página]
    X --> CC[Volver a intentar]
    Y --> DD[Contactar soporte]
    Z --> EE[Usar datos cacheados]
```

---

## 🎯 **8. Flujo de Datos Completo**

```mermaid
graph LR
    subgraph "Frontend Components"
        A[FilterForm]
        B[FilterSummary]
        C[FilterDrawer]
        D[FilterButton]
        E[AutosGrid]
    end
    
    subgraph "State Management"
        F[useFilterSystem]
        G[FilterContext]
        H[React Query]
    end
    
    subgraph "Data Layer"
        I[autoService]
        J[Mock Data]
        K[Cache]
    end
    
    A --> F
    B --> F
    C --> F
    D --> F
    E --> F
    
    F --> G
    G --> H
    
    H --> I
    I --> J
    I --> K
    
    K --> H
    H --> G
    G --> F
    
    F --> A
    F --> B
    F --> C
    F --> D
    F --> E
```

---

## 📊 **9. Flujo de Performance y Optimizaciones**

```mermaid
graph TD
    A[Usuario interactúa] --> B{¿Cambio de filtros?}
    
    B -->|Sí| C[Validar si es cambio significativo]
    B -->|No| D[No hacer nada]
    
    C --> E{¿Filtros válidos?}
    E -->|No| F[Mostrar error de validación]
    E -->|Sí| G[Verificar cache]
    
    G --> H{¿Existe en cache?}
    H -->|Sí| I[Usar datos cacheados]
    H -->|No| J[Hacer petición al servidor]
    
    I --> K[Actualizar UI inmediatamente]
    J --> L[Mostrar estado de carga]
    L --> M[Petición HTTP]
    M --> N{¿Respuesta exitosa?}
    
    N -->|Sí| O[Cachear resultado]
    N -->|No| P[Manejar error]
    
    O --> Q[Actualizar UI]
    P --> R[Mostrar error]
    
    K --> S[Operación completada]
    Q --> S
    R --> T[Usuario puede reintentar]
    
    D --> U[No re-render]
    F --> V[Corregir datos]
    T --> W[Reintentar operación]
    V --> B
    W --> B
```

---

## 🔧 **10. Flujo de Desarrollo y Mantenimiento**

```mermaid
graph TD
    A[Agregar nuevo filtro] --> B[Actualizar FILTER_OPTIONS]
    B --> C[Agregar campo en FilterForm]
    C --> D[Agregar lógica en filterVehicles]
    D --> E[Actualizar DEFAULT_FILTER_VALUES]
    E --> F[Probar funcionalidad]
    F --> G{¿Funciona correctamente?}
    
    G -->|Sí| H[Filtro implementado]
    G -->|No| I[Debuggear problema]
    
    I --> J{¿Error en frontend?}
    J -->|Sí| K[Revisar FilterForm]
    J -->|No| L[Revisar lógica de filtrado]
    
    K --> M[Corregir validaciones]
    L --> N[Corregir filterVehicles]
    
    M --> F
    N --> F
    
    H --> O[Documentar cambios]
    O --> P[Commit y deploy]
    
    Q[Modificar comportamiento] --> R{¿Qué componente?}
    R -->|FilterForm| S[Modificar validaciones]
    R -->|FilterSummary| T[Modificar presentación]
    R -->|FilterDrawer| U[Modificar animaciones]
    R -->|AutosGrid| V[Modificar layout]
    
    S --> W[Probar cambios]
    T --> W
    U --> W
    V --> W
    
    W --> X{¿Funciona?}
    X -->|Sí| P
    X -->|No| Y[Revisar y corregir]
    Y --> W
```

---

## 📝 **Resumen de Flujos**

### **Flujos Principales:**
1. **Inicialización**: Sistema se carga sin filtros
2. **Configuración**: Usuario configura filtros pendientes
3. **Aplicación**: Filtros se aplican y datos se actualizan
4. **Limpieza**: Filtros se remueven individual o masivamente
5. **Paginación**: Carga automática de más datos al hacer scroll

### **Flujos de Error:**
1. **Validación**: Errores en formulario
2. **Red**: Errores de conexión
3. **Servidor**: Errores del backend
4. **Cache**: Errores de datos cacheados

### **Flujos de Performance:**
1. **Cache**: Uso inteligente de React Query
2. **Memoización**: Evitar re-renders innecesarios
3. **Lazy Loading**: Carga progresiva de datos
4. **Optimización**: Intersection Observer para scroll

### **Flujos Responsive:**
1. **Desktop**: Sidebar fijo con formulario
2. **Mobile**: Drawer lateral con botón flotante
3. **Adaptación**: Componentes se adaptan al dispositivo

Estos diagramas proporcionan una **visión completa y detallada** de cómo funciona el sistema de filtrado de Indiana Usados, facilitando el entendimiento, desarrollo y mantenimiento del sistema. 