# 📋 Resumen Rápido - Configuración Backend

## 🎯 Tu Situación

- **Backend URL:** `https://back-indiana.vercel.app/`
- **Mismo backend para Production y Preview:** ✅ Sí

## ⚡ Configuración Rápida (5 minutos)

### 1. En Vercel Dashboard → Settings → Environment Variables

#### Para PRODUCTION:
```
VITE_API_URL = https://back-indiana.vercel.app
VITE_ENVIRONMENT = production
```

#### Para PREVIEW:
```
VITE_API_URL = https://back-indiana.vercel.app
VITE_ENVIRONMENT = staging
```

### 2. Verificar `vercel.json`

Ya está actualizado con: `https://back-indiana.vercel.app`

### 3. Hacer Redeploy

En Vercel → Deployments → Redeploy

### 4. Verificar

Abre la consola del navegador y ejecuta:
```javascript
console.log('API:', import.meta.env.VITE_API_URL);
```

Debería mostrar: `https://back-indiana.vercel.app`

---

## ✅ Listo!

Si tienes problemas de CORS, verifica que el backend permita tu dominio.

Ver documentación completa en:
- `docs/CONFIGURACION_BACKEND_VERCEL.md` - Guía detallada
- `docs/CONFIGURACION_VERCEL.md` - Configuración general de Vercel

