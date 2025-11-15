# 🔧 Solución: Variables de Entorno No Se Aplican

## 🎯 Problema Identificado

El error muestra:

```
GET http://localhost:3001/photos/getallphotos
```

**Causa:** Las variables de entorno NO se están aplicando en el build de producción. El código compilado todavía usa el valor por defecto `http://localhost:3001`.

---

## ✅ Solución: Verificar y Forzar Nuevo Deployment

### Paso 1: Verificar Variables en Vercel

1. Ve a Vercel Dashboard → Tu Proyecto → **Settings** → **Environment Variables**
2. Verifica que existan:
   - `VITE_API_URL` = `https://back-indiana.vercel.app`
   - `VITE_ENVIRONMENT` = `production`
3. Verifica que estén seleccionadas para **✅ Production**

### Paso 2: Forzar Nuevo Deployment

**IMPORTANTE:** Las variables solo se aplican en **nuevos builds**. Si agregaste las variables después del último deployment, necesitas hacer un redeploy.

#### Opción A: Desde Dashboard (Recomendado)

1. Ve a **Deployments**
2. Click en **⋯** (3 puntos) del último deployment
3. Click en **"Redeploy"**
4. **IMPORTANTE:** En el diálogo, asegúrate de que diga que usará las variables de entorno actuales
5. Click en **"Redeploy"**

#### Opción B: Desde Git

```bash
git commit --allow-empty -m "Redeploy con variables de entorno"
git push
```

### Paso 3: Verificar que el Build Use las Variables

Durante el deployment, en los logs deberías ver que Vercel está usando las variables.

**En los logs del build, busca:**
- Mensajes sobre variables de entorno
- O simplemente espera a que termine

### Paso 4: Verificar en el Navegador

Después del deployment:

1. Abre tu sitio en producción
2. Presiona F12 → Console
3. Escribe:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Resultado esperado:**
```
API URL: https://back-indiana.vercel.app
```

**Si todavía muestra `undefined` o `http://localhost:3001`:**
- Las variables no se aplicaron
- Haz otro redeploy
- Verifica que las variables estén en Vercel

---

## 🔍 Verificación Detallada

### Verificar Variables en Vercel Dashboard

1. Ve a **Settings** → **Environment Variables**
2. Busca `VITE_API_URL`
3. Verifica:
   - ✅ Valor: `https://back-indiana.vercel.app`
   - ✅ Production: ✅ seleccionado
   - ✅ Preview: ✅ seleccionado (opcional)

### Verificar Último Deployment

1. Ve a **Deployments**
2. Busca el deployment más reciente
3. Verifica:
   - ✅ Estado: Ready (verde)
   - ✅ Fecha: Después de agregar las variables
   - ✅ Build exitoso

### Verificar en el Código Compilado

Si quieres verificar qué URL está usando el código compilado:

1. Abre tu sitio
2. F12 → Sources (o Network)
3. Busca el archivo JavaScript principal
4. Busca `localhost:3001` o `back-indiana`
5. Si encuentras `localhost:3001`, las variables no se aplicaron

---

## 🐛 Problemas Comunes

### Problema 1: Variables Agregadas Después del Deployment

**Síntoma:** Variables en Vercel pero código usa `localhost:3001`

**Solución:** Haz un **redeploy** después de agregar variables.

### Problema 2: Variables en Entorno Incorrecto

**Síntoma:** Variables solo en Preview, no en Production

**Solución:** Verifica que las variables estén seleccionadas para **✅ Production**.

### Problema 3: Nombre de Variable Incorrecto

**Síntoma:** Variable existe pero no se usa

**Solución:** Verifica que el nombre sea exactamente `VITE_API_URL` (con `VITE_` al inicio).

### Problema 4: Cache del Navegador

**Síntoma:** Cambios no se reflejan

**Solución:**
1. Limpia el cache del navegador (Ctrl+Shift+Delete)
2. O prueba en modo incógnito
3. O haz hard refresh (Ctrl+Shift+R)

---

## ✅ Checklist de Verificación

- [ ] Variables configuradas en Vercel (Settings → Environment Variables)
- [ ] `VITE_API_URL` = `https://back-indiana.vercel.app`
- [ ] `VITE_ENVIRONMENT` = `production`
- [ ] Variables seleccionadas para ✅ Production
- [ ] Redeploy realizado DESPUÉS de agregar variables
- [ ] Deployment completado (✅ verde)
- [ ] Verificado en consola: `import.meta.env.VITE_API_URL` muestra la URL correcta
- [ ] No más errores de `localhost:3001`

---

## 🚀 Pasos Inmediatos

1. **Verifica variables en Vercel** (Settings → Environment Variables)
2. **Haz un redeploy** (Deployments → ⋯ → Redeploy)
3. **Espera 2-3 minutos**
4. **Verifica en consola** que `VITE_API_URL` sea correcta
5. **Prueba la conexión** con el backend

---

**Última actualización:** 2024-01-XX

