# ⚡ CAMBIO RÁPIDO DE ENTORNO - GUÍA RÁPIDA

## 🚀 **Configuración Implementada**

El proyecto ahora tiene **configuración dinámica completa** que permite cambiar entre entornos **sin tocar código**.

## 📋 **Cómo Usar**

### **1. Crear archivo `.env.local`**
```bash
# Copiar el archivo de ejemplo
cp src/config/env.local.example .env.local
```

### **2. Cambiar entorno con scripts npm**

**🟢 Desarrollo con Postman (actual):**
```bash
npm run env:postman
```

**🟡 Desarrollo con Backend Local:**
```bash
npm run env:local
```

**🔴 Producción:**
```bash
npm run env:production
```

**🟣 Testing:**
```bash
npm run env:testing
```

**📋 Ver opciones disponibles:**
```bash
npm run env:show
```

### **3. Reiniciar servidor**
```bash
npm run dev
```

## 🔧 **Configuración Manual**

Si prefieres configurar manualmente, edita `.env.local`:

### **Postman (Actual)**
```bash
VITE_USE_MOCK_API=true
VITE_USE_POSTMAN_MOCK=true
VITE_POSTMAN_MOCK_URL=https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io
```

### **Backend Local**
```bash
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false
VITE_API_URL=http://localhost:3001/api
```

### **Producción**
```bash
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false
VITE_API_URL=https://api.indiana-usados.com
VITE_ENABLE_DEBUG_LOGS=false
```

## 📊 **Logging de Configuración**

Cuando ejecutes `npm run dev`, verás en la consola:

```javascript
🔧 CONFIGURACIÓN AXIOS: {
  baseURL: "https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io",
  detailBaseURL: "https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io",
  timeout: 5000,
  useMock: "true",
  usePostman: "true"
}
```

## ⚡ **Beneficios**

### **✅ Cambio Instantáneo**
- Sin tocar código
- Sin rebuild necesario
- Solo cambiar variables

### **✅ Configuración Centralizada**
- Todas las variables en un lugar
- Documentación incluida
- Fallbacks seguros

### **✅ Desarrollo Eficiente**
- Logging inteligente
- Configuración automática
- Scripts npm disponibles

## 🎯 **Ejemplo de Uso**

```bash
# 1. Cambiar a backend local
npm run env:local

# 2. Reiniciar servidor
npm run dev

# 3. Ver configuración en consola
# 4. Cambiar a producción
npm run env:production

# 5. ¡Listo! Cambio instantáneo
```

## 📝 **Archivos Modificados**

- ✅ `src/api/axiosInstance.js` - URLs dinámicas
- ✅ `src/config/postman.js` - Configuración dinámica
- ✅ `src/api/vehiclesApi.js` - Lógica condicional
- ✅ `src/config/env.local.example` - Variables completas
- ✅ `scripts/switch-env.js` - Script de cambio
- ✅ `package.json` - Scripts npm

## 🚀 **Resultado**

**Cambio de entorno en 30 segundos** sin tocar código, solo ejecutando un comando npm.

---

**¡Listo para usar!** 🎉 