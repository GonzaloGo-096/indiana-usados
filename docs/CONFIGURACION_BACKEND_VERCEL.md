# 🔧 Configuración Backend en Vercel - Indiana Usados

## 📍 Tu Backend

**URL del Backend:** `https://back-indiana.vercel.app/`

Este mismo backend se puede usar tanto para **Production** como para **Preview** (deployments de branches/PRs).

---

## ⚙️ Configuración en Vercel Dashboard

### Paso 1: Ir a Environment Variables

1. Ve a tu proyecto frontend en [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **Settings** → **Environment Variables**

### Paso 2: Configurar Variables para PRODUCTION

Agrega estas variables y selecciona **Production**:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_API_URL` | `https://back-indiana.vercel.app` | ✅ Production |
| `VITE_ENVIRONMENT` | `production` | ✅ Production |

**Opcionales para Production:**
| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_CLOUDINARY_CLOUD_NAME` | `duuwqmpmn` | ✅ Production |
| `VITE_CONTACT_EMAIL` | `info@indianausados.com` | ✅ Production |
| `VITE_CONTACT_WHATSAPP` | `5491112345678` | ✅ Production |
| `VITE_API_TIMEOUT` | `15000` | ✅ Production |

### Paso 3: Configurar Variables para PREVIEW

Agrega las mismas variables pero selecciona **Preview**:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_API_URL` | `https://back-indiana.vercel.app` | ✅ Preview |
| `VITE_ENVIRONMENT` | `staging` | ✅ Preview |

**Opcionales para Preview:**
| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_CLOUDINARY_CLOUD_NAME` | `duuwqmpmn` | ✅ Preview |
| `VITE_API_TIMEOUT` | `15000` | ✅ Preview |

### Paso 4: Configurar Variables para DEVELOPMENT (Opcional)

Para desarrollo local, puedes usar:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_API_URL` | `https://back-indiana.vercel.app` | ✅ Development |
| `VITE_ENVIRONMENT` | `development` | ✅ Development |
| `VITE_DEBUG` | `true` | ✅ Development |

---

## 🎯 Resumen de Configuración

### ✅ Opción 1: Mismo Backend para Todo (Recomendado)

Usa `https://back-indiana.vercel.app` para todos los entornos:

- **Production:** `VITE_API_URL = https://back-indiana.vercel.app`
- **Preview:** `VITE_API_URL = https://back-indiana.vercel.app`
- **Development:** `VITE_API_URL = https://back-indiana.vercel.app` (o `http://localhost:3001` para desarrollo local)

**Ventajas:**
- ✅ Configuración simple
- ✅ Mismo comportamiento en todos los entornos
- ✅ Fácil de mantener

### 🔄 Opción 2: Backends Separados (Si tienes staging)

Si en el futuro quieres un backend de staging separado:

- **Production:** `VITE_API_URL = https://back-indiana.vercel.app`
- **Preview:** `VITE_API_URL = https://back-indiana-staging.vercel.app` (ejemplo)
- **Development:** `VITE_API_URL = http://localhost:3001`

---

## 🔒 Configurar CORS en el Backend

**IMPORTANTE:** El backend debe permitir peticiones desde tu frontend.

### Si el backend está en Vercel (Serverless Functions)

En tu proyecto backend, configura CORS para permitir:

```javascript
// Ejemplo para Express en Vercel
const cors = require('cors');

const corsOptions = {
  origin: [
    'https://indiana-usados.vercel.app',        // Tu frontend en Vercel
    'https://indianausados.com',                // Tu dominio de producción
    'https://www.indianausados.com',            // Con www
    'http://localhost:4173',                    // Preview local
    'http://localhost:5173'                     // Dev local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Verificar CORS

Puedes probar si CORS está configurado correctamente:

```bash
curl -H "Origin: https://indiana-usados.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://back-indiana.vercel.app/vehicles
```

Deberías ver headers como:
```
Access-Control-Allow-Origin: https://indiana-usados.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

---

## ✅ Verificación Post-Configuración

### 1. Verificar Variables en Vercel

1. Ve a **Settings** → **Environment Variables**
2. Verifica que todas las variables estén configuradas
3. Verifica que estén seleccionadas para los entornos correctos

### 2. Hacer un Nuevo Deployment

Después de agregar variables, **debes hacer un nuevo deployment**:

1. Ve a **Deployments**
2. Click en **"Redeploy"** del último deployment
3. O haz un commit y push (se desplegará automáticamente)

### 3. Verificar en el Navegador

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Debería mostrar la URL de tu backend
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT);

// Probar conexión
fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
  .then(res => {
    console.log('✅ Backend conectado:', res.status);
    return res.json();
  })
  .then(data => console.log('✅ Datos recibidos:', data))
  .catch(err => console.error('❌ Error:', err));
```

---

## 🐛 Troubleshooting

### Error: "Network Error" o CORS

**Solución:**
1. Verifica que `VITE_API_URL` esté configurada correctamente
2. Verifica que el backend permita tu dominio en CORS
3. Verifica que el backend esté accesible: `https://back-indiana.vercel.app`

### Error: "Cannot read properties of undefined"

**Solución:**
1. Verifica que las variables estén en Vercel
2. Haz un nuevo deployment después de agregar variables
3. Verifica que los nombres empiecen con `VITE_`

### Las variables no se aplican

**Solución:**
- Las variables de entorno solo se aplican en **nuevos deployments**
- Haz un **Redeploy** después de agregar/modificar variables
- Verifica que estén seleccionadas para el entorno correcto (Production/Preview)

---

## 📝 Checklist Final

- [ ] Variables configuradas en Vercel (Production)
- [ ] Variables configuradas en Vercel (Preview)
- [ ] `vercel.json` actualizado con la URL del backend
- [ ] CORS configurado en el backend
- [ ] Nuevo deployment realizado
- [ ] Verificado en el navegador (consola)
- [ ] Las peticiones API funcionan

---

## 🚀 Próximos Pasos

1. **Configura las variables** en Vercel (ver arriba)
2. **Haz un nuevo deployment** (Redeploy)
3. **Verifica** que todo funcione en el navegador
4. **Si hay errores de CORS**, configura el backend (ver sección CORS)

---

**Última actualización:** 2024-01-XX

