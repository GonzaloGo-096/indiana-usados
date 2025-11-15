# 🚀 INICIO AQUÍ - Configuración Backend en Producción

## ⚡ Resumen Ejecutivo (2 minutos)

**Situación actual:**
- ✅ Frontend funciona en producción
- ✅ Backend está en `https://back-indiana.vercel.app`
- ⚠️ **Falta conectar ambos**

**Solución:**
1. Agregar 2 variables en Vercel (5 min)
2. Hacer un redeploy (2 min)
3. Verificar que funcione (2 min)

**Total: ~10 minutos**

---

## 📋 ¿Qué es un "Redeploy"?

**Redeploy = Volver a desplegar la aplicación**

**¿Por qué?**
- Cuando agregas variables de entorno, solo se aplican en nuevos deployments
- Necesitas hacer un redeploy para que las nuevas variables se usen

**¿Cómo?**
- Vercel Dashboard → Deployments → 3 puntos (⋯) → Redeploy

**Es como reiniciar la aplicación con la nueva configuración.**

---

## 🎯 Pasos Rápidos (Copia y Pega)

### Paso 1: Ir a Variables de Entorno

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **frontend**
3. **Settings** → **Environment Variables**

### Paso 2: Agregar Variables

Agrega estas 2 variables (click en "Add New" para cada una):

#### Variable 1:
- **Name:** `VITE_API_URL`
- **Value:** `https://back-indiana.vercel.app`
- **Environment:** ✅ Production

#### Variable 2:
- **Name:** `VITE_ENVIRONMENT`
- **Value:** `production`
- **Environment:** ✅ Production

**💡 Opcional:** Repite para **Preview** (mismos valores pero selecciona Preview)

### Paso 3: Hacer Redeploy

1. Ve a **Deployments**
2. Click en **⋯** (3 puntos) del último deployment
3. Click en **"Redeploy"**
4. Espera 2-3 minutos

### Paso 4: Verificar

1. Abre tu sitio en producción
2. Presiona **F12** (consola del navegador)
3. Escribe:

```javascript
console.log('API:', import.meta.env.VITE_API_URL);
```

**Debería mostrar:** `https://back-indiana.vercel.app`

---

## 📚 Documentación Completa

Si necesitas más detalles, consulta:

1. **`docs/GUIA_DETALLADA_PASO_A_PASO.md`** ⭐ **RECOMENDADO** - Guía súper detallada con explicaciones de cada paso
2. **`docs/PASO_A_PASO_VERCEL.md`** - Guía visual paso a paso
3. **`docs/GUIA_COMPLETA_DESPLIEGUE.md`** - Guía completa con troubleshooting
4. **`docs/CONFIGURACION_BACKEND_VERCEL.md`** - Configuración específica del backend

---

## ✅ Checklist Rápido

- [ ] Variables agregadas en Vercel
- [ ] Redeploy realizado
- [ ] Verificado en consola del navegador
- [ ] Todo funciona ✅

---

## 🆘 Si Algo Sale Mal

### Error: "Network Error"
→ Verifica que el backend esté accesible: `https://back-indiana.vercel.app`

### Error: Variables no se aplican
→ Asegúrate de haber hecho el redeploy después de agregar variables

### Error: CORS
→ El backend debe permitir tu dominio. Ver `GUIA_COMPLETA_DESPLIEGUE.md` sección CORS

---

## 🎉 ¡Listo!

Sigue estos pasos y en 10 minutos tendrás todo funcionando.

**¿Dudas?** Revisa la documentación completa o los logs en Vercel.

---

**Última actualización:** 2024-01-XX

