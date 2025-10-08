## Hooks

Estructura orientada por dominio para mayor claridad, cohesión y escalabilidad.

### Dominios
- auth/: autenticación y sesión (`useAuth` consolidado con auto-logout y validación de token)
- ui/: UI/viewport y scroll (`DeviceProvider`, `useDevice`, `useScrollPosition`)
- vehicles/: datos e imágenes de vehículos (`useVehiclesList`, `useVehicleDetail`, `useVehicleImage`)
- images/: utilidades de imágenes transversales (`useImageOptimization` + subhooks)
- admin/: operaciones CRUD de vehículos (`useCarMutation` con React Query mutations)
- perf/: preload y performance (`usePreloadImages`, `usePreloadRoute`)

### Import recomendado
- Preferir el barrel único:
```js
import { DeviceProvider, useDevice, useAuth, useVehiclesList } from '@hooks'
```
- Usar dominios solo si necesitas granularidad explícita:
```js
import { useDevice } from '@hooks/ui'
```

### Uso de DeviceProvider
```js
// Por defecto (breakpoint 768px, debounce 150ms)
<DeviceProvider>
  <App />
</DeviceProvider>

// Personalizado
<DeviceProvider breakpoint={640} debounceMs={200}>
  <App />
</DeviceProvider>

// En componentes
const { isMobile, isDesktop, deviceType } = useDevice()
```

### Convenciones
- Nombre de archivo: `useXxx.js` (o `.jsx` solo si retorna JSX, p.ej. `DeviceProvider`).
- Exports nombrados y claros; evitar defaults salvo casos justificados.
- Hooks deben enfocarse a un solo objetivo (responsabilidad única). Extraer helpers si aparece duplicación.

### Crear un nuevo hook
1) Ubicar en el dominio correcto (crear subcarpeta si es necesario).
2) Exportar desde el `index.js` del dominio y automáticamente estará disponible vía `@hooks`.
3) Mantener dependencias mínimas y evitar acoplar dominios (p.ej., `ui` no debería importar `vehicles`).

Snippet base:
```js
// src/hooks/ui/useFoo.js
import { useMemo } from 'react'

export const useFoo = (input) => {
  return useMemo(() => computeFoo(input), [input])
}

// src/hooks/ui/index.js
export { useFoo } from './useFoo'

// Uso
import { useFoo } from '@hooks'
```

### Notas
- `@hooks/index.js` reexporta los hooks públicos y actúa como API estable.
- La estructura permite refactors internos sin romper imports en el resto del proyecto.


