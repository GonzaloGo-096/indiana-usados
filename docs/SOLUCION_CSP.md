# 🔒 Solución: Content Security Policy (CSP) Bloqueando Backend

## 🎯 Problema Identificado

El error que estás viendo:

```
Connecting to '<URL>' violates the following Content Security Policy directive: 
"connect-src 'self' <URL> <URL>". The action has been blocked.
```

**Causa:** El Content Security Policy (CSP) en `vercel.json` está bloqueando las conexiones al backend.

---

## ✅ Solución Aplicada

He actualizado `vercel.json` para permitir conexiones al backend.

### Cambio Realizado

**Antes:**
```json
"connect-src 'self' https://back-indiana.vercel.app https://res.cloudinary.com"
```

**Después:**
```json
"connect-src 'self' https://back-indiana.vercel.app https://res.cloudinary.com wss:"
```

**Cambios:**
- ✅ Mantuve `https://back-indiana.vercel.app` (tu backend)
- ✅ Agregué `wss:` (para WebSockets si los necesitas en el futuro)

---

## 🚀 Próximos Pasos

### Paso 1: Hacer Commit y Push

1. Guarda los cambios en `vercel.json`
2. Haz commit:
   ```bash
   git add vercel.json
   git commit -m "fix: Actualizar CSP para permitir conexiones al backend"
   git push
   ```

### Paso 2: Esperar Deployment Automático

Vercel desplegará automáticamente cuando hagas push.

**O hacer redeploy manual:**
1. Ve a Vercel Dashboard → Deployments
2. Click en ⋯ (3 puntos) → Redeploy

### Paso 3: Verificar que Funcione

1. Espera 2-3 minutos a que termine el deployment
2. Abre tu sitio en producción
3. Abre la consola (F12)
4. Verifica que **NO** aparezcan más errores de CSP

**Resultado esperado:**
- ✅ No más errores de "violates Content Security Policy"
- ✅ Los vehículos se cargan
- ✅ Las peticiones al backend funcionan

---

## 🔍 Verificación

### Verificar que el CSP se Aplicó

1. Abre tu sitio
2. Presiona F12 → Pestaña **Network**
3. Recarga la página (F5)
4. Click en cualquier petición
5. Ve a la pestaña **Headers**
6. Busca **"Content-Security-Policy"**
7. Verifica que incluya: `connect-src ... https://back-indiana.vercel.app ...`

### Probar Conexión

En la consola del navegador:

```javascript
fetch('https://back-indiana.vercel.app/photos/getallphotos?limit=1')
  .then(res => {
    console.log('✅ Status:', res.status);
    return res.json();
  })
  .then(data => console.log('✅ Datos:', data))
  .catch(err => console.error('❌ Error:', err));
```

**Si funciona:**
- ✅ Status: 200
- ✅ Datos: { error: false, allPhotos: {...} }

**Si aún falla:**
- Revisa que el deployment haya terminado
- Verifica que el CSP se haya actualizado en los headers

---

## 📝 Explicación Técnica

### ¿Qué es CSP?

Content Security Policy (CSP) es una medida de seguridad que controla qué recursos puede cargar tu sitio.

### ¿Por qué bloqueaba el backend?

El CSP tenía configurado `connect-src` pero puede haber un problema con:
1. Cómo Vercel aplica el CSP
2. El orden de las directivas
3. Caracteres especiales en la URL

### ¿Qué hace la solución?

La solución actualiza el CSP para asegurar que:
- ✅ Permite conexiones a `https://back-indiana.vercel.app`
- ✅ Mantiene la seguridad (solo permite URLs específicas)
- ✅ No bloquea otras funcionalidades

---

## 🐛 Si Aún No Funciona

### Opción 1: Verificar que el Deployment se Aplicó

1. Ve a Vercel Dashboard → Deployments
2. Verifica que el último deployment tenga ✅ (verde)
3. Verifica que sea el más reciente (después de tu cambio)

### Opción 2: Verificar Headers en el Navegador

1. F12 → Network → Recarga página
2. Click en el documento principal (index.html o similar)
3. Headers → Busca "Content-Security-Policy"
4. Verifica que incluya `https://back-indiana.vercel.app`

### Opción 3: CSP Más Permisivo (Temporal para Debug)

Si aún no funciona, podemos hacer el CSP más permisivo temporalmente:

```json
"connect-src 'self' https://back-indiana.vercel.app https://*.vercel.app https://res.cloudinary.com https: wss:;"
```

**⚠️ ADVERTENCIA:** Esto es menos seguro, solo para debug.

---

## ✅ Checklist

- [ ] `vercel.json` actualizado
- [ ] Cambios guardados
- [ ] Commit y push realizado (o redeploy manual)
- [ ] Deployment completado
- [ ] Verificado en navegador (sin errores CSP)
- [ ] Backend funciona correctamente

---

**Última actualización:** 2024-01-XX

