# 🚗 Indiana Usados

> **Aplicación web moderna para gestión de vehículos usados**

## 🎯 Descripción

Indiana Usados es una plataforma web desarrollada con React que permite a los usuarios explorar, filtrar y visualizar vehículos usados de manera intuitiva y eficiente.

## ✨ Características

- 🔍 **Búsqueda avanzada** con filtros por marca, modelo, precio, año
- 📱 **Diseño responsive** optimizado para móviles y desktop
- 🖼️ **Galería de imágenes** interactiva para cada vehículo
- ⚡ **Paginación infinita** para navegación fluida
- 🔐 **Panel administrativo** para gestión de contenido
- 🎨 **UI moderna** con componentes reutilizables

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd indiana-usados

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm test         # Ejecutar tests
```

## 🏗️ Tecnologías

- **Frontend**: React 18, Vite
- **Estado**: React Query, Context API
- **Routing**: React Router v6
- **HTTP**: Axios
- **Testing**: Vitest, Testing Library
- **Styling**: CSS Modules

## 📁 Estructura del Proyecto

```
src/
├── api/           # Normalizadores de datos
├── components/    # Componentes UI reutilizables
├── hooks/         # Custom hooks
├── mappers/       # Transformadores de datos
├── pages/         # Páginas de la aplicación
├── services/      # Servicios de API
├── utils/         # Utilidades y helpers
└── styles/        # Estilos globales
```

## 📚 Documentación

- [Documentación Técnica](./docs/README.md)
- [Sistema de Paginación](./docs/PAGINACION_VEHICULOS.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo**: Equipo Indiana Usados
- **Versión**: 2.0.0
- **Última actualización**: 2024