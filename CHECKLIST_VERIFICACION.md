# ✅ Checklist de Verificación - Variables de Entorno

## 🎯 Objetivo

Verificar que las variables de entorno estén configuradas correctamente en Vercel y que se estén aplicando en producción.

---

## 📋 Checklist Paso a Paso

### 1️⃣ Verificar Variables en Vercel

- [ ] Ir a Vercel Dashboard → Tu Proyecto
- [ ] Settings → Environment Variables
- [ ] Verificar que existe `VITE_API_URL`
- [ ] Verificar que el valor es `https://back-indiana.vercel.app`
- [ ] Verificar que existe `VITE_ENVIRONMENT`
- [ ] Verificar que el valor es `production`

### 2️⃣ Verificar Entornos Seleccionados

Para `VITE_API_URL`:
- [ ] ✅ Production está seleccionado
- [ ] ✅ Preview está seleccionado (opcional)

Para `VITE_ENVIRONMENT`:
- [ ] ✅ Production está seleccionado
- [ ] ✅ Preview está seleccionado (opcional)

### 3️⃣ Verificar Último Deployment

- [ ] Ir a Deployments
- [ ] Verificar fecha del último deployment
- [ ] ¿Fue DESPUÉS de agregar las variables?
  - [ ] Sí → Continuar
  - [ ] No → Hacer redeploy (ver paso 4)

### 4️⃣ Hacer Redeploy (Si es Necesario)

- [ ] Deployments → ⋯ (3 puntos) → Redeploy
- [ ] Confirmar redeploy
- [ ] Esperar 2-3 minutos
- [ ] Verificar que el deployment tenga ✅ verde

### 5️⃣ Verificar en el Navegador

- [ ] Abrir sitio en producción
- [ ] F12 → Console
- [ ] Ejecutar: `console.log('API:', import.meta.env.VITE_API_URL)`
- [ ] Verificar que muestre: `https://back-indiana.vercel.app`
- [ ] Si muestra `undefined` o `localhost:3001` → Volver al paso 4

### 6️⃣ Probar Conexión

- [ ] En consola, ejecutar:
  ```javascript
  fetch('https://back-indiana.vercel.app/photos/getallphotos?limit=1')
    .then(res => console.log('Status:', res.status))
  ```
- [ ] Verificar que muestre: `Status: 200`
- [ ] Si hay error → Revisar logs

---

## ✅ Resultado Esperado

Después de completar el checklist:

- ✅ Variables configuradas en Vercel
- ✅ Variables seleccionadas para Production
- ✅ Redeploy realizado
- ✅ Variables visibles en consola del navegador
- ✅ Backend conectado y funcionando
- ✅ Componentes cargando datos

---

## 🆘 Si Algo Falla

### Variables no aparecen en consola

1. Verifica que los nombres empiecen con `VITE_`
2. Haz otro redeploy
3. Limpia cache del navegador (Ctrl+Shift+Delete)

### Sigue usando localhost:3001

1. Verifica que las variables estén en Vercel
2. Verifica que estén seleccionadas para Production
3. Haz redeploy
4. Espera a que termine completamente

### Redeploy no funciona

1. Verifica que tengas permisos de administrador
2. Intenta desde Git: `git commit --allow-empty -m "Redeploy" && git push`
3. Contacta soporte de Vercel si persiste

---

**Marca cada item cuando lo completes.**

