# 🔍 Diagnóstico: Backend No Funciona en Producción

## 🎯 Problema

La aplicación funciona en producción, pero los componentes que consumen del backend no se muestran.

---

## 📋 Paso 1: Verificar Variables de Entorno

### 1.1. Abrir Consola del Navegador

1. Abre tu sitio en producción
2. Presiona **F12** (herramientas de desarrollador)
3. Ve a la pestaña **"Console"**

### 1.2. Verificar Variables

Escribe en la consola:

```javascript
console.log('🔍 DIAGNÓSTICO:');
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT);
console.log('Todas las variables:', import.meta.env);
```

**Resultado esperado:**
```
🔍 DIAGNÓSTICO:
API URL: https://back-indiana.vercel.app
Environment: production
```

**Si ves `undefined`:**
- ❌ Las variables no se aplicaron
- ✅ Solución: Haz un redeploy después de agregar variables

---

## 📋 Paso 2: Probar Conexión con el Backend

### 2.1. Probar Endpoint de Vehículos

En la consola, escribe:

```javascript
fetch(`${import.meta.env.VITE_API_URL}/photos/getallphotos`)
  .then(res => {
    console.log('✅ Status:', res.status);
    console.log('✅ Headers:', res.headers);
    return res.json();
  })
  .then(data => {
    console.log('✅ Datos recibidos:', data);
  })
  .catch(err => {
    console.error('❌ Error completo:', err);
    console.error('❌ Mensaje:', err.message);
  });
```

### 2.2. Interpretar Resultados

#### ✅ Éxito (Status 200):
```
✅ Status: 200
✅ Datos recibidos: { error: false, allPhotos: {...} }
```
**Significado:** El backend responde correctamente. El problema puede estar en el frontend.

#### ❌ Error CORS:
```
❌ Error: Failed to fetch
Access to fetch at 'https://back-indiana.vercel.app/photos/getallphotos' 
from origin 'https://tu-frontend.vercel.app' has been blocked by CORS policy
```
**Significado:** El backend no permite peticiones desde tu dominio.

**Solución:** El backend necesita configurar CORS (pero dijiste que dejamos eso de lado, así que si el backend tiene `app.use(cors())` debería funcionar).

#### ❌ Error 404:
```
✅ Status: 404
```
**Significado:** El endpoint no existe o la ruta es incorrecta.

**Verificar:** 
- Endpoint correcto: `/photos/getallphotos`
- Backend accesible: `https://back-indiana.vercel.app`

#### ❌ Network Error:
```
❌ Error: NetworkError when attempting to fetch resource
```
**Significado:** El backend no está accesible o hay un problema de red.

**Verificar:**
- ¿El backend está desplegado? Prueba: `https://back-indiana.vercel.app` en el navegador
- ¿Hay algún firewall bloqueando?

---

## 📋 Paso 3: Verificar Errores en la Consola

### 3.1. Revisar Errores en Rojo

1. Mantén la consola abierta
2. Recarga la página (F5)
3. Busca mensajes en **rojo**

**Errores comunes:**

#### Error: "Cannot read property of undefined"
```javascript
TypeError: Cannot read property 'vehicles' of undefined
```
**Causa:** El componente intenta acceder a datos que no existen.

**Solución:** Verificar que la respuesta del backend tenga el formato esperado.

#### Error: "Network Error"
```javascript
AxiosError: Network Error
```
**Causa:** No se puede conectar al backend.

**Solución:** Verificar que `VITE_API_URL` sea correcta y que el backend esté accesible.

#### Error: "Request failed with status code 404"
```javascript
AxiosError: Request failed with status code 404
```
**Causa:** El endpoint no existe.

**Solución:** Verificar la ruta del endpoint en el código.

---

## 📋 Paso 4: Verificar Pestaña Network

### 4.1. Abrir Network Tab

1. En las herramientas de desarrollador, ve a la pestaña **"Network"**
2. Recarga la página (F5)
3. Busca peticiones que empiecen con `photos` o `getallphotos`

### 4.2. Revisar Peticiones

**Busca:**
- Peticiones a `https://back-indiana.vercel.app/photos/getallphotos`
- Status code (200 = éxito, 404 = no encontrado, etc.)
- Response (datos que devuelve el backend)

**Si no ves ninguna petición:**
- El componente no está haciendo la petición
- Puede haber un error antes de llegar a hacer la petición

**Si ves la petición pero falla:**
- Revisa el Status code
- Revisa la Response (puede estar vacía o con error)

---

## 📋 Paso 5: Verificar que el Backend Esté Accesible

### 5.1. Probar Backend Directamente

Abre en el navegador:

```
https://back-indiana.vercel.app/photos/getallphotos
```

**Resultados posibles:**

#### ✅ Funciona:
Verás un JSON con datos de vehículos.

#### ❌ No funciona:
- **404 Not Found:** El endpoint no existe
- **CORS Error:** El backend no permite peticiones desde el navegador (normal, pero debería funcionar desde el frontend)
- **Error 500:** Error en el backend → **VER SECCIÓN "🔴 DIAGNÓSTICO ESPECÍFICO: Error 500" más abajo**

---

## 📋 Paso 6: Verificar Código del Frontend

### 6.1. Verificar Endpoint

El código usa este endpoint:
```javascript
/photos/getallphotos
```

**Verificar:**
- ¿Es el endpoint correcto según tu backend?
- ¿El backend espera parámetros? (limit, cursor, etc.)

### 6.2. Verificar Formato de Respuesta

El código espera esta estructura:
```javascript
{
  error: false,
  allPhotos: {
    photos: [...],
    hasNextPage: true/false,
    nextPage: number
  }
}
```

**Verificar:**
- ¿El backend devuelve este formato?
- ¿Los nombres de las propiedades coinciden?

---

## 🔧 Soluciones Comunes

### Problema 1: Variables No Se Aplicaron

**Síntomas:**
- `import.meta.env.VITE_API_URL` es `undefined`
- Las peticiones van a `http://localhost:3001`

**Solución:**
1. Verifica que las variables estén en Vercel
2. Haz un **redeploy**
3. Espera a que termine el build
4. Verifica de nuevo

### Problema 2: Backend No Responde (Error 500)

**Síntomas:**
- Status 500 (Internal Server Error)
- Network Error
- Timeout

**Solución:**
1. Verifica que el backend esté desplegado
2. Prueba el endpoint directamente en el navegador
3. **Revisa los logs del backend en Vercel** (VER SECCIÓN ESPECÍFICA ABAJO)
4. Verifica variables de entorno del backend

### Problema 3: Endpoint Incorrecto

**Síntomas:**
- Status 404
- "Not Found"

**Solución:**
1. Verifica la documentación del backend
2. Prueba el endpoint correcto
3. Actualiza el código si es necesario

### Problema 4: Formato de Respuesta Diferente

**Síntomas:**
- Status 200 pero no se muestran datos
- Error "Cannot read property"

**Solución:**
1. Revisa la respuesta real del backend en Network tab
2. Compara con lo que espera el código
3. Ajusta el mapper si es necesario

---

## 🔴 DIAGNÓSTICO ESPECÍFICO: Error 500 (Internal Server Error)

Si estás viendo un **error 500** del backend, sigue estos pasos:

### Paso 1: Verificar Logs del Backend en Vercel

1. **Abre el proyecto del backend en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Selecciona el proyecto **`back-indiana`** (o el nombre de tu backend)

2. **Ve a la pestaña "Deployments":**
   - Click en el deployment más reciente
   - Click en "View Function Logs" o "Logs"

3. **Busca errores:**
   - Busca mensajes en **rojo**
   - Busca palabras clave: `Error`, `MongoError`, `Connection`, `undefined`, `Cannot read`

**Errores comunes que verás:**

#### Error: "MONGO_URL is not defined"
```
Error: MONGO_URL is not defined
```
**Causa:** Falta la variable `MONGO_URL` en el backend.

**Solución:**
1. Ve a **Settings → Environment Variables** en el proyecto del backend
2. Agrega: `MONGO_URL` = `mongodb+srv://usuario:password@cluster.mongodb.net/indiana?retryWrites=true&w=majority`
3. Haz un **redeploy** del backend

#### Error: "Cannot connect to MongoDB"
```
MongoNetworkError: failed to connect to server
```
**Causa:** La URL de MongoDB es incorrecta o el servidor no está accesible.

**Solución:**
1. Verifica que `MONGO_URL` sea correcta
2. Verifica que la IP esté whitelisted en MongoDB Atlas (si usas Atlas)
3. Verifica credenciales de MongoDB

#### Error: "JWT_SECRET is not defined"
```
Error: JWT_SECRET is not defined
```
**Causa:** Falta la variable `JWT_SECRET` en el backend.

**Solución:**
1. Ve a **Settings → Environment Variables** en el proyecto del backend
2. Agrega: `JWT_SECRET` = `tu_clave_secreta_muy_larga_y_segura`
3. Haz un **redeploy** del backend

#### Error: "Cannot read property 'X' of undefined"
```
TypeError: Cannot read property 'photos' of undefined
```
**Causa:** Error en el código del backend (acceso a propiedad inexistente).

**Solución:**
1. Revisa el código del endpoint `/photos/getallphotos` en el backend
2. Verifica que el código maneje casos donde los datos pueden ser `undefined`
3. Agrega validaciones y manejo de errores

### Paso 2: Verificar Variables de Entorno del Backend

**Variables requeridas para el backend:**

1. **MONGO_URL** (Base de datos)
   - Formato: `mongodb+srv://usuario:password@cluster.mongodb.net/indiana?retryWrites=true&w=majority`
   - **Obligatoria:** ✅

2. **JWT_SECRET** (Autenticación)
   - Formato: Cadena larga y aleatoria
   - **Obligatoria:** ✅

3. **SUPER_USER** (Permisos)
   - Formato: `super_user_role`
   - **Obligatoria:** ✅ (si usas rutas protegidas)

4. **CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET** (Cloudinary)
   - **Obligatoria:** ✅ (si subes imágenes)

5. **PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY, PAYPAL_API** (PayPal)
   - **Obligatoria:** ❌ (solo si usas pagos)

6. **PORT** (Puerto)
   - Formato: `3001`
   - **Obligatoria:** ❌ (Vercel lo asigna automáticamente)

**Cómo verificar en Vercel:**

1. Ve al proyecto del backend en Vercel
2. Click en **Settings → Environment Variables**
3. Verifica que todas las variables obligatorias estén configuradas
4. Verifica que el **scope** sea correcto (Production, Preview, Development)

**Si falta alguna variable:**
1. Agrégalas
2. Haz un **redeploy** del backend
3. Espera 2-3 minutos
4. Prueba de nuevo

### Paso 3: Probar el Backend Directamente

Abre en el navegador:

```
https://back-indiana.vercel.app/photos/getallphotos
```

**Resultados posibles:**

#### ✅ Funciona:
Verás un JSON con datos:
```json
{
  "error": false,
  "allPhotos": {
    "docs": [...],
    "totalDocs": 10,
    "hasNextPage": true,
    "nextPage": 2
  }
}
```

#### ❌ Error 500:
Verás un JSON de error:
```json
{
  "error": true,
  "msg": "Error message here"
}
```

**Si ves un error 500:**
- Revisa los logs del backend (Paso 1)
- Verifica variables de entorno (Paso 2)
- Verifica que el código del backend esté correcto

### Paso 4: Verificar Código del Backend

Si los logs no muestran errores claros, verifica:

1. **El endpoint `/photos/getallphotos` existe:**
   - Busca en el código del backend: `routes/photosRoutes.js` o similar
   - Verifica que la ruta esté definida

2. **El código maneja errores:**
   - Verifica que haya `try/catch` en el controlador
   - Verifica que los errores se devuelvan con formato JSON

3. **La conexión a MongoDB está correcta:**
   - Verifica que el código se conecte a MongoDB antes de hacer queries
   - Verifica que el modelo `Photo` o similar esté definido

### Paso 5: Checklist de Variables del Backend

Completa esta lista para el **proyecto del backend** en Vercel:

- [ ] `MONGO_URL` configurada (con URL de producción)
- [ ] `JWT_SECRET` configurada (clave segura)
- [ ] `SUPER_USER` configurada (si usas rutas protegidas)
- [ ] `CLOUD_NAME` configurada (si subes imágenes)
- [ ] `CLOUD_KEY` configurada (si subes imágenes)
- [ ] `CLOUD_SECRET` configurada (si subes imágenes)
- [ ] Todas las variables tienen scope correcto (Production)
- [ ] Se hizo redeploy después de agregar variables

---

## ✅ Checklist de Diagnóstico

Completa cada paso y marca lo que encuentres:

- [ ] Variables de entorno configuradas correctamente
- [ ] `VITE_API_URL` muestra la URL correcta en consola
- [ ] Backend accesible (prueba directa en navegador)
- [ ] Petición se hace (visible en Network tab)
- [ ] Status code es 200 (éxito)
- [ ] Respuesta tiene el formato esperado
- [ ] No hay errores en consola
- [ ] Los datos se mapean correctamente

---

## 🆘 Siguiente Paso

Después de completar el diagnóstico, comparte:

1. **¿Qué muestra la consola cuando ejecutas el código de diagnóstico?**
2. **¿Qué Status code ves en Network tab?**
3. **¿Hay errores en rojo en la consola?**
4. **¿El backend responde cuando lo pruebas directamente?**

Con esa información podremos identificar exactamente dónde está el problema.

---

**Última actualización:** 2024-01-XX

