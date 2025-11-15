# 📸 Guía Visual Paso a Paso - Vercel

## 🎯 Objetivo

Configurar el frontend para que se conecte al backend en producción.

**Tiempo estimado:** 10-15 minutos

---

## 📍 Paso 1: Ir a Vercel Dashboard

1. Abre tu navegador
2. Ve a [vercel.com](https://vercel.com)
3. Inicia sesión con tu cuenta
4. Verás la lista de tus proyectos

---

## 📍 Paso 2: Seleccionar tu Proyecto Frontend

1. Busca el proyecto **"indiana-usados"** (o el nombre de tu frontend)
2. Click en el proyecto

---

## 📍 Paso 3: Ir a Settings (Configuración)

1. En el menú superior, click en **"Settings"**
2. Verás un menú lateral con opciones

---

## 📍 Paso 4: Ir a Environment Variables

1. En el menú lateral, busca **"Environment Variables"**
2. Click en **"Environment Variables"**

---

## 📍 Paso 5: Agregar Primera Variable (VITE_API_URL)

### 5.1. Click en "Add New"

Verás un botón **"Add New"** o **"Add"**. Click en él.

### 5.2. Llenar el Formulario

Aparecerá un formulario con 3 campos:

1. **Key (Name):** Escribe `VITE_API_URL`
2. **Value:** Escribe `https://back-indiana.vercel.app`
3. **Environment:** Selecciona **✅ Production**

### 5.3. Guardar

Click en **"Save"** o **"Add"**

**✅ Primera variable agregada**

---

## 📍 Paso 6: Agregar Segunda Variable (VITE_ENVIRONMENT)

### 6.1. Click en "Add New" de nuevo

### 6.2. Llenar el Formulario

1. **Key (Name):** `VITE_ENVIRONMENT`
2. **Value:** `production`
3. **Environment:** Selecciona **✅ Production**

### 6.3. Guardar

Click en **"Save"**

**✅ Segunda variable agregada**

---

## 📍 Paso 7: Agregar Variables para Preview (Opcional pero Recomendado)

Repite los pasos 5 y 6, pero esta vez:

1. **VITE_API_URL** = `https://back-indiana.vercel.app`
   - **Environment:** Selecciona **✅ Preview**

2. **VITE_ENVIRONMENT** = `staging`
   - **Environment:** Selecciona **✅ Preview**

---

## 📍 Paso 8: Ir a Deployments

1. En el menú superior, click en **"Deployments"**
2. Verás una lista de todos tus deployments

---

## 📍 Paso 9: Hacer Redeploy

### 9.1. Encontrar el Último Deployment

Busca el deployment más reciente (el primero de la lista).

### 9.2. Click en los 3 Puntos

En la esquina superior derecha del deployment, verás **3 puntos** (⋯).

Click en ellos.

### 9.3. Seleccionar "Redeploy"

Aparecerá un menú. Click en **"Redeploy"**.

### 9.4. Confirmar

Aparecerá un diálogo de confirmación. Click en **"Redeploy"** o **"Confirm"**.

---

## 📍 Paso 10: Esperar el Build

1. Verás que el deployment cambia a estado **"Building"**
2. Espera 2-3 minutos
3. Cuando termine, verás un **✅ verde** si fue exitoso

---

## 📍 Paso 11: Verificar en el Navegador

### 11.1. Abrir tu Sitio

1. Click en el deployment (o ve a tu URL de producción)
2. Se abrirá tu sitio en una nueva pestaña

### 11.2. Abrir Consola del Navegador

1. Presiona **F12** (o click derecho → "Inspeccionar")
2. Ve a la pestaña **"Console"**

### 11.3. Verificar Variables

Escribe en la consola:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT);
```

**Deberías ver:**
```
API URL: https://back-indiana.vercel.app
Environment: production
```

### 11.4. Probar Conexión

Escribe en la consola:

```javascript
fetch(`${import.meta.env.VITE_API_URL}/vehicles`)
  .then(res => console.log('✅ Status:', res.status))
  .catch(err => console.error('❌ Error:', err));
```

**Si ves `✅ Status: 200`**, ¡todo funciona! 🎉

---

## ✅ Checklist Visual

Marca cada paso cuando lo completes:

- [ ] Paso 1: Ir a Vercel Dashboard
- [ ] Paso 2: Seleccionar proyecto
- [ ] Paso 3: Ir a Settings
- [ ] Paso 4: Ir a Environment Variables
- [ ] Paso 5: Agregar VITE_API_URL (Production)
- [ ] Paso 6: Agregar VITE_ENVIRONMENT (Production)
- [ ] Paso 7: Agregar variables para Preview
- [ ] Paso 8: Ir a Deployments
- [ ] Paso 9: Hacer Redeploy
- [ ] Paso 10: Esperar build
- [ ] Paso 11: Verificar en navegador

---

## 🎉 ¡Listo!

Si seguiste todos los pasos, tu frontend debería estar conectado al backend.

**Si hay problemas**, revisa la sección de Troubleshooting en `GUIA_COMPLETA_DESPLIEGUE.md`.

---

**Última actualización:** 2024-01-XX

