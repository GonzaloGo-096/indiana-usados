## Prompt Frontend – inspección quirúrgica (no cambiar comportamiento)

Pegar en Cursor (frontend).

No hagas cambios funcionales. Solo mostrar código y agregar los SIGUIENTES logs temporales mínimos.

### Archivos a abrir y mostrar completos
- `src/pages/admin/Dashboard/Dashboard.jsx`
- `src/features/cars/ui/CarFormRHF.jsx`
- `src/features/cars/ui/useImageReducer.js`

### Qué mostrar en cada archivo

#### Dashboard.jsx
1) Helpers usados por el extractor:
   - `resolveUrlString`
   - `withBaseUrl`

2) Función completa:
   - `extractImageUrls(vehicle)`

3) Donde se arma `initialData` y se llama a `openEditForm`:
   - Cuerpo de `handleOpenEditForm(vehicle)` hasta el `dispatch(openEditForm(carData))`.

4) Agregar SOLO este log (antes del `dispatch`):
```javascript
console.debug('[DEBUG] initialData.urls sample', {
  fotoExtra1: carData?.urls?.fotoExtra1,
  fotoExtra2: carData?.urls?.fotoExtra2,
  fotoExtra3: carData?.urls?.fotoExtra3,
});
```

#### useImageReducer.js
1) Lista de keys que inicializa (extras):
   - `IMAGE_FIELDS.extras` (debe contener `fotoExtra1..fotoExtra8`).

2) Código exacto del caso `INIT_EDIT` del reducer (para ver cómo setea `existingUrl`).

3) Código exacto de `getPreviewFor(key)`.

4) Agregar SOLO estos logs:
- Dentro de `INIT_EDIT`, al inicio:
```javascript
console.debug('[DEBUG] INIT_EDIT incoming urls', {
  f1: urls?.fotoExtra1, f2: urls?.fotoExtra2, f3: urls?.fotoExtra3
});
```
- Dentro de `getPreviewFor(key)`, ANTES del return:
```javascript
const p = file ? URL.createObjectURL(file) : (existingUrl || null);
console.debug('[DEBUG] getPreviewFor', { key, existingUrl, file: !!file, remove: !!remove, preview: p });
return p;
```

#### CarFormRHF.jsx
1) Dónde se llama a `useImageReducer(mode, initialData)` y se pasa `initialData`.
2) El map/bucle que recorre las fotos extra (usa `IMAGE_FIELDS.extras`).

No agregar logs en este archivo.

### Búsquedas textuales (no editar)
Buscar en el repo y listar coincidencias (para entender superficies):
- `fotosExtra`, `fotosExtras`, `fotoExtra1`, …, `fotoExtra8`, `withBaseUrl`, `secure_url`, `public_id`.
- Reportar dónde está definida `withBaseUrl` y dónde se usa.

### Qué devolver en la respuesta de Cursor
1) Snippets completos de:
   - `resolveUrlString`, `withBaseUrl`, `extractImageUrls`.
   - `handleOpenEditForm` (desde que arma `carData` hasta el `dispatch`).
   - `IMAGE_FIELDS.extras`.
   - Caso `INIT_EDIT` del reducer.
   - `getPreviewFor`.
   - Lazo/map de extras en `CarFormRHF`.

2) La lista exacta de keys para extras:
   - `['fotoExtra1','fotoExtra2','fotoExtra3','fotoExtra4','fotoExtra5','fotoExtra6','fotoExtra7','fotoExtra8']`

3) Salidas de logs (copiar/pegar de consola) para un vehículo que tenga extras:
   - `[DEBUG] initialData.urls sample ...`
   - `[DEBUG] INIT_EDIT incoming urls ...`
   - `[DEBUG] getPreviewFor ...` (para al menos `fotoExtra1..3`).

Nota: Mantener este scope mínimo para no introducir ruido; objetivo es verificar si `existingUrl` llega vacío y en qué punto se pierde.


