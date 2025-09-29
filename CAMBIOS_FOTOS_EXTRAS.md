# 🔄 Cambios en Fotos Extras - Input Múltiple

## ✅ Cambios Realizados

### 1. **useImageReducer.js** - Restructuración completa
- **Separación de responsabilidades**:
  - `existingExtras[]`: Array para fotos que ya existen en el backend
  - `newExtras[]`: Array para archivos nuevos del input múltiple
- **Nuevas acciones**:
  - `SET_MULTIPLE_EXTRAS`: Agregar múltiples archivos de una vez
  - `REMOVE_EXISTING_EXTRA`: Marcar foto existente como eliminada
  - `RESTORE_EXISTING_EXTRA`: Restaurar foto existente eliminada
- **Mantiene compatibilidad**: El `buildImageFormData` sigue enviando `fotosExtra` al backend exactamente igual

### 2. **CarFormRHF.jsx** - Nueva interfaz
- **Formulario CREATE**:
  - Un solo input múltiple para seleccionar 5-8 fotos de una vez
  - Preview de archivos seleccionados con nombre y tamaño
- **Formulario EDIT**:
  - **Fotos existentes**: Grid de previsualizaciones con botón eliminar/restaurar
  - **Agregar nuevas**: Input múltiple separado para subir archivos adicionales
- **Elimina**: Los 8 inputs individuales obsoletos

### 3. **CarFormRHF.module.css** - Estilos nuevos
- Estilos para grid de fotos existentes
- Estilos para input múltiple con UI moderna (drag & drop visual)
- Preview de archivos nuevos seleccionados
- Estados visuales para fotos marcadas como eliminadas
- Responsive design para móvil

## 🎯 Beneficios

### **Mejor UX**:
- **CREATE**: Seleccionar múltiples fotos de una vez (más rápido)
- **EDIT**: Ver claramente fotos existentes vs. nuevas a subir

### **Separación clara**:
- **Lado izquierdo**: Fotos que ya existen (con eliminar/restaurar)
- **Lado derecho**: Input para agregar nuevas fotos

### **Mantiene compatibilidad**:
- El backend recibe exactamente los mismos datos que antes
- Los `public_id` de eliminadas se recopilan correctamente
- Validaciones mantienen mismos requisitos (5-8 fotos en CREATE)

## 📡 Envío al Backend (Sin Cambios)

```javascript
// Sigue enviando igual que antes:
formData.append('fotosExtra', file1)
formData.append('fotosExtra', file2)
// ...

// TODO: Implementar envío de eliminadas cuando backend esté listo
const publicIdsToDelete = ['id1', 'id2', ...]
```

## 🧪 Para Probar

1. **CREATE**: Abrir formulario, seleccionar 5+ fotos, enviar
2. **EDIT**: Abrir vehículo existente, ver fotos actuales, eliminar algunas, agregar nuevas
3. **Validaciones**: Probar con menos de 5 fotos, más de 8 fotos
4. **Responsive**: Probar en móvil

## 🔧 Próximos Pasos

1. **Probar funcionamiento** en ambos modos
2. **Ajustar estilos** si es necesario
3. **Implementar envío de eliminadas** cuando backend esté listo para recibirlas

---

**✅ Status**: Implementación completa  
**📝 Author**: Indiana Usados  
**📅 Date**: Diciembre 2024
