# 🔴 Solución: Error 500 del Backend

## 🎯 Problema Actual

- ✅ **Frontend:** Funciona correctamente, se conecta a `https://back-indiana.vercel.app`
- ❌ **Backend:** Responde con error 500 (Internal Server Error)

**Endpoint que falla:**
```
GET https://back-indiana.vercel.app/photos/getallphotos?limit=3&cursor=1
Status: 500 (Internal Server Error)
```

---

## 🔍 Paso 1: Revisar Logs del Backend en Vercel

### 1.1. Acceder al Proyecto del Backend

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Busca el proyecto **`back-indiana`** (o el nombre de tu backend)
3. **IMPORTANTE:** Debe ser el proyecto del **backend**, no del frontend

### 1.2. Ver Logs del Deployment

1. Click en la pestaña **"Deployments"**
2. Click en el **deployment más reciente** (el primero de la lista)
3. Busca el botón **"View Function Logs"** o **"Logs"** y haz click
4. También puedes hacer click en **"Runtime Logs"** o **"Function Logs"**

### 1.3. Buscar Errores

En los logs, busca:
- Mensajes en **rojo**
- Palabras clave: `Error`, `MongoError`, `Connection`, `undefined`, `Cannot read`, `MONGO_URL`, `JWT_SECRET`

**Copia el error completo** que veas (es importante para diagnosticar)

---

## 🔍 Paso 2: Verificar Variables de Entorno del Backend

### 2.1. Acceder a Variables de Entorno

1. En el proyecto del backend en Vercel
2. Ve a **Settings → Environment Variables**
3. Verifica que estas variables estén configuradas:

### 2.2. Variables Obligatorias

#### ✅ MONGO_URL (Base de Datos)
- **Nombre:** `MONGO_URL`
- **Valor:** `mongodb+srv://usuario:password@cluster.mongodb.net/indiana?retryWrites=true&w=majority`
- **Scope:** Production, Preview, Development (o al menos Production)
- **Estado:** ⚠️ **OBLIGATORIA**

#### ✅ JWT_SECRET (Autenticación)
- **Nombre:** `JWT_SECRET`
- **Valor:** Una cadena larga y aleatoria (ej: `mi_clave_secreta_muy_larga_y_segura_12345`)
- **Scope:** Production, Preview, Development (o al menos Production)
- **Estado:** ⚠️ **OBLIGATORIA**

#### ✅ SUPER_USER (Permisos)
- **Nombre:** `SUPER_USER`
- **Valor:** `super_user_role` (o el valor que uses en tu backend)
- **Scope:** Production, Preview, Development (o al menos Production)
- **Estado:** ⚠️ **OBLIGATORIA** (si usas rutas protegidas)

#### ✅ CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET (Cloudinary)
- **Nombres:** `CLOUD_NAME`, `CLOUD_KEY`, `CLOUD_SECRET`
- **Valores:** Tus credenciales de Cloudinary
- **Scope:** Production, Preview, Development (o al menos Production)
- **Estado:** ⚠️ **OBLIGATORIA** (si subes imágenes)

### 2.3. Si Falta Alguna Variable

1. Click en **"Add Environment Variable"**
2. Agrega el nombre y valor
3. Selecciona el scope (al menos **Production**)
4. Click en **"Save"**
5. **IMPORTANTE:** Haz un **redeploy** del backend (ver Paso 3)

---

## 🔄 Paso 3: Hacer Redeploy del Backend

### 3.1. Redeploy Manual

1. En el proyecto del backend en Vercel
2. Ve a la pestaña **"Deployments"**
3. Click en los **3 puntos (⋯)** del deployment más reciente
4. Click en **"Redeploy"**
5. En el diálogo, verifica que diga que usará las variables actuales
6. Click en **"Redeploy"** o **"Confirm"**
7. Espera 2-3 minutos a que termine el build

### 3.2. Verificar el Redeploy

1. Espera a que el deployment termine (verás un check verde ✅)
2. Prueba el endpoint de nuevo (ver Paso 4)

---

## 🧪 Paso 4: Probar el Backend Directamente

### 4.1. Probar en el Navegador

Abre esta URL en tu navegador:

```
https://back-indiana.vercel.app/photos/getallphotos
```

### 4.2. Interpretar Resultados

#### ✅ Funciona (Status 200):
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
**Significado:** El backend funciona correctamente. El problema puede estar en los parámetros o en el frontend.

#### ❌ Error 500:
Verás un JSON de error o un mensaje de error:
```json
{
  "error": true,
  "msg": "Error message here"
}
```
**Significado:** El backend tiene un error. Revisa los logs (Paso 1) y las variables (Paso 2).

---

## 🔧 Errores Comunes y Soluciones

### Error 1: "MONGO_URL is not defined"

**Síntoma en logs:**
```
Error: MONGO_URL is not defined
```

**Solución:**
1. Ve a **Settings → Environment Variables** en el proyecto del backend
2. Agrega: `MONGO_URL` = `mongodb+srv://usuario:password@cluster.mongodb.net/indiana?retryWrites=true&w=majority`
3. Haz un **redeploy** del backend

---

### Error 2: "Cannot connect to MongoDB"

**Síntoma en logs:**
```
MongoNetworkError: failed to connect to server
MongoServerError: Authentication failed
```

**Solución:**
1. Verifica que `MONGO_URL` sea correcta
2. Verifica que la IP esté whitelisted en MongoDB Atlas:
   - Ve a MongoDB Atlas → Network Access
   - Agrega `0.0.0.0/0` (permite todas las IPs) o la IP de Vercel
3. Verifica credenciales de MongoDB (usuario y contraseña)

---

### Error 3: "JWT_SECRET is not defined"

**Síntoma en logs:**
```
Error: JWT_SECRET is not defined
```

**Solución:**
1. Ve a **Settings → Environment Variables** en el proyecto del backend
2. Agrega: `JWT_SECRET` = `tu_clave_secreta_muy_larga_y_segura`
3. Haz un **redeploy** del backend

---

### Error 4: "Cannot read property 'X' of undefined"

**Síntoma en logs:**
```
TypeError: Cannot read property 'photos' of undefined
TypeError: Cannot read property 'find' of undefined
```

**Solución:**
1. El código del backend está intentando acceder a una propiedad que no existe
2. Revisa el código del endpoint `/photos/getallphotos` en el backend
3. Verifica que el modelo de MongoDB esté correctamente importado
4. Verifica que la conexión a MongoDB se haya establecido antes de hacer queries

---

### Error 5: "Route not found" o "404"

**Síntoma en logs:**
```
Error: Route not found
404 Not Found
```

**Solución:**
1. Verifica que la ruta `/photos/getallphotos` esté definida en el backend
2. Verifica que el backend esté usando el archivo de rutas correcto
3. Verifica que el servidor esté escuchando en el puerto correcto

---

## ✅ Checklist de Verificación

Completa esta lista para el **proyecto del backend** en Vercel:

- [ ] `MONGO_URL` configurada (con URL de producción)
- [ ] `JWT_SECRET` configurada (clave segura)
- [ ] `SUPER_USER` configurada (si usas rutas protegidas)
- [ ] `CLOUD_NAME` configurada (si subes imágenes)
- [ ] `CLOUD_KEY` configurada (si subes imágenes)
- [ ] `CLOUD_SECRET` configurada (si subes imágenes)
- [ ] Todas las variables tienen scope correcto (Production)
- [ ] Se hizo redeploy después de agregar variables
- [ ] Los logs del backend no muestran errores
- [ ] El endpoint responde correctamente cuando se prueba directamente

---

## 🆘 Siguiente Paso

Después de completar los pasos anteriores, comparte:

1. **¿Qué errores aparecen en los logs del backend?** (copia el error completo)
2. **¿Qué variables de entorno faltan?** (si es que falta alguna)
3. **¿El endpoint responde cuando lo pruebas directamente?** (qué ves en el navegador)

Con esa información podremos identificar exactamente qué está causando el error 500.

---

**Última actualización:** 2024-11-13

