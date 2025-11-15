# 🚀 Guía Completa de Despliegue - Paso a Paso

## 📋 Estado Actual

- ✅ **Frontend:** Funciona en producción (sin backend conectado)
- ✅ **Backend:** `https://back-indiana.vercel.app` (desplegado)
- ⚠️ **Falta:** Conectar frontend con backend

---

## 🎯 Objetivo

Conectar el frontend con el backend para que funcione completamente en producción.

---

## 📝 Paso 1: Entender "Redeploy"

### ¿Qué es un Redeploy?

Un **redeploy** es volver a desplegar tu aplicación con las nuevas configuraciones.

**¿Por qué es necesario?**
- Las variables de entorno solo se aplican cuando se hace un nuevo build
- Si agregas variables después del deployment, necesitas hacer un redeploy para que se apliquen

### ¿Cómo hacer un Redeploy?

#### Opción A: Desde Vercel Dashboard (Más Fácil)

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **frontend** (indiana-usados)
3. Ve a la pestaña **"Deployments"**
4. Encuentra el último deployment (el más reciente)
5. Click en los **3 puntos** (⋯) → **"Redeploy"**
6. Confirma el redeploy

**⏱️ Tiempo:** 2-3 minutos

#### Opción B: Desde Git (Automático)

1. Haz un commit (puede ser vacío):
   ```bash
   git commit --allow-empty -m "Redeploy con variables de entorno"
   git push
   ```
2. Vercel desplegará automáticamente

---

## ⚙️ Paso 2: Configurar Variables de Entorno en Vercel

### 2.1. Ir a Environment Variables

1. Ve a tu proyecto frontend en [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **"Settings"** (Configuración)
3. Click en **"Environment Variables"** (Variables de Entorno)

### 2.2. Agregar Variables para PRODUCTION

Para cada variable, sigue estos pasos:

1. Click en **"Add New"**
2. Ingresa el **Name** (nombre de la variable)
3. Ingresa el **Value** (valor)
4. Selecciona **✅ Production**
5. Click en **"Save"**

#### Variables Requeridas para PRODUCTION:

| Name | Value | Seleccionar |
|------|-------|-------------|
| `VITE_API_URL` | `https://back-indiana.vercel.app` | ✅ Production |
| `VITE_ENVIRONMENT` | `production` | ✅ Production |

#### Variables Opcionales para PRODUCTION:

| Name | Value | Seleccionar |
|------|-------|-------------|
| `VITE_CLOUDINARY_CLOUD_NAME` | `duuwqmpmn` | ✅ Production |
| `VITE_CONTACT_EMAIL` | `info@indianausados.com` | ✅ Production |
| `VITE_CONTACT_WHATSAPP` | `5491112345678` | ✅ Production |
| `VITE_API_TIMEOUT` | `15000` | ✅ Production |

### 2.3. Agregar Variables para PREVIEW

Repite el proceso pero selecciona **✅ Preview** en lugar de Production:

| Name | Value | Seleccionar |
|------|-------|-------------|
| `VITE_API_URL` | `https://back-indiana.vercel.app` | ✅ Preview |
| `VITE_ENVIRONMENT` | `staging` | ✅ Preview |

**💡 Tip:** Puedes usar el mismo backend para Preview y Production.

---

## 🔒 Paso 3: Verificar CORS en el Backend

### ¿Qué es CORS?

CORS (Cross-Origin Resource Sharing) permite que tu frontend (en un dominio) haga peticiones a tu backend (en otro dominio).

### Verificar CORS del Backend

Según la documentación del backend, CORS está habilitado para todos los orígenes:

```javascript
app.use(cors())
```

**Esto está bien para desarrollo**, pero en producción deberías restringirlo.

### Configurar CORS en el Backend (Recomendado)

Si tienes acceso al código del backend, actualiza la configuración de CORS:

```javascript
// En el archivo del backend (probablemente index.js o app.js)
const cors = require('cors');

const corsOptions = {
  origin: [
    'https://indiana-usados.vercel.app',        // Tu frontend en Vercel
    'https://indianausados.com',                // Tu dominio de producción
    'https://www.indianausados.com',            // Con www
    'http://localhost:4173',                     // Preview local
    'http://localhost:5173'                     // Dev local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

**Si no tienes acceso al backend**, verifica que funcione primero. Si hay errores de CORS, contacta al desarrollador del backend.

---

## 🚀 Paso 4: Hacer el Redeploy

### Método Recomendado: Desde Dashboard

1. Ve a **Deployments**
2. Click en **⋯** (3 puntos) del último deployment
3. Click en **"Redeploy"**
4. Espera 2-3 minutos

### Verificar que el Redeploy Funcionó

1. Ve a **Deployments**
2. Busca el deployment más reciente
3. Debería tener un ✅ verde si fue exitoso
4. Click en el deployment para ver los logs

---

## ✅ Paso 5: Verificar que Todo Funciona

### 5.1. Verificar Variables de Entorno

1. Abre tu sitio en producción (ej: `https://indiana-usados.vercel.app`)
2. Abre la **Consola del Navegador** (F12)
3. Ve a la pestaña **Console**
4. Ejecuta este código:

```javascript
console.log('🔍 Verificación de Configuración:');
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT);
```

**Resultado esperado:**
```
🔍 Verificación de Configuración:
API URL: https://back-indiana.vercel.app
Environment: production
```

### 5.2. Probar Conexión con el Backend

En la misma consola, ejecuta:

```javascript
// Probar endpoint de vehículos (ajusta según tu API)
fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
  .then(res => {
    console.log('✅ Status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('✅ Datos recibidos:', data);
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
```

**Resultados posibles:**

- ✅ **200 OK:** Todo funciona correctamente
- ❌ **CORS Error:** El backend no permite tu dominio (ver Paso 3)
- ❌ **404 Not Found:** El endpoint no existe (verificar ruta)
- ❌ **Network Error:** El backend no está accesible

### 5.3. Probar Funcionalidades

- [ ] La página carga sin errores
- [ ] Los vehículos se cargan (si hay endpoint)
- [ ] El login funciona (si hay endpoint)
- [ ] No hay errores en la consola

---

## 🐛 Solución de Problemas

### Error: "Network Error" o "Failed to fetch"

**Causa:** CORS no configurado o backend inaccesible

**Solución:**
1. Verifica que el backend esté accesible: `https://back-indiana.vercel.app`
2. Verifica CORS en el backend (Paso 3)
3. Verifica que `VITE_API_URL` esté correcta

### Error: "Cannot read properties of undefined"

**Causa:** Variables de entorno no configuradas

**Solución:**
1. Verifica que las variables estén en Vercel
2. Haz un redeploy después de agregar variables
3. Verifica que los nombres empiecen con `VITE_`

### Error: "404 Not Found"

**Causa:** Endpoint incorrecto o no existe

**Solución:**
1. Verifica la documentación del backend
2. Verifica que la ruta sea correcta
3. Prueba el endpoint directamente: `https://back-indiana.vercel.app/vehicles`

### Las Variables No Se Aplican

**Causa:** No se hizo redeploy después de agregar variables

**Solución:**
1. Haz un redeploy (Paso 4)
2. Espera a que termine el build
3. Verifica en la consola del navegador

---

## 📋 Checklist Final

### Antes de Desplegar

- [ ] Variables de entorno configuradas en Vercel (Production)
- [ ] Variables de entorno configuradas en Vercel (Preview)
- [ ] `vercel.json` actualizado con la URL del backend
- [ ] CORS configurado en el backend (o verificado que funciona)

### Después de Desplegar

- [ ] Redeploy realizado
- [ ] Build exitoso (✅ verde en Deployments)
- [ ] Variables verificadas en consola del navegador
- [ ] Conexión con backend probada
- [ ] Funcionalidades principales probadas
- [ ] No hay errores en consola

---

## 🎓 Resumen de Conceptos

### Variables de Entorno

- Son valores que cambian según el entorno (desarrollo/producción)
- En Vercel se configuran en Settings → Environment Variables
- Solo se aplican en nuevos deployments

### Redeploy

- Es volver a construir y desplegar la aplicación
- Necesario después de cambiar variables de entorno
- Se hace desde Deployments → Redeploy

### CORS

- Permite que el frontend haga peticiones al backend
- Debe estar configurado en el backend
- En producción, debe permitir tu dominio específico

---

## 📞 Próximos Pasos

1. **Configura las variables** (Paso 2)
2. **Haz el redeploy** (Paso 4)
3. **Verifica que funcione** (Paso 5)
4. **Si hay errores**, revisa la sección de Troubleshooting

---

## 🆘 ¿Necesitas Ayuda?

Si encuentras problemas:

1. Revisa los logs en Vercel (Deployments → View Logs)
2. Revisa la consola del navegador (F12)
3. Verifica que el backend esté accesible
4. Verifica que las variables estén correctas

---

**Última actualización:** 2024-01-XX

