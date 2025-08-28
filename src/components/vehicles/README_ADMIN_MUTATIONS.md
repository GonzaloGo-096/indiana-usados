# 🚗 Mutaciones Administrativas - Indiana Usados

## 📋 Descripción

Este módulo implementa las mutaciones administrativas para el panel de administración, permitiendo **editar** y **eliminar** fotos de vehículos desde la interfaz de usuario.

## 🔧 Endpoints Implementados

### 1. **Editar Foto** - `POST /photos/updatephoto/:id`
- **Ubicación**: Modal con formulario
- **Método**: POST
- **URL**: `http://localhost:3001/photos/updatephoto/:id`
- **Funcionalidad**: Actualiza datos del vehículo y/o imágenes

### 2. **Eliminar Foto** - `DELETE /photos/deletephoto/:id`
- **Ubicación**: Botón directo en card
- **Método**: DELETE
- **URL**: `http://localhost:3001/photos/deletephoto/:id`
- **Funcionalidad**: Elimina el vehículo de la base de datos

## 🎯 Cómo Usar

### Importar el Hook

```javascript
import { useAdminMutations } from '@hooks'

// En tu componente
const { updatePhoto, deletePhoto, isLoading, error, success } = useAdminMutations()
```

### 1. **Editar Foto (Modal con Formulario)**

```javascript
const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    try {
        const result = await updatePhoto(vehicleId, formData)
        
        if (result.success) {
            console.log('Foto actualizada exitosamente')
            // Cerrar modal, mostrar mensaje de éxito, etc.
        } else {
            console.error('Error:', result.error)
            // Mostrar mensaje de error
        }
    } catch (err) {
        console.error('Error inesperado:', err)
    }
}
```

### 2. **Eliminar Foto (Botón Directo)**

```javascript
const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro?')) return
    
    try {
        const result = await deletePhoto(vehicleId)
        
        if (result.success) {
            console.log('Foto eliminada exitosamente')
            // Actualizar UI, mostrar mensaje, etc.
        } else {
            console.error('Error:', result.error)
            // Mostrar mensaje de error
        }
    } catch (err) {
        console.error('Error inesperado:', err)
    }
}
```

## 📁 Estructura de Archivos

```
src/
├── api/
│   ├── vehiclesApi.js          # ✅ Métodos updatePhoto y deletePhoto agregados
│   └── index.js               # ✅ Exportaciones actualizadas
├── hooks/
│   ├── useAdminMutations.js   # ✅ Hook principal para mutaciones
│   └── index.js              # ✅ Exportación del hook
└── components/vehicles/
    ├── AdminActions.jsx       # ✅ Componente de ejemplo
    └── README_ADMIN_MUTATIONS.md # ✅ Esta documentación
```

## 🔐 Autenticación

- **Token**: Se obtiene automáticamente del localStorage
- **Clave**: Usa la misma configuración que `useAuth`
- **Headers**: Se incluyen automáticamente en todas las peticiones

## 🖼️ Manejo de Imágenes

### Campos de Imagen Soportados:
- `fotoPrincipal`: Imagen principal del vehículo
- `fotosAdicionales`: Múltiples imágenes adicionales

### Validaciones:
- ✅ Tipos de archivo soportados
- ✅ Tamaño máximo
- ✅ Formato correcto
- ✅ Preparación automática para Cloudinary

## 📊 Estados del Hook

```javascript
const {
    updatePhoto,    // ✅ Función para editar
    deletePhoto,    // ✅ Función para eliminar
    isLoading,      // ✅ Estado de carga
    error,          // ✅ Mensaje de error
    success,        // ✅ Estado de éxito
    resetState      // ✅ Resetear estados
} = useAdminMutations()
```

## 🚨 Manejo de Errores

### Errores Comunes:
- **401**: Token inválido o expirado
- **403**: Sin permisos para la operación
- **404**: Foto no encontrada
- **400**: Error de validación (formato de archivo, etc.)

### Mensajes Personalizados:
- Errores específicos del backend
- Mensajes de validación
- Errores de red
- Errores de autorización

## 🎨 Componente de Ejemplo

El archivo `AdminActions.jsx` muestra una implementación completa que incluye:

- ✅ Modal de edición con formulario
- ✅ Botón de eliminación directo
- ✅ Manejo de estados de carga
- ✅ Validación de formularios
- ✅ Manejo de archivos de imagen
- ✅ Mensajes de error y éxito
- ✅ Confirmación antes de eliminar

## 🔄 Flujo de Trabajo

### Edición:
1. Usuario hace clic en "Editar"
2. Se abre modal con datos actuales
3. Usuario modifica campos y/o imágenes
4. Se envía formulario con `updatePhoto()`
5. Se procesa respuesta y se actualiza UI

### Eliminación:
1. Usuario hace clic en "Eliminar"
2. Se muestra confirmación
3. Se ejecuta `deletePhoto()`
4. Se procesa respuesta y se actualiza UI

## 🧪 Testing

Para probar las mutaciones:

1. **Edición**: Abrir modal, modificar campos, enviar formulario
2. **Eliminación**: Hacer clic en botón eliminar, confirmar acción
3. **Validaciones**: Probar con archivos inválidos, campos vacíos
4. **Errores**: Simular problemas de red, tokens inválidos

## 📝 Notas Importantes

- ✅ **Modular**: Sigue el patrón existente del proyecto
- ✅ **Logging**: Incluye logging detallado para debugging
- ✅ **Performance**: Usa `measurePerformance` para monitoreo
- ✅ **Fallbacks**: Maneja errores de red y backend
- ✅ **Validación**: Valida archivos e inputs antes del envío
- ✅ **UX**: Estados de carga, mensajes de error/éxito

## 🔗 Dependencias

- `@api/vehiclesApi` - Métodos de API
- `@config/auth` - Configuración de autenticación
- `@utils/imageUtils` - Utilidades de imagen
- `@utils/logger` - Sistema de logging
- `@utils/measurePerformance` - Medición de performance

---

**Versión**: 1.0.0  
**Autor**: Indiana Usados  
**Fecha**: Diciembre 2024
