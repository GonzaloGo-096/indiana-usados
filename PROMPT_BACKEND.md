# 🔍 Prompt para Diagnosticar el Backend

## 📋 Lo que Necesito del Backend

Para diagnosticar el error 500, necesito ver estos archivos específicos del backend:

---

## 🎯 Archivos Críticos (Prioridad Alta)

### 1. **Controlador de `getallphotos`**
**Archivo:** `controllers/photoControllers.js` (o similar)

**Necesito ver:**
- La función que maneja `GET /photos/getallphotos`
- Cómo procesa los parámetros `limit` y `cursor`
- Cómo consulta MongoDB
- Cómo devuelve la respuesta

**Ejemplo de lo que busco:**
```javascript
// Algo como esto:
exports.getAllPhotos = async (req, res) => {
  // ... código aquí
}
```

---

### 2. **Ruta de Photos**
**Archivo:** `routes/photosRoutes.js` (o similar)

**Necesito ver:**
- Cómo está definida la ruta `/photos/getallphotos`
- Qué middleware usa (si requiere auth, etc.)

**Ejemplo de lo que busco:**
```javascript
// Algo como esto:
router.get('/getallphotos', photoController.getAllPhotos)
```

---

### 3. **Modelo de Photo/Vehicle**
**Archivo:** `models/Photo.js` o `models/PhotoModel.js` (o similar)

**Necesito ver:**
- La definición del esquema/modelo
- Qué campos tiene
- Cómo se estructura

---

### 4. **Conexión a MongoDB**
**Archivo:** `config/database.js` o `db/connection.js` (o similar)

**Necesito ver:**
- Cómo se conecta a MongoDB
- Si usa `MONGO_URL` de variables de entorno
- Si hay manejo de errores de conexión

---

## 📊 Formato de Respuesta Esperado

**El frontend espera esta estructura:**

```javascript
{
  allPhotos: {
    docs: [
      {
        _id: "...",
        marca: "...",
        modelo: "...",
        precio: 12345,
        anio: 2020,
        fotoPrincipal: { url: "..." },
        fotoHover: { url: "..." },
        // ... otros campos
      }
    ],
    totalDocs: 10,
    hasNextPage: true,
    nextPage: 2
  }
}
```

**¿Tu backend devuelve este formato?** Si no, ¿qué formato devuelve?

---

## 🔧 Variables de Entorno que Usa

**Necesito saber qué variables de entorno usa el backend:**

1. **MONGO_URL** - ¿Dónde se usa? (archivo y línea aproximada)
2. **JWT_SECRET** - ¿Dónde se usa?
3. **SUPER_USER** - ¿Dónde se usa?
4. **CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET** - ¿Dónde se usan?
5. Otras variables específicas

**Puedes compartir:**
- El archivo donde se cargan las variables (ej: `index.js`, `config/env.js`)
- O simplemente listar qué variables usa cada archivo

---

## 📝 Cómo Compartir la Información

### Opción 1: Compartir Archivos Completos
```
1. controllers/photoControllers.js
   [pegar contenido completo]

2. routes/photosRoutes.js
   [pegar contenido completo]

3. models/Photo.js
   [pegar contenido completo]

4. config/database.js
   [pegar contenido completo]
```

### Opción 2: Compartir Solo las Funciones Relevantes
```
1. Función getAllPhotos:
   [código de la función]

2. Ruta getallphotos:
   [código de la ruta]

3. Modelo Photo:
   [código del modelo]

4. Conexión MongoDB:
   [código de conexión]
```

---

## ✅ Checklist Rápido

Marca lo que puedas compartir:

- [ ] Controlador de `getallphotos` (función que procesa la petición)
- [ ] Ruta de `/photos/getallphotos` (definición de la ruta)
- [ ] Modelo de Photo/Vehicle (esquema de MongoDB)
- [ ] Conexión a MongoDB (cómo se conecta)
- [ ] Archivo principal (`index.js` o `server.js`)
- [ ] Variables de entorno usadas (lista o archivo de configuración)

---

## 🎯 Lo Más Importante

**Si solo puedes compartir 2 cosas, comparte:**

1. ✅ **El controlador de `getallphotos`** (el código que procesa la petición)
2. ✅ **Cómo se conecta a MongoDB** (para ver si hay problemas de conexión)

Con eso podré identificar el 90% de los problemas.

---

## 📌 Información Adicional Útil

Si puedes, también comparte:

- **¿El backend funciona en desarrollo local?** (con `npm run dev`)
- **¿Qué errores ves en los logs de Vercel?** (si puedes acceder)
- **¿El endpoint `/photos/getallphotos` requiere autenticación?**
- **¿Qué biblioteca usas para MongoDB?** (Mongoose, MongoDB Native, etc.)

---

**Una vez que compartas esta información, podré:**
1. ✅ Identificar exactamente qué está causando el error 500
2. ✅ Verificar si el formato de respuesta coincide con lo que espera el frontend
3. ✅ Sugerir cambios específicos en el backend
4. ✅ Crear un plan de acción para solucionar el problema

