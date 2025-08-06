# 🚀 CAMBIO RÁPIDO DE ENTORNO - INDIANA USADOS

## 📋 **Configuración Completa Implementada**

El proyecto ahora tiene configuración dinámica completa que permite cambiar entre entornos **sin tocar código**, solo modificando variables de entorno.

## 🔧 **Archivos Modificados**

### ✅ `src/api/axiosInstance.js`
- URLs dinámicas basadas en variables de entorno
- Configuración de timeout dinámica
- Logging de configuración en desarrollo

### ✅ `src/config/postman.js`
- URLs de Postman dinámicas
- Timeouts y reintentos configurables
- Logging de configuración

### ✅ `src/api/vehiclesApi.js`
- Lógica condicional para diferentes entornos
- Validación específica por entorno
- Logging inteligente

### ✅ `src/config/env.local.example`
- Configuración completa de variables
- Documentación de cada variable
- Ejemplos para diferentes entornos

## 🎯 **Cómo Cambiar de Entorno**

### **1. Crear archivo `.env.local`**
```bash
# Copiar el archivo de ejemplo
cp src/config/env.local.example .env.local
```

### **2. Configurar para Desarrollo con Postman**
```bash
# .env.local
VITE_USE_MOCK_API=true
VITE_USE_POSTMAN_MOCK=true
VITE_POSTMAN_MOCK_URL=https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io
VITE_POSTMAN_DETAIL_URL=https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io
```

### **3. Configurar para Backend Local**
```bash
# .env.local
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false
VITE_API_URL=http://localhost:3001/api
```

### **4. Configurar para Producción**
```bash
# .env.local
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false
VITE_API_URL=https://api.indiana-usados.com
```

## 🔄 **Configuraciones Predefinidas**

### **🟢 Desarrollo con Postman (Actual)**
```bash
VITE_USE_MOCK_API=true
VITE_USE_POSTMAN_MOCK=true
VITE_POSTMAN_MOCK_URL=https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io
VITE_POSTMAN_DETAIL_URL=https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io
```

### **🟡 Desarrollo con Backend Local**
```bash
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false
VITE_API_URL=http://localhost:3001/api
```

### **🔴 Producción**
```bash
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false
VITE_API_URL=https://api.indiana-usados.com
VITE_ENABLE_DEBUG_LOGS=false
```

### **🟣 Testing**
```bash
VITE_USE_MOCK_API=true
VITE_USE_POSTMAN_MOCK=false
VITE_MOCK_API_URL=http://localhost:3000/api
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

🔧 CONFIGURACIÓN POSTMAN: {
  baseURL: "https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io",
  detailBaseURL: "https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io",
  timeout: 10000,
  retries: 3,
  retryDelay: 1000
}

🔧 CONFIGURACIÓN VEHICLES API: {
  useMock: true,
  usePostman: true,
  environment: "development"
}
```

## ⚡ **Cambio Rápido - Sin Rebuild**

### **Para cambiar de Postman a Backend Local:**
1. Editar `.env.local`
2. Cambiar `VITE_USE_MOCK_API=false`
3. Cambiar `VITE_API_URL=http://localhost:3001/api`
4. **¡Listo!** No necesitas reiniciar el servidor

### **Para cambiar de Backend Local a Producción:**
1. Editar `.env.local`
2. Cambiar `VITE_API_URL=https://api.indiana-usados.com`
3. **¡Listo!** Cambio instantáneo

## 🛡️ **Validaciones Implementadas**

### **✅ Detección de Entorno**
- Automática basada en variables de entorno
- Fallbacks seguros si faltan variables
- Logging detallado en desarrollo

### **✅ Validación de Respuestas**
- **Postman**: Validación específica de estructura
- **Backend Real**: Asume estructura estándar
- **Mock Local**: Preparado para futuro

### **✅ Manejo de Errores**
- Timeouts configurables
- Reintentos automáticos
- Logging específico por entorno

## 🚀 **Beneficios Implementados**

### **✅ Flexibilidad Total**
- Cambio de entorno sin tocar código
- Configuración centralizada
- Variables documentadas

### **✅ Desarrollo Eficiente**
- Logging inteligente (solo en desarrollo)
- Configuración automática
- Fallbacks seguros

### **✅ Producción Lista**
- Configuración optimizada
- Logging deshabilitado
- Performance optimizada

## 📝 **Próximos Pasos**

### **🔄 Mock Local (Futuro)**
```javascript
// En vehiclesApi.js ya está preparado
if (USE_MOCK_API && !USE_POSTMAN_MOCK) {
    // TODO: Implementar mock local
    return mockData.getVehicles({ limit, page })
}
```

### **🧪 Tests Automatizados**
```bash
# Crear tests para validar cambios de entorno
npm test -- --env=postman
npm test -- --env=local
npm test -- --env=production
```

### **📊 Monitoring**
```javascript
// Agregar métricas de performance por entorno
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

---

## 🎯 **Resumen**

**✅ IMPLEMENTADO:**
- Configuración dinámica completa
- Cambio rápido de entorno
- Logging inteligente
- Validaciones por entorno
- Fallbacks seguros

**🔄 LISTO PARA:**
- Backend real (solo cambiar variables)
- Mock local (implementar lógica)
- Tests automatizados
- Monitoring de producción

**🚀 RESULTADO:**
Cambio de entorno en **30 segundos** sin tocar código, solo editando `.env.local` 