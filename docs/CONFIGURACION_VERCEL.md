# ⚙️ Configuración de Vercel - Paso a Paso

## 📋 Checklist Pre-Despliegue

Antes de desplegar, asegúrate de tener:

- [ ] Cuenta en Vercel (gratis)
- [ ] Repositorio en GitHub/GitLab/Bitbucket
- [ ] URL del backend desplegado
- [ ] Variables de entorno listas

---

## 🚀 Paso 1: Conectar Repositorio

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en **"Add New Project"**
3. Conecta tu repositorio (GitHub/GitLab/Bitbucket)
4. Selecciona el repositorio `indiana-usados`

---

## 🔧 Paso 2: Configurar Variables de Entorno

### En el Dashboard de Vercel:

1. Ve a tu proyecto → **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

#### Variables Requeridas:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_API_URL` | `https://tu-backend-url.com` | Production, Preview, Development |
| `VITE_ENVIRONMENT` | `production` | Production |
| `VITE_ENVIRONMENT` | `staging` | Preview |

#### Variables Opcionales:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_CLOUDINARY_CLOUD_NAME` | `duuwqmpmn` | Production, Preview |
| `VITE_CONTACT_EMAIL` | `info@indianausados.com` | Production |
| `VITE_CONTACT_WHATSAPP` | `5491112345678` | Production |
| `VITE_API_TIMEOUT` | `15000` | Production, Preview |

### ⚠️ IMPORTANTE:

- **Production**: Variables que se usan en producción
- **Preview**: Variables para branches/PRs
- **Development**: Variables para desarrollo local

**Recomendación:** Configura todas las variables para los 3 entornos.

---

## 📝 Paso 3: Configurar Build Settings

Vercel debería detectar automáticamente:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci`

Si no se detecta automáticamente, configúralo manualmente en **Settings** → **General**.

---

## 🔒 Paso 4: Actualizar CSP en vercel.json

**IMPORTANTE:** Antes de desplegar, actualiza `vercel.json`:

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
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://res.cloudinary.com data: blob:; font-src 'self' data:; connect-src 'self' https://TU-BACKEND-URL-AQUI https://res.cloudinary.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
        }
      ]
    }
  ]
}
```

**Reemplaza `https://TU-BACKEND-URL-AQUI` con la URL real de tu backend.**

---

## 🚀 Paso 5: Desplegar

### Opción A: Despliegue Automático (Recomendado)

1. Haz push a la rama `main` o `master`
2. Vercel desplegará automáticamente
3. Recibirás una notificación cuando termine

### Opción B: Despliegue Manual

1. En el dashboard de Vercel, click en **"Deployments"**
2. Click en **"Redeploy"** en el último deployment
3. O usa el CLI:

```bash
npm i -g vercel
vercel --prod
```

---

## ✅ Paso 6: Verificar Despliegue

### 1. Verificar Build

- Ve a **Deployments** → Click en el último deployment
- Verifica que el build fue exitoso (✅)
- Revisa los logs si hay errores

### 2. Verificar Variables de Entorno

En la consola del navegador (F12):

```javascript
// Debería mostrar la URL de tu backend
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT);
```

### 3. Probar Funcionalidad

- [ ] La página carga correctamente
- [ ] Las imágenes se muestran
- [ ] Los vehículos se cargan (si hay backend)
- [ ] El login funciona (si hay backend)
- [ ] No hay errores en consola

---

## 🔍 Troubleshooting

### Error: "Network Error" o CORS

**Causa:** El backend no permite peticiones desde tu dominio.

**Solución:**
1. Verifica que `VITE_API_URL` esté configurada correctamente
2. Configura CORS en el backend para permitir tu dominio de Vercel
3. Verifica que el backend esté accesible

### Error: "Cannot read properties of undefined"

**Causa:** Variables de entorno no configuradas.

**Solución:**
1. Verifica que todas las variables estén en Vercel
2. Haz un nuevo deployment después de agregar variables
3. Verifica que los nombres de las variables sean correctos (deben empezar con `VITE_`)

### Error: "404 Not Found" en rutas

**Causa:** Configuración de SPA incorrecta.

**Solución:**
1. Verifica que `vercel.json` esté configurado
2. Asegúrate de que todas las rutas redirijan a `index.html`

### Build Falla

**Causa:** Errores en el código o dependencias.

**Solución:**
1. Revisa los logs del build en Vercel
2. Prueba el build localmente: `npm run build`
3. Verifica que todas las dependencias estén en `package.json`

---

## 📊 Monitoreo Post-Despliegue

### Vercel Analytics (Opcional)

1. Ve a **Settings** → **Analytics**
2. Activa **Web Analytics** (gratis)
3. Obtén métricas de performance y visitas

### Logs

- Ve a **Deployments** → Click en un deployment → **Functions** → **View Logs**
- Útil para debuggear errores en producción

---

## 🔄 Actualizar Despliegue

Cada vez que hagas push a `main`, Vercel desplegará automáticamente.

Para forzar un nuevo despliegue:
1. Ve a **Deployments**
2. Click en **"Redeploy"**
3. O haz un commit vacío: `git commit --allow-empty -m "Redeploy"`

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica la documentación de Vercel
3. Revisa la consola del navegador
4. Verifica las variables de entorno

---

**Última actualización:** 2024-01-XX

