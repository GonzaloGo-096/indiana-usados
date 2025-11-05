# 🚀 Guía de Deployment - Indiana Usados

## 📋 Índice
1. [Análisis del Sistema Actual](#análisis-del-sistema-actual)
2. [Variables de Entorno](#variables-de-entorno)
3. [Configuración para Desarrollo](#configuración-para-desarrollo)
4. [Configuración para Producción](#configuración-para-producción)
5. [Proceso de Deployment](#proceso-de-deployment)
6. [Plataformas de Hosting](#plataformas-de-hosting)

---

## 📊 Análisis del Sistema Actual

### **Arquitectura del Proyecto**
- **Framework**: React con Vite
- **Build Tool**: Vite 5.x
- **Configuración Centralizada**: `src/config/index.js`
- **Gestión de Variables**: `import.meta.env` (formato Vite)

### **Cómo Funciona el Sistema de Variables de Entorno**

#### **1. Sistema de Vite**
Vite expone variables de entorno al código del cliente **solo** si:
- ✅ Empiezan con `VITE_`
- ✅ Están definidas en archivos `.env` o como variables del sistema

**Ejemplo:**
```javascript
// ✅ CORRECTO - Se expone al cliente
import.meta.env.VITE_API_URL

// ❌ INCORRECTO - NO se expone (solo en servidor Node.js)
import.meta.env.API_URL
```

#### **2. Configuración Centralizada**
El proyecto usa un sistema centralizado en `src/config/index.js`:
- ✅ Validación de entornos
- ✅ Valores por defecto seguros
- ✅ Configuración unificada
- ✅ Tipado implícito

**Estructura:**
```javascript
// src/config/index.js
export const config = {
  environment: 'development' | 'staging' | 'production',
  api: {
    baseURL: string,
    timeout: number
  },
  features: {
    debug: boolean,
    errorBoundaries: boolean,
    // ...
  },
  contact: {
    email: string,
    whatsapp: string
  },
  images: {
    cloudinary: {
      cloudName: string,
      progressiveJpeg: boolean,
      blurPlaceholder: boolean
    }
  }
}
```

---

## 🔧 Variables de Entorno

### **Variables Usadas en el Proyecto**

| Variable | Tipo | Descripción | Valor por Defecto |
|----------|------|-------------|-------------------|
| `VITE_ENVIRONMENT` | string | Entorno: `development`, `staging`, `production` | `development` |
| `VITE_API_URL` | string | URL del backend API | `http://localhost:3001` |
| `VITE_API_TIMEOUT` | number | Timeout de requests (ms) | `15000` |
| `VITE_DEBUG` | boolean | Modo debug (solo dev) | `false` |
| `VITE_ERROR_BOUNDARIES` | boolean | Habilitar error boundaries | `true` |
| `VITE_LAZY_LOADING` | boolean | Habilitar lazy loading | `true` |
| `VITE_IMAGE_OPTIMIZATION` | boolean | Optimización de imágenes | `true` |
| `VITE_CONTACT_EMAIL` | string | Email de contacto | `info@indianausados.com` |
| `VITE_CONTACT_WHATSAPP` | string | Número de WhatsApp | `5491112345678` |
| `VITE_CLOUDINARY_CLOUD_NAME` | string | Cloud name de Cloudinary | `duuwqmpmn` |
| `VITE_IMG_PROGRESSIVE_JPEG` | boolean | Progressive JPEG | `false` |
| `VITE_IMG_PLACEHOLDER_BLUR` | boolean | Blur placeholder | `false` |

### **Archivos de Configuración**

Vite lee variables de entorno en este orden (el primero tiene prioridad):
1. `.env.[mode].local` (ej: `.env.production.local`)
2. `.env.[mode]` (ej: `.env.production`)
3. `.env.local`
4. `.env`

**Ejemplo:**
```
.env.production.local  ← Mayor prioridad
.env.production
.env.local
.env                   ← Menor prioridad
```

---

## 💻 Configuración para Desarrollo

### **Paso 1: Crear archivo .env.local**

```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local
```

### **Paso 2: Configurar variables de desarrollo**

Edita `.env.local` con tus valores de desarrollo:

```env
# .env.local
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:3001
VITE_DEBUG=true
VITE_CONTACT_EMAIL=dev@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678
# ... resto de variables
```

### **Paso 3: Ejecutar en desarrollo**

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:8080` (configurado en `vite.config.js`).

### **Verificar configuración**

En desarrollo, con `VITE_DEBUG=true`, verás en la consola del navegador:
```
[config:loaded] CONFIGURACIÓN CARGADA
{
  environment: "development",
  api: { baseURL: "http://localhost:3001", timeout: 15000 },
  features: { ... }
}
```

---

## 🏭 Configuración para Producción

### **Opción 1: Archivo .env.production**

Crear `.env.production` en la raíz del proyecto:

```env
# .env.production
VITE_ENVIRONMENT=production
VITE_API_URL=https://api.indianausados.com
VITE_API_TIMEOUT=15000
VITE_DEBUG=false
VITE_ERROR_BOUNDARIES=true
VITE_LAZY_LOADING=true
VITE_IMAGE_OPTIMIZATION=true
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678
VITE_CLOUDINARY_CLOUD_NAME=duuwqmpmn
VITE_IMG_PROGRESSIVE_JPEG=true
VITE_IMG_PLACEHOLDER_BLUR=true
```

### **Opción 2: Variables de Entorno del Sistema (Recomendado para CI/CD)**

En lugar de archivos `.env`, configurar variables de entorno directamente:

**Linux/Mac:**
```bash
export VITE_ENVIRONMENT=production
export VITE_API_URL=https://api.indianausados.com
# ... resto de variables
npm run build
```

**Windows (PowerShell):**
```powershell
$env:VITE_ENVIRONMENT="production"
$env:VITE_API_URL="https://api.indianausados.com"
# ... resto de variables
npm run build
```

### **Build de Producción**

```bash
# Build con archivo .env.production
npm run build

# O build con variables del sistema
VITE_ENVIRONMENT=production VITE_API_URL=https://api.indianausados.com npm run build
```

El build se genera en la carpeta `dist/`.

### **Verificar Build**

```bash
# Preview del build de producción
npm run preview
```

Esto inicia un servidor en `http://localhost:4173` con el build de producción.

---

## 🚀 Proceso de Deployment

### **Checklist Pre-Deployment**

- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ `VITE_API_URL` apunta a la API de producción
- [ ] ✅ `VITE_ENVIRONMENT=production`
- [ ] ✅ `VITE_DEBUG=false`
- [ ] ✅ Build de producción exitoso (`npm run build`)
- [ ] ✅ Preview funciona correctamente (`npm run preview`)
- [ ] ✅ Tests pasan (`npm test`)
- [ ] ✅ No hay errores de lint (`npm run lint`)

### **Proceso de Build**

```bash
# 1. Instalar dependencias
npm ci  # Usa package-lock.json (más seguro que npm install)

# 2. Ejecutar tests
npm test

# 3. Lint
npm run lint

# 4. Build de producción
npm run build

# 5. Verificar build
npm run preview
```

### **Estructura del Build**

```
dist/
├── index.html
├── assets/
│   ├── images/
│   │   └── [archivos de imágenes optimizados]
│   ├── fonts/
│   │   └── [fuentes]
│   ├── css/
│   │   └── [estilos]
│   ├── vendor-react-[hash].js
│   ├── vendor-core-[hash].js
│   ├── vendor-misc-[hash].js
│   └── index-[hash].js
```

---

## 🌐 Plataformas de Hosting

### **1. Vercel (Recomendado para React)**

#### **Configuración:**
1. Conecta tu repositorio en [Vercel](https://vercel.com)
2. Configura variables de entorno en el dashboard:
   - Settings → Environment Variables
   - Agrega todas las variables `VITE_*`

#### **Variables de Entorno en Vercel:**
```
VITE_ENVIRONMENT=production
VITE_API_URL=https://api.indianausados.com
VITE_CLOUDINARY_CLOUD_NAME=duuwqmpmn
# ... resto de variables
```

#### **Configuración de Build:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

#### **Deployment Automático:**
- ✅ Push a `main` → Deploy a producción
- ✅ Push a otras ramas → Preview deployments

---

### **2. Netlify**

#### **Configuración:**
1. Conecta repositorio en [Netlify](https://netlify.com)
2. Configura build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### **Variables de Entorno:**
- Site settings → Environment variables
- Agrega todas las variables `VITE_*`

#### **Archivo netlify.toml (opcional):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[plugins]]
  package = "@netlify/plugin-lighthouse"
```

---

### **3. GitHub Pages**

#### **Configuración:**
1. Instala `gh-pages`:
```bash
npm install --save-dev gh-pages
```

2. Agrega script al `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Configura GitHub Actions para variables de entorno (recomendado)

#### **GitHub Actions Workflow:**
Crea `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        env:
          VITE_ENVIRONMENT: production
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_CLOUDINARY_CLOUD_NAME: ${{ secrets.VITE_CLOUDINARY_CLOUD_NAME }}
          # ... resto de variables desde secrets
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Configura los secrets en: Settings → Secrets and variables → Actions

---

### **4. AWS S3 + CloudFront**

#### **Configuración:**
1. **Build:**
```bash
npm run build
```

2. **Subir a S3:**
```bash
aws s3 sync dist/ s3://tu-bucket-name --delete
```

3. **Invalidar CloudFront:**
```bash
aws cloudfront create-invalidation \
  --distribution-id TU_DISTRIBUTION_ID \
  --paths "/*"
```

#### **Variables de Entorno:**
Configura en tu CI/CD (GitHub Actions, GitLab CI, etc.) o como variables del sistema antes del build.

---

### **5. Docker (Containerización)**

#### **Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Build con variables de entorno
ARG VITE_ENVIRONMENT=production
ARG VITE_API_URL
ARG VITE_CLOUDINARY_CLOUD_NAME
# ... resto de variables

ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME
# ... resto de variables

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### **Build y Run:**
```bash
# Build
docker build \
  --build-arg VITE_ENVIRONMENT=production \
  --build-arg VITE_API_URL=https://api.indianausados.com \
  -t indiana-usados:latest .

# Run
docker run -p 80:80 indiana-usados:latest
```

---

## 🔒 Seguridad y Mejores Prácticas

### **✅ Buenas Prácticas**

1. **Nunca commitees archivos `.env` con valores reales**
   - ✅ Usa `.gitignore` (ya está configurado)
   - ✅ Usa `.env.example` como template

2. **Variables sensibles**
   - ⚠️ **IMPORTANTE**: Las variables `VITE_*` se exponen al cliente
   - ❌ **NO** uses `VITE_*` para secrets, API keys privadas, tokens
   - ✅ Solo variables públicas que el navegador necesita

3. **Validación de variables**
   - ✅ El proyecto ya valida entornos en `src/config/index.js`
   - ✅ Valores por defecto seguros

4. **Separación de entornos**
   - ✅ Usa `.env.development` para dev
   - ✅ Usa `.env.production` para prod
   - ✅ Usa `.env.local` para configuraciones locales (no se commitea)

### **⚠️ Variables que NO deben usar VITE_**

Si necesitas secrets (API keys privadas, tokens, etc.):
- ❌ NO uses `VITE_SECRET_KEY` (se expone al cliente)
- ✅ Usa un backend/proxy para manejar secrets
- ✅ El frontend solo debe tener variables públicas

---

## 📝 Resumen Rápido

### **Desarrollo:**
```bash
# 1. Copiar .env.example a .env.local
cp .env.example .env.local

# 2. Editar .env.local con tus valores
# 3. Ejecutar
npm run dev
```

### **Producción:**
```bash
# Opción 1: Con archivo .env.production
npm run build

# Opción 2: Con variables del sistema
VITE_ENVIRONMENT=production VITE_API_URL=https://api.indianausados.com npm run build
```

### **Deployment (Vercel/Netlify):**
1. Conectar repositorio
2. Configurar variables de entorno en el dashboard
3. Configurar build command: `npm run build`
4. Configurar output directory: `dist`
5. Deploy automático ✅

---

## 🎯 Próximos Pasos

1. ✅ Crear archivo `.env.local` para desarrollo
2. ✅ Configurar variables de producción
3. ✅ Elegir plataforma de hosting
4. ✅ Configurar CI/CD
5. ✅ Deploy 🚀

---

**¿Necesitas ayuda?** Revisa la documentación de Vite: https://vitejs.dev/guide/env-and-mode.html

