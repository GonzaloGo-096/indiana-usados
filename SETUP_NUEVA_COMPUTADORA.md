# 🖥️ Guía de Configuración - Indiana Usados

> **Para configurar el proyecto en una nueva computadora**

## 📋 Checklist de Requisitos Previos

### 1. Software Necesario

- ✅ **Node.js** (versión 18 o superior)
  - Descargar desde: https://nodejs.org/
  - Verificar instalación: `node --version`

- ✅ **npm** (viene con Node.js)
  - Verificar: `npm --version`

- ✅ **Git** (opcional, solo si usas repositorio)
  - Descargar desde: https://git-scm.com/

- ✅ **Editor de Código** (recomendado: VS Code)
  - Descargar desde: https://code.visualstudio.com/

---

## 📁 Archivos Necesarios del Proyecto

### 🎯 **Archivos OBLIGATORIOS** (copiar TODO el proyecto)

```
Indiana-usados/
├── src/                          # ✅ TODO el código fuente
├── public/                       # ✅ Archivos públicos (logos, imágenes)
├── index.html                    # ✅ HTML principal
├── package.json                  # ✅ Dependencias
├── vite.config.js               # ✅ Configuración de Vite
├── eslint.config.js             # ✅ Configuración de ESLint
├── .gitignore                    # ✅ Ignorar archivos
├── README.md                     # ✅ Documentación
└── SETUP_NUEVA_COMPUTADORA.md   # ✅ Esta guía
```

### ❌ **Archivos que NO necesitas copiar**

```
Indiana-usados/
├── node_modules/                 # ❌ Se reinstala
├── dist/                        # ❌ Se regenera
├── .env                         # ⚠️ Debes crearlo
├── package-lock.json            # ❌ Se regenera
└── *.log                        # ❌ Archivos de logs
```

---

## 🔧 Pasos de Instalación

### **Paso 1: Copiar el proyecto**

Copia toda la carpeta del proyecto a tu nueva computadora (excepto `node_modules/` y `dist/`).

### **Paso 2: Instalar dependencias**

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Este comando descargará e instalará todas las dependencias necesarias (puede tardar unos minutos).

### **Paso 3: Crear archivo de variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con este contenido:

```env
# 🌍 ENTORNO
VITE_ENVIRONMENT=development

# 🔌 API (Backend)
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=15000

# 🐛 DEBUG (solo en desarrollo)
VITE_DEBUG=true
VITE_ERROR_BOUNDARIES=true
VITE_LAZY_LOADING=true
VITE_IMAGE_OPTIMIZATION=true

# 🔐 AUTENTICACIÓN
VITE_AUTH_ENABLED=true
VITE_AUTH_STORAGE_KEY=indiana_auth_token
VITE_USER_STORAGE_KEY=indiana_user_data

# 📧 CONTACTO
VITE_CONTACT_EMAIL=info@indianausados.com
VITE_CONTACT_WHATSAPP=5491112345678

# 🖼️ CLOUDINARY (Imágenes)
VITE_CLOUDINARY_CLOUD_NAME=duuwqmpmn
VITE_IMG_PROGRESSIVE_JPEG=true
VITE_IMG_PLACEHOLDER_BLUR=true
VITE_IMG_METRICS=true
```

### **Paso 4: Verificar instalación**

```bash
npm run dev
```

Si todo está bien, se abrirá automáticamente en el navegador en `http://localhost:8080`

---

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Producción
npm run build            # Construir para producción
npm run preview          # Previsualizar build

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch

# Análisis
npm run build:analyze    # Analizar tamaño del bundle
```

---

## ⚠️ Configuraciones Importantes

### 🔌 **URL del Backend**

Si tu backend está en una URL diferente, actualiza esta variable en `.env`:

```env
VITE_API_URL=http://tu-servidor-backend.com
```

### 📱 **WhatsApp de Contacto**

Actualiza con tu número real (formato: 549XXXXXXXXX, sin +):

```env
VITE_CONTACT_WHATSAPP=5491112345678
```

### 🖼️ **Cloudinary**

Si usas una cuenta de Cloudinary diferente:

```env
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
```

---

## 🐛 Solución de Problemas

### **Error: "Cannot find module"**

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install
```

### **Error: "Port 8080 is already in use"**

Edita `vite.config.js` y cambia el puerto:

```javascript
server: {
  port: 3000,  // Cambia a otro puerto
  ...
}
```

### **El proyecto no conecta con el backend**

Verifica que:
1. El archivo `.env` existe y tiene la variable `VITE_API_URL`
2. El backend está corriendo en la URL especificada
3. No hay errores en la consola del navegador

---

## 📚 Documentación Adicional

- **README.md** - Información general del proyecto
- **src/hooks/README.md** - Documentación de hooks
- **src/config/index.js** - Configuración centralizada

---

## ✅ Checklist Final

Antes de empezar a trabajar, verifica:

- [ ] Node.js instalado (`node --version`)
- [ ] Proyecto copiado a la nueva PC
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado
- [ ] Proyecto corre correctamente (`npm run dev`)
- [ ] Backend conectado (si aplica)
- [ ] WhatsApp configurado con tu número real

---

## 🆘 Si Todo Falla

1. Verifica que Node.js esté instalado correctamente
2. Revisa los logs de error en la terminal
3. Compara tu `.env` con el ejemplo de arriba
4. Asegúrate de tener todos los archivos de `src/`
5. Verifica que el backend esté corriendo (si aplica)

---

**¡Listo!** Ya deberías poder trabajar en el proyecto en tu nueva computadora. 🚀

