# 🚀 Guía de Despliegue - Indiana Usados

## 📋 Tabla de Contenidos

1. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
2. [Despliegue del Frontend en Vercel](#despliegue-del-frontend-en-vercel)
3. [Despliegue del Backend](#despliegue-del-backend)
4. [Configuración de CORS](#configuración-de-cors)
5. [Verificación Post-Despliegue](#verificación-post-despliegue)

---

## 🔧 Configuración de Variables de Entorno

### Variables Requeridas

El frontend necesita las siguientes variables de entorno en producción:

| Variable | Descripción | Ejemplo | Requerida |
|----------|-------------|---------|-----------|
| `VITE_API_URL` | URL del backend en producción | `https://api.indianausados.com` | ✅ Sí |
| `VITE_ENVIRONMENT` | Entorno de ejecución | `production` | ✅ Sí |
| `VITE_API_TIMEOUT` | Timeout de peticiones (ms) | `15000` | ❌ No (default: 15000) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `duuwqmpmn` | ❌ No |
| `VITE_CONTACT_EMAIL` | Email de contacto | `info@indianausados.com` | ❌ No |
| `VITE_CONTACT_WHATSAPP` | WhatsApp de contacto | `5491112345678` | ❌ No |

### Archivo `.env.example`

Crea un archivo `.env.example` en la raíz del proyecto con:

```env
# Entorno
VITE_ENVIRONMENT=production

# API Backend
VITE_API_URL=https://api.indianausados.com
VITE_API_TIMEOUT=15000

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=duuwqmpmn

# Contacto
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678

# Debug (solo desarrollo)
VITE_DEBUG=false
```

---

## 🌐 Despliegue del Frontend en Vercel

### Paso 1: Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

```
VITE_API_URL = https://tu-backend-url.com
VITE_ENVIRONMENT = production
VITE_CLOUDINARY_CLOUD_NAME = duuwqmpmn
VITE_CONTACT_EMAIL = info@indianausados.com
VITE_CONTACT_WHATSAPP = 5491112345678
```

### Paso 2: Actualizar `vercel.json`

El archivo `vercel.json` ya está configurado, pero necesitas actualizar el CSP para permitir conexiones a tu backend:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm ci",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://res.cloudinary.com data: blob:; font-src 'self' data:; connect-src 'self' https://TU-API-AQUI https://res.cloudinary.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
        }
      ]
    }
  ]
}
```

**⚠️ IMPORTANTE:** Reemplaza `https://TU-API-AQUI` con la URL real de tu backend.

### Paso 3: Desplegar

1. **Opción A: Desde GitHub (Recomendado)**
   - Conecta tu repositorio a Vercel
   - Cada push a `main` desplegará automáticamente

2. **Opción B: Desde CLI**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

### Paso 4: Verificar Build

Después del despliegue, verifica que:
- ✅ El build se completó sin errores
- ✅ Las variables de entorno están configuradas
- ✅ La URL de producción funciona

---

## 🔙 Despliegue del Backend

### Opciones de Despliegue

#### Opción 1: Vercel Serverless Functions (Recomendado para Node.js)

Si tu backend es Node.js, puedes desplegarlo en Vercel como Serverless Functions:

1. **Estructura del proyecto:**
   ```
   backend/
   ├── api/
   │   ├── index.js          # Endpoint principal
   │   ├── user/
   │   │   └── loginuser.js  # Endpoint de login
   │   └── vehicles/
   │       └── index.js      # Endpoint de vehículos
   └── vercel.json
   ```

2. **Configurar `vercel.json` del backend:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/**/*.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/api/$1"
       }
     ]
   }
   ```

3. **Desplegar:**
   ```bash
   cd backend
   vercel --prod
   ```

#### Opción 2: Servidor Dedicado (VPS, Railway, Render, etc.)

Si tu backend está en un servidor dedicado:

1. **Configurar CORS** (ver sección siguiente)
2. **Configurar variables de entorno** en el servidor
3. **Asegurar HTTPS** (certificado SSL)
4. **Configurar dominio** (ej: `api.indianausados.com`)

#### Opción 3: Backend Existente

Si ya tienes un backend desplegado:

1. Obtén la URL del backend (ej: `https://api.indianausados.com`)
2. Configura esta URL en `VITE_API_URL` en Vercel
3. Asegúrate de que CORS esté configurado correctamente

---

## 🔒 Configuración de CORS

El backend **DEBE** permitir peticiones desde el dominio del frontend.

### Ejemplo para Express.js:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'https://indianausados.com',           // Producción
    'https://www.indianausados.com',      // Producción con www
    'https://indiana-usados.vercel.app',  // Vercel preview
    'http://localhost:4173',              // Desarrollo local
    'http://localhost:5173'               // Vite dev server
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Ejemplo para otros frameworks:

**Fastify:**
```javascript
await fastify.register(require('@fastify/cors'), {
  origin: ['https://indianausados.com', 'https://www.indianausados.com'],
  credentials: true
});
```

**NestJS:**
```typescript
app.enableCors({
  origin: ['https://indianausados.com', 'https://www.indianausados.com'],
  credentials: true
});
```

---

## ✅ Verificación Post-Despliegue

### Checklist de Verificación

#### Frontend
- [ ] La aplicación carga sin errores en consola
- [ ] Las imágenes se cargan correctamente
- [ ] Los estilos se aplican correctamente
- [ ] Las rutas funcionan (SPA)
- [ ] El SEO está configurado (meta tags)

#### Backend
- [ ] Las peticiones API funcionan
- [ ] El login funciona
- [ ] Los vehículos se cargan
- [ ] CORS está configurado correctamente
- [ ] Los errores se manejan correctamente

### Pruebas de API

Abre la consola del navegador y verifica:

```javascript
// Verificar configuración
console.log('API URL:', import.meta.env.VITE_API_URL);

// Probar petición
fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
  .then(res => res.json())
  .then(data => console.log('✅ API funciona:', data))
  .catch(err => console.error('❌ Error API:', err));
```

### Errores Comunes

#### 1. "Network Error" o CORS
**Solución:** Verifica que:
- `VITE_API_URL` esté configurada correctamente
- CORS permita tu dominio
- El backend esté accesible

#### 2. "Cannot read properties of undefined"
**Solución:** Verifica que:
- Las variables de entorno estén configuradas
- El build se haya completado correctamente
- No haya errores en la consola

#### 3. "404 Not Found" en rutas
**Solución:** Verifica que:
- `vercel.json` tenga la configuración correcta
- Las rutas estén configuradas como SPA

---

## 📝 Notas Adicionales

### Desarrollo Local

Para desarrollo local, crea un archivo `.env.local`:

```env
VITE_API_URL=http://localhost:3001
VITE_ENVIRONMENT=development
VITE_DEBUG=true
```

### Staging

Para un entorno de staging:

```env
VITE_API_URL=https://staging-api.indianausados.com
VITE_ENVIRONMENT=staging
```

### Monitoreo

Considera agregar:
- **Sentry** para error tracking
- **Google Analytics** para analytics
- **Vercel Analytics** para performance

---

## 🆘 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs de Vercel
2. Verifica las variables de entorno
3. Revisa la consola del navegador
4. Verifica la configuración de CORS en el backend

---

**Última actualización:** 2024-01-XX

