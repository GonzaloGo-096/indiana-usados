# 📋 SISTEMA DE EDICIÓN DE VEHÍCULOS - DOCUMENTACIÓN COMPLETA

## 🎯 **RESUMEN EJECUTIVO**

El sistema de edición de vehículos permite a los administradores modificar la información y fotografías de vehículos existentes. Utiliza un formulario complejo con manejo de imágenes, validaciones y comunicación con el backend a través de APIs REST.

---

## 🏗️ **ARQUITECTURA GENERAL**

### **Flujo Principal:**
1. **Usuario** → Hace clic en "Editar" en el Dashboard
2. **Dashboard** → Abre modal con formulario de edición
3. **Formulario** → Carga datos existentes y permite modificaciones
4. **Validación** → Verifica campos requeridos y formato de imágenes
5. **Envío** → Construye FormData y envía al backend
6. **Backend** → Procesa actualización y retorna resultado
7. **UI** → Actualiza interfaz y cierra modal

---

## 📁 **ARCHIVOS INVOLUCRADOS**

### **1. COMPONENTES PRINCIPALES**

#### **`src/pages/admin/Dashboard/Dashboard.jsx`**
- **Responsabilidad**: Contenedor principal del panel de administración
- **Funciones clave**:
  - Renderiza lista de vehículos
  - Maneja apertura/cierre del modal de edición
  - Coordina el flujo de datos entre componentes
  - Procesa respuestas del backend

#### **`src/features/cars/ui/CarFormRHF.jsx`**
- **Responsabilidad**: Formulario principal de creación/edición
- **Funciones clave**:
  - Maneja inputs de texto y datos básicos
  - Integra sistema de imágenes
  - Validaciones de formulario
  - Construcción de FormData para envío

### **2. HOOKS Y LÓGICA DE NEGOCIO**

#### **`src/hooks/useCarMutation.js`**
- **Responsabilidad**: Mutaciones de vehículos (CRUD)
- **Funciones clave**:
  - `updateCar()`: Actualiza vehículo existente
  - Manejo de autenticación (tokens)
  - Procesamiento de errores del backend
  - Estados de carga y éxito

#### **`src/features/cars/ui/useImageReducer.js`**
- **Responsabilidad**: Manejo complejo de imágenes
- **Funciones clave**:
  - Estado de imágenes (existentes, nuevas, eliminadas)
  - Validaciones de formato y cantidad
  - Construcción de FormData para imágenes
  - Previews y manejo de archivos

#### **`src/features/cars/ui/useCarModal.reducer.js`**
- **Responsabilidad**: Estado del modal de edición
- **Funciones clave**:
  - Abrir/cerrar modal
  - Cambiar entre modos (crear/editar)
  - Manejo de estados de carga y error

### **3. SERVICIOS Y API**

#### **`src/services/vehiclesApi.js`**
- **Responsabilidad**: Comunicación con backend
- **Funciones clave**:
  - `updateVehicle()`: Endpoint PUT para actualización
  - Manejo de headers multipart/form-data
  - Procesamiento de respuestas y errores

#### **`src/hooks/vehicles/useVehicleDetail.js`**
- **Responsabilidad**: Obtención de datos de vehículo
- **Funciones clave**:
  - Fetch de datos por ID
  - Cache con React Query
  - Validación de datos recibidos

### **4. MAPEADORES Y UTILIDADES**

#### **`src/features/cars/mappers/normalizeForForm.js`**
- **Responsabilidad**: Normalización de datos del backend
- **Funciones clave**:
  - `normalizeDetailToFormInitialData()`: Convierte datos del backend a formato del formulario
  - `unwrapDetail()`: Extrae datos de envoltorios de respuesta
  - `normalizeImage()`: Normaliza objetos de imagen

#### **`src/mappers/vehicleMapper.js`**
- **Responsabilidad**: Mapeo general de vehículos
- **Funciones clave**:
  - `mapApiVehicleToModel()`: Normaliza vehículos del backend
  - Validación de campos requeridos
  - Formateo de precios y metadatos

---

## 🔄 **FLUJO DETALLADO DE EDICIÓN**

### **FASE 1: INICIALIZACIÓN**

1. **Usuario hace clic en "Editar"**
   ```javascript
   // Dashboard.jsx
   const handleEditVehicle = (vehicle) => {
     dispatch(openEditForm(vehicle))
   }
   ```

2. **Reducer actualiza estado del modal**
   ```javascript
   // useCarModal.reducer.js
   case ACTIONS.OPEN_EDIT_FORM:
     return {
       ...state,
       isOpen: true,
       mode: 'edit',
       initialData: action.payload, // datos del vehículo
       loading: false,
       error: null
     }
   ```

3. **Dashboard renderiza modal con formulario**
   ```javascript
   // Dashboard.jsx
   <CarFormRHF
     mode="edit"
     initialData={normalizedData}
     onSubmitFormData={handleSubmitEdit}
     onClose={handleCloseModal}
   />
   ```

### **FASE 2: CARGA DE DATOS**

4. **Formulario inicializa con datos existentes**
   ```javascript
   // CarFormRHF.jsx
   useEffect(() => {
     if (mode === MODE.EDIT && initialData) {
       // Cargar campos básicos
       basicFields.forEach(field => {
         if (initialData[field] !== undefined) {
           setValue(field, initialData[field])
         }
       })
       
       // Sincronizar estado de imágenes
       initImageState(mode, initialData)
     }
   }, [mode, initialData])
   ```

5. **Normalización de datos del backend**
   ```javascript
   // normalizeForForm.js
   export const normalizeDetailToFormInitialData = (rawDetail) => {
     const d = unwrapDetail(rawDetail) || {}
     
     // Mapear campos básicos
     return {
       _id: d._id || d.id || '',
       marca: d.marca || d.brand || '',
       modelo: d.modelo || d.model || '',
       // ... más campos
       urls: {
         fotoPrincipal: normalizeImage(d.fotoPrincipal),
         fotoHover: normalizeImage(d.fotoHover),
         fotoExtra1: normalizeImage(extrasArr[0]),
         // ... hasta fotoExtra8
       }
     }
   }
   ```

### **FASE 3: INTERACCIÓN DEL USUARIO**

6. **Usuario modifica campos de texto**
   ```javascript
   // CarFormRHF.jsx - React Hook Form maneja automáticamente
   <input
     type="text"
     {...register('marca', { required: 'Marca es requerida' })}
     className={styles.input}
   />
   ```

7. **Usuario maneja imágenes**
   ```javascript
   // useImageReducer.js
   const handleFileChange = useCallback((key) => (event) => {
     const file = event.target.files && event.target.files[0]
     setFile(key, file) // Actualiza estado: { file: newFile, remove: false }
   }, [setFile])
   
   const handleRemoveImage = useCallback((key) => () => {
     removeImage(key) // Marca como: { remove: true }
   }, [removeImage])
   ```

### **FASE 4: VALIDACIÓN**

8. **Validación de campos básicos**
   ```javascript
   // CarFormRHF.jsx
   const validateForm = useCallback((data) => {
     const errors = {}
     
     // Validar campos requeridos
     requiredFields.forEach(field => {
       const value = data[field]
       if (field === 'precio' || field === 'cilindrada') {
         const numValue = Number(value)
         if (!value || isNaN(numValue)) {
           errors[field] = `${field} es requerido y debe ser un número`
         }
       } else {
         if (!value || value.trim() === '') {
           errors[field] = `${field} es requerido`
         }
       }
     })
     
     return errors
   }, [])
   ```

9. **Validación de imágenes (modo EDIT)**
   ```javascript
   // useImageReducer.js
   const validateImages = useCallback((mode) => {
     const errors = {}
     
     if (mode === 'edit') {
       // ✅ EDIT: NO VALIDAR NADA DE IMÁGENES - TODO OPCIONAL
       console.log('✅ Modo EDIT: Sin validaciones de imágenes - todo opcional')
     }
     
     return errors
   }, [imageState])
   ```

### **FASE 5: CONSTRUCCIÓN DE FORMDATA**

10. **Construcción de FormData básico**
    ```javascript
    // CarFormRHF.jsx
    const buildVehicleFormData = useCallback((data) => {
      const formData = new FormData()
      
      // Agregar campos de datos primitivos
      Object.entries(data).forEach(([key, value]) => {
        if (NUMERIC_FIELDS.includes(key)) {
          const numValue = Number(value).toString()
          formData.append(key, numValue)
        } else {
          formData.append(key, value)
        }
      })
      
      // Agregar imágenes según estado
      buildImageFormData(formData)
      
      return formData
    }, [buildImageFormData])
    ```

11. **Construcción de FormData de imágenes**
    ```javascript
    // useImageReducer.js
    const buildImageFormData = useCallback((formData) => {
      const publicIdsToDelete = []
      
      // 1. FOTOS PRINCIPALES
      IMAGE_FIELDS.principales.forEach(key => {
        const { file, remove, publicId, existingUrl } = imageState[key] || {}
        
        if (file) {
          // Enviar archivo nuevo
          formData.append(key, file)
        } else {
          // No enviar nada - mantener imagen existente
        }
        
        // Recolectar para eliminación
        if (remove && publicId && existingUrl) {
          publicIdsToDelete.push(publicId)
        }
      })
      
      // 2. FOTOS EXTRAS
      const extraFiles = []
      IMAGE_FIELDS.extras.forEach(key => {
        const { file, remove, publicId, existingUrl } = imageState[key] || {}
        
        if (remove && publicId && existingUrl) {
          publicIdsToDelete.push(publicId)
        }
        
        if (file && !remove) {
          extraFiles.push(file)
        }
      })
      
      // Enviar fotos extras solo si hay archivos nuevos
      if (extraFiles.length > 0) {
        extraFiles.forEach(file => {
          formData.append('fotosExtra', file)
        })
      }
      
      // Enviar eliminadas
      formData.append('eliminadas', JSON.stringify(publicIdsToDelete))
      
      return formData
    }, [imageState])
    ```

### **FASE 6: ENVÍO AL BACKEND**

12. **Llamada a la mutación**
    ```javascript
    // CarFormRHF.jsx
    const onSubmit = async (data) => {
      try {
        // Validar formulario
        const validationErrors = validateForm(data)
        if (Object.keys(validationErrors).length > 0) {
          // Mostrar errores
          return
        }
        
        // Construir FormData
        const formData = buildVehicleFormData(data)
        
        // Agregar ID en modo EDIT
        if (mode === MODE.EDIT) {
          const vehicleId = initialData._id || initialData.id
          if (vehicleId) {
            formData.append('_id', String(vehicleId))
          }
        }
        
        // Delegar submit al padre
        await onSubmitFormData(formData)
        
      } catch (error) {
        logger.error('form:car', 'submit error', error)
      }
    }
    ```

13. **Procesamiento en useCarMutation**
    ```javascript
    // useCarMutation.js
    const updateCar = async (id, formData) => {
      setIsLoading(true)
      setError(null)
      setSuccess(false)
      
      try {
        // Obtener token de autorización
        const token = getAuthToken()
        if (!token) {
          throw new Error('❌ No se encontró token de autorización')
        }
        
        // Validar archivos de imagen si existen
        const imageFiles = {}
        const dataFields = {}
        
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            if (imageFiles[key]) {
              imageFiles[key].push(value)
            } else {
              imageFiles[key] = [value]
            }
          } else {
            dataFields[key] = value
          }
        }
        
        // Validar solo formato de archivos (no cantidad en modo edit)
        if (Object.keys(imageFiles).length > 0) {
          const imageErrors = validateImageFields(imageFiles, 'edit')
          if (Object.keys(imageErrors).length > 0) {
            throw new Error(`Errores de imagen: ${Object.values(imageErrors).join(', ')}`)
          }
        }
        
        // Enviar al backend
        const response = await vehiclesService.updateVehicle(id, formData)
        
        setSuccess(true)
        return { success: true, data: response.data }
        
      } catch (err) {
        // Manejo de errores detallado
        let errorMessage = 'Error desconocido al actualizar el auto'
        
        if (err.response?.status === 401) {
          errorMessage = '🔐 Error de autorización: Token inválido o expirado'
        } else if (err.response?.status === 403) {
          errorMessage = '🚫 Error de permisos: No tienes acceso a este recurso'
        } else if (err.response?.status === 404) {
          errorMessage = '❌ Vehículo no encontrado o endpoint incorrecto'
        } else if (err.response?.status === 400) {
          if (err.response.data?.message) {
            errorMessage = `❌ Error de validación: ${err.response.data.message}`
          }
        }
        
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    }
    ```

14. **Llamada al servicio**
    ```javascript
    // vehiclesApi.js
    async updateVehicle(id, formData) {
      try {
        console.log(`🔄 Actualizando vehículo ${id} con PUT /photos/updatephoto/${id}`)
        const response = await authAxiosInstance.put(`/photos/updatephoto/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log(`✅ Vehículo actualizado exitosamente - Status: ${response.status}`)
        return response.data
      } catch (error) {
        const status = error.response?.status || 'Sin respuesta'
        console.error(`❌ Error al actualizar vehículo - Status: ${status}`, error.message)
        throw error
      }
    }
    ```

### **FASE 7: RESPUESTA Y ACTUALIZACIÓN**

15. **Procesamiento de respuesta**
    ```javascript
    // Dashboard.jsx
    const handleSubmitEdit = async (formData) => {
      dispatch(setLoading())
      
      try {
        const vehicleId = carModalState.initialData._id || carModalState.initialData.id
        const result = await updateCar(vehicleId, formData)
        
        if (result.success) {
          // Refrescar datos
          refetchVehicles()
          
          // Cerrar modal
          dispatch(closeModal())
          
          // Mostrar mensaje de éxito
          console.log('✅ Vehículo actualizado exitosamente')
        } else {
          dispatch(setError(result.error))
        }
      } catch (error) {
        dispatch(setError('Error inesperado al actualizar el vehículo'))
      }
    }
    ```

---

## 🖼️ **MANEJO DE IMÁGENES DETALLADO**

### **Estructura de Estado de Imágenes**

```javascript
// useImageReducer.js
const imageState = {
  fotoPrincipal: {
    existingUrl: 'https://...',  // URL de imagen existente
    publicId: 'abc123',         // ID de Cloudinary
    originalName: 'car.jpg',    // Nombre original
    file: null,                 // Archivo nuevo seleccionado
    remove: false               // Marcado para eliminar
  },
  fotoHover: { /* misma estructura */ },
  fotoExtra1: { /* misma estructura */ },
  // ... hasta fotoExtra8
}
```

### **Estados Posibles de una Imagen**

1. **Imagen existente sin cambios**
   ```javascript
   {
     existingUrl: 'https://...',
     publicId: 'abc123',
     file: null,
     remove: false
   }
   ```

2. **Imagen nueva seleccionada**
   ```javascript
   {
     existingUrl: 'https://...',
     publicId: 'abc123',
     file: File(...),
     remove: false
   }
   ```

3. **Imagen marcada para eliminar**
   ```javascript
   {
     existingUrl: 'https://...',
     publicId: 'abc123',
     file: null,
     remove: true
   }
   ```

### **Lógica de Envío de Imágenes**

```javascript
// useImageReducer.js - buildImageFormData
const buildImageFormData = useCallback((formData) => {
  const publicIdsToDelete = []
  
  // FOTOS PRINCIPALES
  IMAGE_FIELDS.principales.forEach(key => {
    const { file, remove, publicId, existingUrl } = imageState[key] || {}
    
    if (file) {
      // ✅ ENVIAR ARCHIVO NUEVO
      formData.append(key, file)
      console.log(`📁 ${key} - archivo nuevo enviado`)
    } else {
      // ✅ NO ENVIAR NADA - mantener imagen existente
      console.log(`📷 ${key} - mantener imagen existente`)
    }
    
    // ✅ RECOLECTAR PARA ELIMINACIÓN
    if (remove && publicId && existingUrl) {
      publicIdsToDelete.push(publicId)
      console.log(`🗑️ ${key} marcada para eliminar`)
    }
  })
  
  // FOTOS EXTRAS
  const extraFiles = []
  IMAGE_FIELDS.extras.forEach(key => {
    const { file, remove, publicId, existingUrl } = imageState[key] || {}
    
    // Recolectar para eliminación
    if (remove && publicId && existingUrl) {
      publicIdsToDelete.push(publicId)
    }
    
    // Recolectar archivos nuevos
    if (file && !remove) {
      extraFiles.push(file)
    }
  })
  
  // ✅ ENVIAR FOTOS EXTRAS - Solo si hay archivos nuevos
  if (extraFiles.length > 0) {
    extraFiles.forEach(file => {
      formData.append('fotosExtra', file)
    })
    console.log(`📁 fotosExtra - enviando ${extraFiles.length} archivos`)
  } else {
    // ✅ NO ENVIAR NADA si no hay archivos nuevos
    console.log('📷 fotosExtra - sin archivos nuevos (NO enviar)')
  }
  
  // ✅ ENVIAR ELIMINADAS - Siempre como array JSON
  formData.append('eliminadas', JSON.stringify(publicIdsToDelete))
  
  return formData
}, [imageState])
```

---

## 📊 **ESTRUCTURA DE DATOS**

### **FormData Enviado al Backend**

```javascript
// Cuando NO hay cambios en imágenes:
FormData {
  // Datos básicos
  marca: "Toyota",
  modelo: "Corolla",
  precio: "30000",
  // ... otros campos
  
  // Imágenes - NO se envían campos si no hay cambios
  eliminadas: "[]"  // Array vacío
}

// Cuando SÍ hay cambios en imágenes:
FormData {
  // Datos básicos
  marca: "Toyota",
  modelo: "Corolla",
  
  // Imágenes nuevas
  fotoPrincipal: File(...),     // Solo si hay archivo nuevo
  fotoHover: File(...),         // Solo si hay archivo nuevo
  fotosExtra: [File(...)],      // Solo si hay archivos nuevos
  
  // Eliminaciones
  eliminadas: "[\"abc123\", \"def456\"]"  // Array de public_ids
}
```

### **Datos del Backend Normalizados**

```javascript
// normalizeForForm.js
const normalizedData = {
  _id: "64f8a1b2c3d4e5f6g7h8i9j0",
  marca: "Toyota",
  modelo: "Corolla",
  precio: 30000,
  // ... campos básicos
  
  urls: {
    fotoPrincipal: {
      url: "https://res.cloudinary.com/.../principal.jpg",
      public_id: "indiana/principal_abc123",
      original_name: "car_principal.jpg"
    },
    fotoHover: {
      url: "https://res.cloudinary.com/.../hover.jpg",
      public_id: "indiana/hover_def456",
      original_name: "car_hover.jpg"
    },
    fotoExtra1: {
      url: "https://res.cloudinary.com/.../extra1.jpg",
      public_id: "indiana/extra1_ghi789",
      original_name: "car_extra1.jpg"
    },
    // ... hasta fotoExtra8
  }
}
```

---

## ⚠️ **VALIDACIONES Y ERRORES**

### **Validaciones del Frontend**

1. **Campos requeridos**
   ```javascript
   const requiredFields = [
     'marca', 'modelo', 'version', 'precio', 'caja', 'segmento',
     'cilindrada', 'color', 'anio', 'combustible', 'transmision',
     'kilometraje', 'traccion', 'tapizado', 'categoriaVehiculo',
     'frenos', 'turbo', 'llantas', 'HP', 'detalle'
   ]
   ```

2. **Validaciones numéricas**
   ```javascript
   const NUMERIC_FIELDS = ['precio', 'cilindrada', 'anio', 'kilometraje']
   
   if (NUMERIC_FIELDS.includes(field)) {
     const numValue = Number(value)
     if (!value || isNaN(numValue)) {
       errors[field] = `${field} es requerido y debe ser un número`
     }
   }
   ```

3. **Validaciones de imagen (solo formato)**
   ```javascript
   const validateImageFields = (imageFiles, mode) => {
     const errors = {}
     
     Object.entries(imageFiles).forEach(([key, files]) => {
       files.forEach(file => {
         // Validar tipo
         if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
           errors[key] = 'Solo se permiten archivos JPG y PNG'
         }
         
         // Validar tamaño (10MB máximo)
         if (file.size > 10 * 1024 * 1024) {
           errors[key] = 'El archivo no puede superar los 10MB'
         }
       })
     })
     
     return errors
   }
   ```

### **Manejo de Errores del Backend**

```javascript
// useCarMutation.js
const errorMessages = {
  401: '🔐 Error de autorización: Token inválido o expirado',
  403: '🚫 Error de permisos: No tienes acceso a este recurso',
  404: '❌ Vehículo no encontrado o endpoint incorrecto',
  400: '❌ Error de validación: Datos enviados no son válidos',
  500: '🔥 Error interno del servidor'
}

if (err.response?.status === 400) {
  if (err.response.data?.message) {
    errorMessage = `❌ Error de validación: ${err.response.data.message}`
  } else if (err.response.data?.error) {
    errorMessage = `❌ Error del backend: ${err.response.data.error}`
  }
}
```

---

## 🔧 **CONFIGURACIÓN Y ENDPOINTS**

### **Endpoints del Backend**

```javascript
// vehiclesApi.js
const ENDPOINTS = {
  GET_VEHICLES: '/photos/getallphotos',
  GET_VEHICLE_BY_ID: '/photos/getonephoto/:id',
  CREATE_VEHICLE: '/photos/create',
  UPDATE_VEHICLE: '/photos/updatephoto/:id',    // ← Endpoint de edición
  DELETE_VEHICLE: '/photos/deletephoto/:id'
}
```

### **Headers Requeridos**

```javascript
// Para operaciones de edición (requiere autenticación)
const headers = {
  'Content-Type': 'multipart/form-data',
  'Authorization': `Bearer ${token}`
}
```

### **Configuración de Axios**

```javascript
// api/axiosInstance.js
export const authAxiosInstance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 30000, // 30 segundos para operaciones con archivos
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// Interceptor para agregar token automáticamente
authAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 🎨 **INTERFAZ DE USUARIO**

### **Estados del Modal**

```javascript
// useCarModal.reducer.js
const modalStates = {
  CLOSED: { isOpen: false, mode: 'create', initialData: null },
  LOADING: { isOpen: true, loading: true, error: null },
  EDIT: { isOpen: true, mode: 'edit', initialData: vehicleData },
  ERROR: { isOpen: true, loading: false, error: 'Mensaje de error' }
}
```

### **Componentes de Imagen**

```javascript
// CarFormRHF.jsx - Preview de imagen
{(() => {
  const preview = getPreviewFor(field)
  const isRemoved = imageState[field]?.remove
  
  if (isRemoved) {
    return (
      <div className={styles.removedPlaceholder}>
        <div className={styles.removedIcon}>🗑️</div>
        <span>Foto eliminada</span>
        <small>Se eliminará al guardar</small>
      </div>
    )
  }
  
  if (preview) {
    return (
      <div className={styles.imagePreview}>
        <img src={preview} alt={`${field} preview`} />
        <div className={styles.previewInfo}>
          {imageState[field]?.file ? (
            <small>Nueva imagen seleccionada</small>
          ) : (
            <small>Imagen existente</small>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className={styles.emptyPlaceholder}>
      <span>Sin imagen</span>
    </div>
  )
})()}
```

---

## 🚀 **OPTIMIZACIONES Y RENDIMIENTO**

### **React Query Cache**

```javascript
// useVehicleDetail.js
const queryConfig = {
  queryKey: ['vehicle-detail', id],
  queryFn: () => vehiclesApi.getVehicleById(id),
  staleTime: 1000 * 60 * 10,    // 10 minutos
  gcTime: 1000 * 60 * 60,       // 1 hora
  retry: 3,                      // 3 reintentos
  refetchOnWindowFocus: false    // No refetch automático
}
```

### **Lazy Loading de Imágenes**

```javascript
// useImageOptimization.js
export const useMainImage = (auto) => {
  return useMemo(() => {
    if (!auto || typeof auto !== 'object') {
      return getMainImage(null)
    }
    return getMainImage(auto)
  }, [auto])
}
```

### **Cleanup de Object URLs**

```javascript
// useImageReducer.js
const cleanupObjectUrls = useCallback(() => {
  ALL_IMAGE_FIELDS.forEach(key => {
    const { file } = imageState[key] || {}
    if (file) {
      try {
        URL.revokeObjectURL(URL.createObjectURL(file))
      } catch (_) {
        // Ignorar errores de limpieza
      }
    }
  })
}, [imageState])

// Cleanup automático al desmontar
useEffect(() => {
  return () => {
    cleanupObjectUrls()
  }
}, [cleanupObjectUrls])
```

---

## 🐛 **DEBUGGING Y LOGS**

### **Logs del Formulario**

```javascript
// CarFormRHF.jsx
console.log('🔍 ===== FORMDATA COMPLETO ENVIADO AL BACKEND =====')
for (let [key, value] of formData.entries()) {
  if (value instanceof File) {
    console.log(`📁 ${key}:`, {
      name: value.name,
      size: value.size,
      type: value.type
    })
  } else {
    console.log(`📝 ${key}:`, value)
  }
}
```

### **Logs de Imágenes**

```javascript
// useImageReducer.js
console.log('🔍 ===== DEBUG IMAGE STATE =====')
ALL_IMAGE_FIELDS.forEach(key => {
  const state = imageState[key] || {}
  console.log(`🔍 ${key}:`, {
    hasFile: !!state.file,
    hasExistingUrl: !!state.existingUrl,
    hasPublicId: !!state.publicId,
    remove: state.remove,
    willBeDeleted: state.remove && state.publicId && state.existingUrl
  })
})
```

### **Logs del Backend**

```javascript
// vehiclesApi.js
console.log(`🔄 Actualizando vehículo ${id} con PUT /photos/updatephoto/${id}`)
console.log(`✅ Vehículo actualizado exitosamente - Status: ${response.status}`)
console.error(`❌ Error al actualizar vehículo - Status: ${status}`, error.message)
```

---

## 📝 **CASOS DE USO COMUNES**

### **1. Editar Solo Datos de Texto**

```javascript
// Usuario modifica solo precio y descripción
const changes = {
  precio: "35000",        // Cambio
  detalle: "Nueva descripción", // Cambio
  // Imágenes: sin cambios
}

// FormData resultante:
FormData {
  precio: "35000",
  detalle: "Nueva descripción",
  // NO se envían campos de imagen
  eliminadas: "[]"
}
```

### **2. Agregar Nuevas Imágenes**

```javascript
// Usuario selecciona nuevas fotos
const imageChanges = {
  fotoPrincipal: new File(...),  // Nueva imagen
  fotoExtra1: new File(...),     // Nueva imagen
  // Otras imágenes: sin cambios
}

// FormData resultante:
FormData {
  fotoPrincipal: File(...),
  fotosExtra: [File(...)],
  eliminadas: "[]"
}
```

### **3. Eliminar Imágenes Existentes**

```javascript
// Usuario marca fotos para eliminar
const imageState = {
  fotoExtra1: { remove: true, publicId: "abc123" },
  fotoExtra2: { remove: true, publicId: "def456" }
}

// FormData resultante:
FormData {
  eliminadas: "[\"abc123\", \"def456\"]"
}
```

### **4. Combinación de Cambios**

```javascript
// Usuario hace múltiples cambios
const changes = {
  // Datos básicos
  precio: "40000",
  
  // Imágenes nuevas
  fotoPrincipal: new File(...),
  fotoExtra1: new File(...),
  
  // Imágenes a eliminar
  fotoExtra3: { remove: true, publicId: "ghi789" }
}

// FormData resultante:
FormData {
  precio: "40000",
  fotoPrincipal: File(...),
  fotosExtra: [File(...)],
  eliminadas: "[\"ghi789\"]"
}
```

---

## 🔒 **SEGURIDAD Y AUTENTICACIÓN**

### **Token de Autenticación**

```javascript
// useCarMutation.js
const getAuthToken = () => {
  try {
    const token = localStorage.getItem('auth_token')
    return token
  } catch (error) {
    logger.error('cars:mutation', 'Error al obtener token', error)
    return null
  }
}

// Validación antes de envío
if (!token) {
  throw new Error('❌ No se encontró token de autorización')
}
```

### **Headers de Seguridad**

```javascript
// authAxiosInstance interceptor
authAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 📈 **MÉTRICAS Y MONITOREO**

### **Logs de Performance**

```javascript
// imageTiming.js
export const trackImageLoad = (imageUrl, startTime) => {
  const loadTime = performance.now() - startTime
  logger.log('images:performance', `Image loaded in ${loadTime}ms`, { imageUrl })
}
```

### **Estados de Carga**

```javascript
// Dashboard.jsx
const loadingStates = {
  isLoading: carModalState.loading,
  isSubmitting: updateCarMutation.isLoading,
  isRefreshing: vehiclesQuery.isFetching
}
```

---

## 🎯 **CONCLUSIONES**

### **Fortalezas del Sistema**

1. **✅ Separación clara de responsabilidades**
2. **✅ Manejo robusto de imágenes**
3. **✅ Validaciones completas**
4. **✅ Estados de carga y error bien manejados**
5. **✅ Optimizaciones de performance**
6. **✅ Logging detallado para debugging**

### **Áreas de Mejora**

1. **🔄 Posible implementación de archivos vacíos para estructura completa**
2. **🔄 Mejoras en el manejo de errores del backend**
3. **🔄 Optimizaciones adicionales de cache**
4. **🔄 Implementación de undo/redo para cambios**

### **Archivos Críticos**

- **`CarFormRHF.jsx`**: Formulario principal
- **`useImageReducer.js`**: Lógica de imágenes
- **`useCarMutation.js`**: Mutaciones al backend
- **`vehiclesApi.js`**: Comunicación con API
- **`normalizeForForm.js`**: Normalización de datos

---

*Documento generado automáticamente - Sistema de Edición de Vehículos v1.0*
