# 📖 Guía Detallada Paso a Paso - Conectar Frontend con Backend

## 🎯 Objetivo de Esta Guía

Conectar tu frontend (que ya funciona en producción) con tu backend (`https://back-indiana.vercel.app`) para que todas las funcionalidades trabajen correctamente.

**Tiempo estimado:** 15-20 minutos

---

## 📚 Tabla de Contenidos

1. [Conceptos Básicos](#conceptos-básicos)
2. [Paso 1: Acceder a Vercel Dashboard](#paso-1-acceder-a-vercel-dashboard)
3. [Paso 2: Navegar a Environment Variables](#paso-2-navegar-a-environment-variables)
4. [Paso 3: Agregar Variable VITE_API_URL](#paso-3-agregar-variable-vite_api_url)
5. [Paso 4: Agregar Variable VITE_ENVIRONMENT](#paso-4-agregar-variable-vite_environment)
6. [Paso 5: Agregar Variables Opcionales](#paso-5-agregar-variables-opcionales)
7. [Paso 6: Configurar Variables para Preview](#paso-6-configurar-variables-para-preview)
8. [Paso 7: Hacer el Redeploy](#paso-7-hacer-el-redeploy)
9. [Paso 8: Verificar el Deployment](#paso-8-verificar-el-deployment)
10. [Paso 9: Probar en el Navegador](#paso-9-probar-en-el-navegador)
11. [Paso 10: Verificar Funcionalidad Completa](#paso-10-verificar-funcionalidad-completa)

---

## 🧠 Conceptos Básicos

### ¿Qué son las Variables de Entorno?

Las **variables de entorno** son valores que tu aplicación usa pero que pueden cambiar según el entorno (desarrollo, producción, etc.).

**Ejemplo:**
- En desarrollo: `VITE_API_URL = http://localhost:3001`
- En producción: `VITE_API_URL = https://back-indiana.vercel.app`

**¿Por qué usarlas?**
- ✅ No hardcodeas URLs en el código
- ✅ Puedes cambiar la configuración sin modificar código
- ✅ Diferentes configuraciones para desarrollo y producción

### ¿Qué es un Redeploy?

Un **redeploy** es volver a construir y desplegar tu aplicación.

**¿Cuándo hacerlo?**
- Después de agregar/modificar variables de entorno
- Después de cambiar configuración en `vercel.json`
- Cuando quieres aplicar cambios sin hacer commit

**¿Cómo funciona?**
1. Vercel toma tu código
2. Lee las variables de entorno
3. Construye la aplicación con esas variables
4. Despliega la nueva versión

---

## 📍 Paso 1: Acceder a Vercel Dashboard

### 1.1. Abrir el Navegador

1. Abre tu navegador favorito (Chrome, Firefox, Edge, etc.)
2. Ve a la barra de direcciones

### 1.2. Ir a Vercel

1. Escribe: `vercel.com`
2. Presiona **Enter**

**Resultado esperado:** Verás la página de inicio de Vercel

### 1.3. Iniciar Sesión

1. Si no estás logueado, click en **"Log In"** (arriba a la derecha)
2. Inicia sesión con tu cuenta (GitHub, GitLab, Bitbucket, o email)

**Resultado esperado:** Verás el dashboard de Vercel con tus proyectos

### 1.4. Identificar tu Proyecto Frontend

Busca en la lista el proyecto que corresponde a tu **frontend** (indiana-usados o el nombre que le hayas dado).

**💡 Tip:** Si tienes muchos proyectos, usa el buscador en la parte superior.

---

## 📍 Paso 2: Navegar a Environment Variables

### 2.1. Abrir el Proyecto

1. Click en el nombre de tu proyecto frontend
2. Se abrirá la página del proyecto

**Resultado esperado:** Verás información del proyecto, deployments, etc.

### 2.2. Ir a Settings

1. En la parte superior de la página, verás un menú con pestañas:
   - Overview
   - Deployments
   - **Settings** ← Click aquí
   - Analytics
   - etc.

2. Click en **"Settings"**

**Resultado esperado:** Verás un menú lateral con opciones de configuración

### 2.3. Encontrar Environment Variables

En el menú lateral izquierdo, busca la opción **"Environment Variables"**.

**Ubicación típica:**
- General
- Domains
- **Environment Variables** ← Click aquí
- Build & Development Settings
- etc.

**Resultado esperado:** Verás una página con:
- Lista de variables existentes (si hay)
- Botón **"Add New"** o **"Add"**

---

## 📍 Paso 3: Agregar Variable VITE_API_URL

### 3.1. Iniciar el Proceso

1. Click en el botón **"Add New"** o **"Add"**
2. Se abrirá un formulario

### 3.2. Llenar el Campo "Key" (Nombre)

En el campo **"Key"** o **"Name"**, escribe exactamente:

```
VITE_API_URL
```

**⚠️ IMPORTANTE:**
- Debe ser exactamente así (mayúsculas, guiones bajos)
- No debe tener espacios
- Debe empezar con `VITE_` (esto es requerido por Vite)

**Explicación:** 
- `VITE_` es el prefijo que Vite usa para exponer variables al frontend
- `API_URL` es el nombre que usaremos en el código

### 3.3. Llenar el Campo "Value" (Valor)

En el campo **"Value"**, escribe:

```
https://back-indiana.vercel.app
```

**⚠️ IMPORTANTE:**
- Debe ser exactamente esta URL (sin espacios, sin barra al final)
- Debe incluir `https://`
- No debe tener espacios antes o después

**Explicación:**
Esta es la URL de tu backend donde el frontend hará las peticiones.

### 3.4. Seleccionar el Entorno

Verás checkboxes o un selector para elegir en qué entornos aplicar esta variable:

1. ✅ **Production** - Selecciona este (click en el checkbox)
2. ⬜ Preview - Por ahora déjalo sin seleccionar
3. ⬜ Development - Por ahora déjalo sin seleccionar

**Explicación:**
- **Production:** Se usa cuando alguien visita tu sitio en producción
- **Preview:** Se usa en deployments de branches/PRs
- **Development:** Se usa en desarrollo local

### 3.5. Guardar

1. Click en el botón **"Save"** o **"Add"**
2. La variable aparecerá en la lista

**Resultado esperado:** Verás la variable `VITE_API_URL` en la lista con el valor `https://back-indiana.vercel.app`

---

## 📍 Paso 4: Agregar Variable VITE_ENVIRONMENT

### 4.1. Agregar Nueva Variable

1. Click en **"Add New"** nuevamente
2. Se abrirá el mismo formulario

### 4.2. Llenar el Campo "Key"

Escribe:

```
VITE_ENVIRONMENT
```

**Explicación:** Esta variable le dice a la aplicación en qué entorno está corriendo.

### 4.3. Llenar el Campo "Value"

Escribe:

```
production
```

**⚠️ IMPORTANTE:** 
- Debe ser exactamente `production` (minúsculas, sin espacios)
- No debe ser `Production` o `PRODUCTION`

**Explicación:** 
El código usa esta variable para saber que está en producción y ajustar comportamientos (menos logs, optimizaciones, etc.).

### 4.4. Seleccionar el Entorno

1. ✅ **Production** - Selecciona este
2. ⬜ Preview - Déjalo sin seleccionar por ahora
3. ⬜ Development - Déjalo sin seleccionar

### 4.5. Guardar

1. Click en **"Save"**
2. La variable aparecerá en la lista

**Resultado esperado:** Ahora deberías tener 2 variables:
- `VITE_API_URL` = `https://back-indiana.vercel.app`
- `VITE_ENVIRONMENT` = `production`

---

## 📍 Paso 5: Agregar Variables Opcionales (Recomendado)

Estas variables mejoran la funcionalidad pero no son estrictamente necesarias.

### 5.1. Variable VITE_CLOUDINARY_CLOUD_NAME

**¿Para qué sirve?** Configura Cloudinary para optimización de imágenes.

**Pasos:**
1. Click en **"Add New"**
2. **Key:** `VITE_CLOUDINARY_CLOUD_NAME`
3. **Value:** `duuwqmpmn` (o tu cloud name si es diferente)
4. **Environment:** ✅ Production
5. Click en **"Save"**

### 5.2. Variable VITE_CONTACT_EMAIL

**¿Para qué sirve?** Email de contacto que se muestra en el sitio.

**Pasos:**
1. Click en **"Add New"**
2. **Key:** `VITE_CONTACT_EMAIL`
3. **Value:** `info@indianausados.com` (o tu email)
4. **Environment:** ✅ Production
5. Click en **"Save"**

### 5.3. Variable VITE_CONTACT_WHATSAPP

**¿Para qué sirve?** Número de WhatsApp para contacto.

**Pasos:**
1. Click en **"Add New"**
2. **Key:** `VITE_CONTACT_WHATSAPP`
3. **Value:** `5491112345678` (código de país + número, sin espacios)
4. **Environment:** ✅ Production
5. Click en **"Save"**

### 5.4. Variable VITE_API_TIMEOUT

**¿Para qué sirve?** Tiempo máximo de espera para peticiones API (en milisegundos).

**Pasos:**
1. Click en **"Add New"**
2. **Key:** `VITE_API_TIMEOUT`
3. **Value:** `15000` (15 segundos)
4. **Environment:** ✅ Production
5. Click en **"Save"**

**Resultado esperado:** Ahora deberías tener 6 variables configuradas para Production.

---

## 📍 Paso 6: Configurar Variables para Preview

Preview es útil cuando haces cambios en branches o PRs y quieres probarlos antes de producción.

### 6.1. Agregar VITE_API_URL para Preview

1. Click en **"Add New"**
2. **Key:** `VITE_API_URL`
3. **Value:** `https://back-indiana.vercel.app` (mismo backend)
4. **Environment:** ✅ **Preview** (esta vez selecciona Preview, NO Production)
5. Click en **"Save"**

**Explicación:** Usamos el mismo backend para preview y production.

### 6.2. Agregar VITE_ENVIRONMENT para Preview

1. Click en **"Add New"**
2. **Key:** `VITE_ENVIRONMENT`
3. **Value:** `staging` (no `production`)
4. **Environment:** ✅ **Preview**
5. Click en **"Save"**

**Explicación:** `staging` indica que es un entorno de prueba, no producción.

### 6.3. Opcional: Agregar Otras Variables para Preview

Puedes agregar las mismas variables opcionales pero seleccionando **Preview** en lugar de Production.

**Resultado esperado:** 
- Variables para **Production** ✅
- Variables para **Preview** ✅

---

## 📍 Paso 7: Hacer el Redeploy

### 7.1. Navegar a Deployments

1. En el menú superior, click en **"Deployments"**
2. Verás una lista de todos tus deployments

**Explicación:** Cada vez que haces un cambio y se despliega, aparece aquí.

### 7.2. Identificar el Último Deployment

Busca el deployment más reciente. Generalmente es el primero de la lista.

**Características:**
- Tiene la fecha/hora más reciente
- Puede tener un estado: ✅ Ready, 🔄 Building, ❌ Error

### 7.3. Abrir el Menú de Opciones

1. En la esquina superior derecha del deployment, verás **3 puntos** (⋯)
2. Click en los 3 puntos
3. Se abrirá un menú desplegable

**Opciones típicas:**
- View Function Logs
- Download
- **Redeploy** ← Esta es la que necesitamos
- Cancel
- etc.

### 7.4. Seleccionar Redeploy

1. Click en **"Redeploy"**
2. Aparecerá un diálogo de confirmación

**Explicación:** Vercel te pregunta si estás seguro porque va a volver a construir la aplicación.

### 7.5. Confirmar el Redeploy

1. Lee el mensaje de confirmación
2. Click en **"Redeploy"** o **"Confirm"** en el diálogo

**Resultado esperado:** 
- El deployment cambiará de estado a **"Building"** o **"Queued"**
- Verás un indicador de progreso

### 7.6. Esperar el Build

**¿Cuánto tarda?**
- Normalmente: 2-3 minutos
- Puede variar según el tamaño del proyecto

**¿Qué está pasando?**
1. Vercel descarga tu código
2. Lee las variables de entorno que acabamos de configurar
3. Ejecuta `npm ci` (instala dependencias)
4. Ejecuta `npm run build` (construye la aplicación)
5. Despliega los archivos generados

**Mientras esperas:**
- Puedes ver los logs en tiempo real
- Verás mensajes como "Installing dependencies", "Building", etc.

---

## 📍 Paso 8: Verificar el Deployment

### 8.1. Verificar el Estado

Cuando termine el build, verifica:

1. **✅ Estado Verde:** Deployment exitoso
2. **❌ Estado Rojo:** Hubo un error (revisa los logs)

**¿Dónde ver el estado?**
- En la lista de deployments, verás un ícono ✅ o ❌
- O el texto "Ready" o "Error"

### 8.2. Ver los Logs (Si hay Error)

Si hay un error:

1. Click en el deployment
2. Ve a la pestaña **"Build Logs"** o **"Function Logs"**
3. Revisa los mensajes de error

**Errores comunes:**
- Variables mal escritas
- Problemas de build
- Dependencias faltantes

### 8.3. Verificar que las Variables se Aplicaron

1. Click en el deployment
2. Ve a **"Settings"** o busca información del deployment
3. Verifica que las variables estén listadas

**💡 Tip:** Si todo salió bien, verás el deployment con estado ✅ Ready.

---

## 📍 Paso 9: Probar en el Navegador

### 9.1. Abrir tu Sitio

1. En el deployment, verás una URL (ej: `https://indiana-usados.vercel.app`)
2. Click en la URL o cópiala y ábrela en una nueva pestaña

**Resultado esperado:** Tu sitio debería cargar normalmente.

### 9.2. Abrir la Consola del Navegador

**Método 1: Teclado**
- Presiona **F12**

**Método 2: Menú**
- Click derecho en la página → **"Inspeccionar"** o **"Inspect"**

**Método 3: Menú del Navegador**
- Chrome/Edge: Menú (3 puntos) → Más herramientas → Herramientas para desarrolladores

**Resultado esperado:** Se abrirá un panel en la parte inferior o lateral con varias pestañas.

### 9.3. Ir a la Pestaña Console

En el panel de herramientas de desarrollador, busca la pestaña **"Console"** y click en ella.

**Resultado esperado:** Verás un área de texto donde puedes escribir código JavaScript.

### 9.4. Verificar Variables de Entorno

En la consola, escribe exactamente esto y presiona **Enter**:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Resultado esperado:** Deberías ver algo como:

```
API URL: https://back-indiana.vercel.app
```

**Si ves `undefined`:**
- Las variables no se aplicaron correctamente
- Vuelve a verificar que estén en Vercel
- Haz otro redeploy

### 9.5. Verificar Environment

Escribe en la consola:

```javascript
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT);
```

**Resultado esperado:**

```
Environment: production
```

### 9.6. Ver Todas las Variables

Para ver todas las variables disponibles, escribe:

```javascript
console.log('Todas las variables:', import.meta.env);
```

**Resultado esperado:** Verás un objeto con todas las variables que empiezan con `VITE_`.

---

## 📍 Paso 10: Verificar Funcionalidad Completa

### 10.1. Probar Conexión con el Backend

En la consola del navegador, escribe:

```javascript
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

#### ✅ Éxito (Status 200):
```
✅ Status: 200
✅ Datos recibidos: { ... }
```
**Significado:** Todo funciona correctamente.

#### ❌ Error CORS:
```
❌ Error: Failed to fetch
Access to fetch ... has been blocked by CORS policy
```
**Significado:** El backend no permite peticiones desde tu dominio. (Pero dijiste que dejamos CORS de lado, así que esto no debería pasar si el backend tiene `app.use(cors())`)

#### ❌ Error 404:
```
✅ Status: 404
```
**Significado:** El endpoint no existe. Verifica la ruta en la documentación del backend.

#### ❌ Network Error:
```
❌ Error: NetworkError when attempting to fetch resource
```
**Significado:** El backend no está accesible o hay un problema de red.

### 10.2. Probar Funcionalidades de la Aplicación

Ahora prueba las funcionalidades que requieren backend:

#### Probar Carga de Vehículos
1. Ve a la página de vehículos
2. Verifica que se carguen los vehículos
3. Revisa la consola por errores

#### Probar Login (Si aplica)
1. Ve a la página de login
2. Intenta iniciar sesión
3. Verifica que funcione

#### Probar Otras Funciones
- Formularios
- Búsquedas
- Filtros
- etc.

### 10.3. Revisar Errores en Consola

1. Mantén la consola abierta
2. Navega por la aplicación
3. Verifica que no haya errores en rojo

**Errores comunes:**
- `Cannot read property of undefined` → Variable no configurada
- `Network Error` → Problema de conexión
- `404 Not Found` → Endpoint incorrecto

---

## ✅ Checklist Final

Marca cada item cuando lo completes:

### Configuración
- [ ] Variables agregadas en Vercel (Production)
- [ ] Variables agregadas en Vercel (Preview - opcional)
- [ ] Variables verificadas (nombres correctos, valores correctos)

### Deployment
- [ ] Redeploy realizado
- [ ] Build exitoso (✅ verde)
- [ ] Sin errores en los logs

### Verificación
- [ ] Variables visibles en consola del navegador
- [ ] `VITE_API_URL` muestra la URL correcta
- [ ] `VITE_ENVIRONMENT` muestra `production`
- [ ] Conexión con backend funciona (Status 200)
- [ ] Funcionalidades de la app funcionan
- [ ] No hay errores en consola

---

## 🎉 ¡Felicitaciones!

Si completaste todos los pasos y el checklist, tu frontend está correctamente conectado con el backend.

**Tu aplicación ahora:**
- ✅ Se conecta al backend en producción
- ✅ Usa las variables de entorno correctas
- ✅ Funciona completamente en producción

---

## 🆘 Si Algo Sale Mal

### Problema: Variables no aparecen en consola

**Solución:**
1. Verifica que los nombres empiecen con `VITE_`
2. Verifica que hayas hecho el redeploy
3. Verifica que las variables estén seleccionadas para Production

### Problema: Build falla

**Solución:**
1. Revisa los logs del build
2. Verifica que no haya errores de sintaxis en los nombres de variables
3. Verifica que los valores no tengan caracteres especiales problemáticos

### Problema: Backend no responde

**Solución:**
1. Verifica que el backend esté accesible: `https://back-indiana.vercel.app`
2. Prueba el endpoint directamente en el navegador
3. Verifica que la URL sea correcta (sin espacios, con https://)

---

## 📚 Recursos Adicionales

- **Documentación de Vercel:** https://vercel.com/docs
- **Variables de Entorno en Vite:** https://vitejs.dev/guide/env-and-mode.html
- **Troubleshooting:** Revisa los logs en Vercel Dashboard

---

**Última actualización:** 2024-01-XX

