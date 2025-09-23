## Reporte técnico: Preview de Fotos Extra en formulario de Edición

### 1) Resumen del problema
- En el formulario de edición, los contenedores de “Foto existente” de las fotos extra muestran “Sin imagen”.
- Los logs agregados en `useImageReducer.getPreviewFor` muestran `existingUrl: ""` para `fotoExtra1..8`, incluso en vehículos que sí tienen imágenes extra en backend.
- Resultado: no hay previsualización para las fotos extra aunque existan en el backend.

### 2) Flujo actual de datos en el frontend (lectura → mapeo → render)
1. Lista/selección de vehículo en `Dashboard.jsx`.
2. `extractImageUrls(vehicle)` arma `initialData.urls` con:
   - `fotoPrincipal` y `fotoHover` directamente del vehículo.
   - `fotoExtra1..fotoExtra8` tomados preferentemente de `vehicle.fotosExtra` (array de objetos del backend). Si falta, fallback a `vehicle.fotoExtraN` (string u objeto).
   - En todos los casos se intenta producir un objeto con forma `{ url, public_id, original_name }`.
3. `openEditForm(carData)` pasa `initialData` (incluye `urls`) al componente `CarFormRHF`.
4. `CarFormRHF` llama `useImageReducer(mode, initialData)` y dispara `initImageState('edit', initialData)`.
5. `useImageReducer` → `INIT_EDIT` inicializa `imageState[key]` para cada imagen con:
   - `existingUrl` (string), `publicId`, `originalName`, `file: null`, `remove: false`.
   - Si `urls[key]` es string: usa ese string como `existingUrl`.
   - Si `urls[key]` es objeto: usa `urls[key].url` como `existingUrl`.
6. Render en `CarFormRHF`:
   - Para cada `fotoExtraN`, obtiene `preview = getPreviewFor(key)`.
   - `getPreviewFor` retorna: `ObjectURL(file)` si hay archivo, si no `existingUrl` si existe y no está `remove`, si no `null`.
   - Si `preview` es null → se muestra “Sin imagen”.

### 3) Contrato esperado del backend
- Lectura (GET de un vehículo):
  - Campo `fotosExtra` (o `fotosExtras` según versión): array de objetos con forma:
    - `{ url: string, public_id: string, original_name: string }`.
  - También pueden existir campos legados `fotoExtra1..fotoExtra8` (string u objeto con `url`/`public_id`).
- Actualización (PUT `/photos/updatephoto/:id`): FormData con:
  - `fotoPrincipal` (File) y/o `fotoHover` (File) si se reemplazan.
  - Varias `fotosExtra` (File) agregadas como múltiples entradas del mismo campo si se suben nuevas extras.
  - `fotosExtraToDelete` (string JSON) con array de `public_id` de extras a eliminar.
  - Si una imagen no cambia, no se vuelve a enviar.

### 4) Estado actual del código (archivos relevantes)
- `src/pages/admin/Dashboard/Dashboard.jsx`
  - Función `extractImageUrls(vehicle)` construye `initialData.urls`.
  - Actualmente contempla: `fotosExtra` y `fotosExtras` (array), más fallback a `fotoExtra1..8`.
  - Normaliza URL con `withBaseUrl()` cuando son relativas.
- `src/features/cars/ui/CarFormRHF.jsx`
  - Recibe `initialData` y sincroniza con `useImageReducer`.
  - Renderiza cada slot extra usando `getPreviewFor(key)` y muestra “Sin imagen” si retorna `null`.
- `src/features/cars/ui/useImageReducer.js`
  - `INIT_EDIT`: si `urls[key]` es string → `existingUrl = string`; si es objeto → `existingUrl = urls[key].url`.
  - `getPreviewFor(key)`: devuelve `existingUrl` cuando no hay `file` ni `remove`.
  - Logs actuales muestran `existingUrl: ""` para los extras.

### 5) Hallazgos de inconsistencia
- La previsualización depende de que `initialData.urls.fotoExtraN` contenga un string URL o un objeto con campo `url` no vacío.
- Los logs de `getPreviewFor` demuestran que `existingUrl` llega vacío para `fotoExtra1..8`.
- Conclusión: el problema ocurre al construir `initialData.urls` (o antes), no en el render.

### 6) Hipótesis concretas del fallo
1) El backend entrega `fotosExtra(s)` pero la estructura real no coincide con la supuesta (por ejemplo, `url` con otro nombre de campo, o el array viene anidado en otra propiedad). Resultado: `resolveUrlString(extraItem?.url)` No obtiene valor → `existingUrl` vacío.
2) Los valores de `fotoExtra1..8` legados existen pero son objetos distintos (p.ej. `{ secure_url: "..." }`) y no se mapean a `url` en `extractImageUrls`.
3) Las URLs del backend son relativas pero sin base utilizable (por ejemplo, faltante de `axiosInstance.defaults.baseURL`), dejando la URL final vacía/incorrecta.
4) El `vehicle` que llega a `handleOpenEditForm` no trae las imágenes en `vehicle` sino en otra propiedad (`vehicle._original` o similar) y el extractor no lo está leyendo bien en ese caso concreto.

### 7) Checklist de verificación (mínima, sin cambios invasivos)
1. En `handleOpenEditForm(vehicle)`, loggear y verificar exactamente:
   - `vehicle.fotosExtra`, `vehicle.fotosExtras`, `vehicle.fotoExtra1..8`, y también las mismas en `vehicle._original`.
   - Para cada ítem del array, imprimir sus claves: `Object.keys(item)` y ejemplo de valores.
2. En `extractImageUrls(vehicle)`, antes de mapear, normalizar cada `extraItem` a un objeto con propiedad `url`:
   - Si el ítem es string → `url = string`.
   - Si es objeto → `url = item.url || item.secure_url || item.path || item.src`.
   - Sólo si `url` queda truthy, setear `urls[fotoExtraN]`.
3. Confirmar que `initialData.urls.fotoExtraN` llega a `CarFormRHF` con `url` no vacío (log corto en `Dashboard` después de construir `urls`).
4. Confirmar que `useImageReducer INIT_EDIT` asigna `existingUrl` a ese `url` (log corto en el init).

### 8) Corrección mínima recomendada (sin agregar lógica ajena al contrato)
- En `extractImageUrls` (único lugar):
  - Al construir cada `fotoExtraN`, derivar una `resolvedUrl` de forma robusta:
    - `resolvedUrl = extraItem` si es string.
    - si objeto: `extraItem.url || extraItem.secure_url || extraItem.path || extraItem.src`.
  - No rellenar con valores inventados si no hay `resolvedUrl`; dejar `null`.
  - No añadir más fuentes que las definidas por backend (mantenerse en `fotosExtra(s)` y legados `fotoExtra1..8`).

Pseudocódigo exacto del mapeo de cada extra:
```js
const item = fuente[i]
let resolvedUrl = ''
if (typeof item === 'string') resolvedUrl = item
else if (item && typeof item === 'object') resolvedUrl = item.url || item.secure_url || item.path || item.src || ''
urls[fotoExtraN] = resolvedUrl ? { url: resolvedUrl, public_id: item?.public_id || '', original_name: item?.original_name || '' } : null
```

### 9) Cómo espera el backend que trabajemos (resumen operativo)
- Lectura: consumir `fotosExtra` (array de objetos con `url`) cuando esté disponible; soportar legados `fotoExtra1..8` si aparecen.
- Render (preview): usar los `url` existentes; si no hay, mostrar placeholder.
- Update (PUT `/photos/updatephoto/:id`):
  - Enviar sólo los `File` seleccionados para `fotoPrincipal`, `fotoHover` y `fotosExtra`.
  - Enviar `fotosExtraToDelete` con `public_id` de extras a eliminar.
  - No re-enviar imágenes no cambiadas.

### 10) Cómo probar
1. Abrir un vehículo que en backend tenga al menos una extra válida; verificar que `initialData.urls.fotoExtra1.url` tenga string no vacío.
2. Confirmar en el modal que el primer slot extra muestra la imagen (ya que `getPreviewFor` devolverá ese `existingUrl`).
3. Probar también un vehículo sin extras → debería mostrar “Sin imagen” en todos los slots extra (comportamiento esperado).

---
Este documento resume el problema, el flujo y el contrato backend para que un asistente pueda ubicar el punto exacto de falla (mapeo de `url` en `extractImageUrls`) y aplicar una corrección mínima sin introducir lógica ajena.


