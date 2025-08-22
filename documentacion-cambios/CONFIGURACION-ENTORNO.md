# ⚙️ **CONFIGURACIÓN DE ENTORNO**

## 📋 **RESUMEN EJECUTIVO**
Este documento detalla la configuración completa de variables de entorno necesarias para conectar el frontend con el backend, incluyendo el archivo `.env.local` completo y configuraciones por entorno.

---

## 🎯 **1. ARCHIVO `.env.local` COMPLETO**

### **1.1 Ubicación y Creación**
**Ubicación**: `Indiana-usados/.env.local`
**Acción**: Crear archivo nuevo
**Prioridad**: ALTA - Primero en implementar

### **1.2 Contenido Completo**
```bash
# ===== ENTORNO =====
VITE_ENVIRONMENT=development

# ===== API =====
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=5000
VITE_MOCK_ENABLED=false
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false

# ===== FEATURES =====
VITE_DEBUG=true
VITE_ERROR_BOUNDARIES=true
VITE_LAZY_LOADING=true
VITE_IMAGE_OPTIMIZATION=true

# ===== AUTH =====
VITE_AUTH_ENABLED=true
VITE_AUTH_STORAGE_KEY=indiana_auth_token
VITE_USER_STORAGE_KEY=indiana_user_data

# ===== CONTACTO =====
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678
```

---

## 🔧 **2. EXPLICACIÓN DE VARIABLES**

### **2.1 Variables de Entorno**
```bash
VITE_ENVIRONMENT=development
```
**Propósito**: Define el entorno de la aplicación
**Valores posibles**: `development`, `staging`, `production`
**Valor por defecto**: `development`

### **2.2 Variables de API**
```bash
VITE_API_URL=http://localhost:3001
```
**Propósito**: URL base del backend
**Valor crítico**: Debe apuntar a `http://localhost:3001` (sin `/api`)
**Justificación**: El backend no tiene prefijo `/api`

```bash
VITE_API_TIMEOUT=5000
```
**Propósito**: Timeout para llamadas HTTP en milisegundos
**Valor recomendado**: `5000` (5 segundos)
**Valor máximo**: `30000` (30 segundos)

```bash
VITE_MOCK_ENABLED=false
```
**Propósito**: Habilita/deshabilita mock data
**Valor para backend**: `false`
**Valor para desarrollo sin backend**: `true`

```bash
VITE_USE_MOCK_API=false
```
**Propósito**: Habilita/deshabilita API mock
**Valor para backend**: `false`
**Valor para desarrollo sin backend**: `true`

```bash
VITE_USE_POSTMAN_MOCK=false
```
**Propósito**: Habilita/deshabilita Postman mock
**Valor para backend**: `false`
**Valor para desarrollo con Postman**: `true`

### **2.3 Variables de Features**
```bash
VITE_DEBUG=true
```
**Propósito**: Habilita logging detallado
**Valor recomendado**: `true` en desarrollo, `false` en producción

```bash
VITE_ERROR_BOUNDARIES=true
```
**Propósito**: Habilita error boundaries de React
**Valor recomendado**: `true` para mejor manejo de errores

```bash
VITE_LAZY_LOADING=true
```
**Propósito**: Habilita lazy loading de componentes
**Valor recomendado**: `true` para mejor performance

```bash
VITE_IMAGE_OPTIMIZATION=true
```
**Propósito**: Habilita optimización de imágenes
**Valor recomendado**: `true` para mejor performance

### **2.4 Variables de Autenticación**
```bash
VITE_AUTH_ENABLED=true
```
**Propósito**: Habilita sistema de autenticación
**Valor recomendado**: `true` (aunque no se use en esta implementación)

```bash
VITE_AUTH_STORAGE_KEY=indiana_auth_token
```
**Propósito**: Clave para almacenar token de autenticación
**Valor recomendado**: `indiana_auth_token`

```bash
VITE_USER_STORAGE_KEY=indiana_user_data
```
**Propósito**: Clave para almacenar datos del usuario
**Valor recomendado**: `indiana_user_data`

### **2.5 Variables de Contacto**
```bash
VITE_CONTACT_EMAIL=info@indianausados.com
```
**Propósito**: Email de contacto principal
**Valor recomendado**: `info@indianausados.com`

```bash
VITE_CONTACT_WHATSAPP=5491112345678
```
**Propósito**: Número de WhatsApp de contacto
**Valor recomendado**: `5491112345678`

---

## 🚀 **3. CONFIGURACIONES POR ENTORNO**

### **3.1 Desarrollo Local (Backend)**
```bash
# ===== ENTORNO =====
VITE_ENVIRONMENT=development

# ===== API =====
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=5000
VITE_MOCK_ENABLED=false
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false

# ===== FEATURES =====
VITE_DEBUG=true
VITE_ERROR_BOUNDARIES=true
VITE_LAZY_LOADING=true
VITE_IMAGE_OPTIMIZATION=true

# ===== AUTH =====
VITE_AUTH_ENABLED=true
VITE_AUTH_STORAGE_KEY=indiana_auth_token
VITE_USER_STORAGE_KEY=indiana_user_data

# ===== CONTACTO =====
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678
```

**Uso**: Para desarrollo local con backend funcionando
**Características**: Conecta con backend real, sin mock data

### **3.2 Desarrollo Local (Sin Backend)**
```bash
# ===== ENTORNO =====
VITE_ENVIRONMENT=development

# ===== API =====
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=5000
VITE_MOCK_ENABLED=true
VITE_USE_MOCK_API=true
VITE_USE_POSTMAN_MOCK=false

# ===== FEATURES =====
VITE_DEBUG=true
VITE_ERROR_BOUNDARIES=true
VITE_LAZY_LOADING=true
VITE_IMAGE_OPTIMIZATION=true

# ===== AUTH =====
VITE_AUTH_ENABLED=true
VITE_AUTH_STORAGE_KEY=indiana_auth_token
VITE_USER_STORAGE_KEY=indiana_user_data

# ===== CONTACTO =====
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678
```

**Uso**: Para desarrollo local sin backend
**Características**: Usa mock data, no intenta conectar con backend

### **3.3 Staging**
```bash
# ===== ENTORNO =====
VITE_ENVIRONMENT=staging

# ===== API =====
VITE_API_URL=https://staging-api.indiana-usados.com
VITE_API_TIMEOUT=10000
VITE_MOCK_ENABLED=false
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false

# ===== FEATURES =====
VITE_DEBUG=false
VITE_ERROR_BOUNDARIES=true
VITE_LAZY_LOADING=true
VITE_IMAGE_OPTIMIZATION=true

# ===== AUTH =====
VITE_AUTH_ENABLED=true
VITE_AUTH_STORAGE_KEY=indiana_auth_token
VITE_USER_STORAGE_KEY=indiana_user_data

# ===== CONTACTO =====
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678
```

**Uso**: Para entorno de staging
**Características**: Conecta con backend de staging, debug deshabilitado

### **3.4 Producción**
```bash
# ===== ENTORNO =====
VITE_ENVIRONMENT=production

# ===== API =====
VITE_API_URL=https://api.indiana-usados.com
VITE_API_TIMEOUT=15000
VITE_MOCK_ENABLED=false
VITE_USE_MOCK_API=false
VITE_USE_POSTMAN_MOCK=false

# ===== FEATURES =====
VITE_DEBUG=false
VITE_ERROR_BOUNDARIES=true
VITE_LAZY_LOADING=true
VITE_IMAGE_OPTIMIZATION=true

# ===== AUTH =====
VITE_AUTH_ENABLED=true
VITE_AUTH_STORAGE_KEY=indiana_auth_token
VITE_USER_STORAGE_KEY=indiana_user_data

# ===== CONTACTO =====
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678
```

**Uso**: Para entorno de producción
**Características**: Conecta con backend de producción, optimizado para performance

---

## 📝 **4. PASOS PARA CREAR EL ARCHIVO**

### **4.1 Crear Archivo**
```bash
# 1. Navegar a la raíz del proyecto
cd Indiana-usados

# 2. Crear archivo .env.local
touch .env.local

# 3. Abrir archivo en editor
code .env.local
# o
nano .env.local
# o
vim .env.local
```

### **4.2 Agregar Contenido**
Copiar y pegar el contenido completo del archivo `.env.local` (sección 1.2)

### **4.3 Validar Creación**
```bash
# Verificar que el archivo existe
ls -la .env.local

# Verificar contenido (primeras líneas)
head -10 .env.local

# Verificar que no hay errores de sintaxis
cat .env.local | grep -E "^[A-Z_]+="
```

---

## ⚠️ **5. CONSIDERACIONES IMPORTANTES**

### **5.1 Seguridad**
- **NUNCA** commitear archivo `.env.local` al repositorio
- **SÍ** commitear archivo `.env.example` como plantilla
- **Verificar** que `.gitignore` incluya `.env.local`

### **5.2 Validación**
- **Verificar** que todas las variables estén definidas
- **Validar** que no haya espacios extra en valores
- **Confirmar** que la aplicación cargue la configuración

### **5.3 Reinicio de Aplicación**
**IMPORTANTE**: Después de crear/modificar `.env.local`:
1. **Detener** la aplicación (`Ctrl+C`)
2. **Reiniciar** la aplicación (`npm run dev`)
3. **Verificar** que la configuración se cargue en consola

---

## 🔍 **6. VALIDACIÓN DE CONFIGURACIÓN**

### **6.1 Verificar Carga de Configuración**
**En consola del navegador** deberías ver:
```javascript
🔧 CONFIGURACIÓN CARGADA: {
  environment: "development",
  api: {
    baseURL: "http://localhost:3001",
    mock: false,
    timeout: 5000
  },
  features: {
    debug: true,
    errorBoundaries: true,
    lazyLoading: true,
    imageOptimization: true
  },
  auth: {
    enabled: true,
    storageKey: "indiana_auth_token",
    userStorageKey: "indiana_user_data"
  }
}
```

### **6.2 Verificar Variables de Entorno**
**En consola del navegador**:
```javascript
// Verificar variables críticas
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('VITE_MOCK_ENABLED:', import.meta.env.VITE_MOCK_ENABLED)
console.log('VITE_USE_MOCK_API:', import.meta.env.VITE_USE_MOCK_API)
```

**Valores esperados**:
- `VITE_API_URL`: `"http://localhost:3001"`
- `VITE_MOCK_ENABLED`: `"false"`
- `VITE_USE_MOCK_API`: `"false"`

---

## 🚨 **7. PROBLEMAS COMUNES Y SOLUCIONES**

### **7.1 Configuración No Se Carga**
**Síntoma**: No aparece log de configuración en consola
**Solución**:
1. Verificar que el archivo `.env.local` existe
2. Verificar que no hay errores de sintaxis
3. Reiniciar la aplicación
4. Verificar que el archivo está en la raíz del proyecto

### **7.2 Variables No Se Reconocen**
**Síntoma**: `import.meta.env.VITE_*` retorna `undefined`
**Solución**:
1. Verificar que las variables empiecen con `VITE_`
2. Verificar que no hay espacios extra
3. Reiniciar la aplicación
4. Verificar que el archivo está guardado

### **7.3 Configuración Incorrecta**
**Síntoma**: La aplicación no se conecta al backend
**Solución**:
1. Verificar que `VITE_API_URL` apunta a `http://localhost:3001`
2. Verificar que `VITE_MOCK_ENABLED` es `false`
3. Verificar que `VITE_USE_MOCK_API` es `false`
4. Reiniciar la aplicación

---

## 📚 **8. REFERENCIAS**

### **8.1 Documentación Relacionada**
- **Análisis Arquitectural**: `ANALISIS-ARQUITECTURAL.md`
- **Solución Técnica**: `SOLUCION-TECNICA.md`
- **Implementación Detallada**: `IMPLEMENTACION-DETALLADA.md`
- **Plan de Implementación**: `PLAN-IMPLEMENTACION.md`
- **Archivos a Modificar**: `ARCHIVOS-MODIFICAR.md`

### **8.2 Archivos de Configuración del Proyecto**
- **Configuración principal**: `src/config/index.js`
- **Configuración de API**: `src/config/env.js`
- **Configuración de auth**: `src/config/auth.js`
- **Ejemplo de variables**: `src/config/env.example.js`

---

## 🎯 **9. CHECKLIST DE VALIDACIÓN**

### **9.1 Creación del Archivo**
- [ ] Archivo `.env.local` creado en la raíz del proyecto
- [ ] Contenido copiado correctamente
- [ ] No hay errores de sintaxis
- [ ] Archivo guardado correctamente

### **9.2 Configuración de API**
- [ ] `VITE_API_URL=http://localhost:3001`
- [ ] `VITE_MOCK_ENABLED=false`
- [ ] `VITE_USE_MOCK_API=false`
- [ ] `VITE_USE_POSTMAN_MOCK=false`

### **9.3 Configuración de Features**
- [ ] `VITE_DEBUG=true`
- [ ] `VITE_ERROR_BOUNDARIES=true`
- [ ] `VITE_LAZY_LOADING=true`
- [ ] `VITE_IMAGE_OPTIMIZATION=true`

### **9.4 Validación de Carga**
- [ ] Aplicación reiniciada después de crear archivo
- [ ] Log de configuración aparece en consola
- [ ] Variables de entorno se reconocen correctamente
- [ ] No hay errores en consola

---

## 🎯 **10. CONCLUSIÓN**

El archivo `.env.local` es **CRÍTICO** para la implementación y debe crearse **PRIMERO** antes de cualquier otro cambio.

**Recuerda**: 
1. **Crear** el archivo en la raíz del proyecto
2. **Copiar** el contenido exacto
3. **Reiniciar** la aplicación
4. **Validar** que la configuración se cargue correctamente

Una vez que este archivo esté funcionando, puedes proceder con los cambios en el código.
