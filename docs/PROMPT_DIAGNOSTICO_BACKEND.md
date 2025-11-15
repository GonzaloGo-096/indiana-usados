# 🔍 Prompt para Diagnóstico del Backend

## 📋 Información que Necesito del Backend

Para diagnosticar el error 500, necesito que me compartas la siguiente información del código del backend:

---

## 1️⃣ Estructura del Backend

**Pregunta:** ¿Dónde está el código del backend?
- [ ] En otro repositorio (¿cuál es la ruta?)
- [ ] En una carpeta dentro de este proyecto (¿cuál?)
- [ ] Solo tienes acceso a archivos específicos

---

## 2️⃣ Archivo de Rutas de Photos

**Pregunta:** ¿Dónde está definida la ruta `/photos/getallphotos`?

**Archivos que necesito ver:**
- `routes/photosRoutes.js` (o el archivo que defina las rutas de photos)
- El controlador que maneja `getallphotos` (ej: `controllers/photoControllers.js`)

**Información específica:**
1. ¿Qué parámetros acepta el endpoint? (limit, cursor, etc.)
2. ¿Requiere autenticación?
3. ¿Qué formato de respuesta devuelve?

---

## 3️⃣ Variables de Entorno que Usa

**Pregunta:** ¿Qué variables de entorno necesita el backend para funcionar?

**Archivos que necesito ver:**
- El archivo donde se cargan las variables (ej: `index.js`, `config/database.js`, `.env.example`)
- Cualquier archivo que use `process.env.*`

**Variables comunes que necesito verificar:**
- `MONGO_URL` - ¿Dónde se usa?
- `JWT_SECRET` - ¿Dónde se usa?
- `SUPER_USER` - ¿Dónde se usa?
- `CLOUD_NAME`, `CLOUD_KEY`, `CLOUD_SECRET` - ¿Dónde se usan?
- Otras variables específicas del backend

---

## 4️⃣ Conexión a MongoDB

**Pregunta:** ¿Cómo se conecta el backend a MongoDB?

**Archivos que necesito ver:**
- El archivo que establece la conexión (ej: `config/database.js`, `db/connection.js`)
- El modelo de Photo (ej: `models/Photo.js` o `models/PhotoModel.js`)

**Información específica:**
1. ¿Cómo se inicializa la conexión?
2. ¿Qué modelo usa para las fotos/vehículos?
3. ¿Qué campos tiene el modelo?

---

## 5️⃣ Formato de Respuesta Esperado

**Pregunta:** ¿Qué formato de respuesta devuelve el endpoint `/photos/getallphotos`?

**El frontend espera:**
```javascript
{
  error: false,
  allPhotos: {
    docs: [...],           // Array de vehículos
    totalDocs: number,     // Total de documentos
    hasNextPage: boolean,  // Si hay más páginas
    nextPage: number       // Número de la siguiente página
  }
}
```

**¿El backend devuelve este formato?** Si no, ¿qué formato devuelve?

---

## 6️⃣ Manejo de Errores

**Pregunta:** ¿Cómo maneja el backend los errores?

**Archivos que necesito ver:**
- El controlador de `getallphotos`
- Cualquier middleware de manejo de errores

**Información específica:**
1. ¿Hay try/catch en el controlador?
2. ¿Qué errores puede lanzar?
3. ¿Cómo se devuelven los errores al frontend?

---

## 📝 Formato de Respuesta

Por favor, comparte la información en este formato:

### Opción 1: Compartir Archivos Completos
```
1. routes/photosRoutes.js
   [pegar contenido completo]

2. controllers/photoControllers.js
   [pegar contenido completo]

3. models/Photo.js
   [pegar contenido completo]

4. config/database.js
   [pegar contenido completo]

5. index.js (o el archivo principal)
   [pegar contenido completo]
```

### Opción 2: Compartir Secciones Específicas
```
1. Ruta getallphotos:
   [código de la ruta]

2. Controlador getallphotos:
   [código del controlador]

3. Modelo Photo:
   [código del modelo]

4. Variables de entorno usadas:
   - MONGO_URL: usado en [archivo, línea]
   - JWT_SECRET: usado en [archivo, línea]
   - etc.

5. Conexión a MongoDB:
   [código de conexión]
```

---

## 🎯 Lo Más Importante

**Si solo puedes compartir una cosa, comparte esto:**

1. **El controlador de `getallphotos`** (el código que procesa la petición)
2. **El modelo de Photo** (para ver qué campos espera)
3. **Cómo se conecta a MongoDB** (para ver si hay problemas de conexión)

Con esa información podré identificar exactamente qué está causando el error 500.

---

## ✅ Checklist de Información

Marca lo que puedas compartir:

- [ ] Archivo de rutas (`routes/photosRoutes.js` o similar)
- [ ] Controlador de `getallphotos`
- [ ] Modelo de Photo/Vehicle
- [ ] Archivo de conexión a MongoDB
- [ ] Archivo principal (`index.js` o `server.js`)
- [ ] Archivo de configuración de variables de entorno
- [ ] Archivo `.env.example` o documentación de variables

---

**Una vez que compartas esta información, podré:**
1. Identificar exactamente qué está causando el error 500
2. Verificar si el formato de respuesta coincide con lo que espera el frontend
3. Sugerir cambios específicos en el backend o frontend
4. Crear un plan de acción para solucionar el problema

