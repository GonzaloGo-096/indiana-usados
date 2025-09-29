/**
 * CarFormRHF - Formulario de autos con React Hook Form
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Restaurado con useImageReducer y lógica avanzada de imágenes
 */

import React, { useEffect, useCallback, useMemo } from 'react'
import { logger } from '@utils/logger'
import { useForm } from 'react-hook-form'
import { useImageReducer, IMAGE_FIELDS } from './useImageReducer'
import styles from './CarFormRHF.module.css'

// ✅ CONSTANTES
const MODE = {
    CREATE: 'create',
    EDIT: 'edit'
}

// ✅ CAMPOS NUMÉRICOS (para coerción automática)
const NUMERIC_FIELDS = ['precio', 'cilindrada', 'anio', 'kilometraje']

// (endpoints removidos: las mutaciones ahora las gestiona el padre)

// ✅ VALIDACIONES
const VALIDATION_RULES = {
    MIN_EXTRA_PHOTOS: 5,
    TOTAL_MIN_PHOTOS: 7,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png']
}

// ✅ PROPS DEL COMPONENTE
const CarFormRHF = ({ 
    mode, 
    initialData = {}, 
    onSubmitFormData,
    isLoading = false,
    onClose
}) => {
    // ✅ HOOK PERSONALIZADO PARA MANEJO DE IMÁGENES
    const {
        imageState,
        initImageState,
        setFile,
        removeImage,
        restoreImage,
        resetImages,
        validateImages,
        buildImageFormData,
        getPreviewFor,
        cleanupObjectUrls,
        // ✅ NUEVAS FUNCIONES PARA FOTOS EXTRAS
        setMultipleExtras,      // Para input múltiple
        removeExistingExtra,    // Para eliminar foto existente
        restoreExistingExtra    // Para restaurar foto existente
    } = useImageReducer(mode, initialData)

    // ✅ DEBUG: Verificar estado inicial
    console.log('🔍 CarFormRHF - Estado inicial del imageState:', {
        mode,
        hasFotosExtra: !!imageState.fotosExtra,
        fotosExtraLength: imageState.fotosExtra?.length || 0,
        hasExistingExtras: !!imageState.existingExtras,
        existingExtrasLength: imageState.existingExtras?.length || 0,
        allKeys: Object.keys(imageState)
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
        reset,
        watch
    } = useForm({
        defaultValues: {
            // ✅ DATOS BÁSICOS (exactamente como espera el backend)
            marca: '',
            modelo: '',
            version: '',
            precio: '',
            caja: '',
            segmento: '',
            cilindrada: '',
            color: '',
            // ✅ DATOS TÉCNICOS (exactamente como espera el backend)
            anio: '',
            combustible: '',
            transmision: '',
            kilometraje: '',
            traccion: '',
            tapizado: '',
            categoriaVehiculo: '',
            frenos: '',
            turbo: '',
            llantas: '',
            HP: '',
            detalle: ''
        }
    })

    // ✅ CARGAR DATOS INICIALES (campos básicos) y sincronizar imágenes
    useEffect(() => {
        if (mode === MODE.EDIT && initialData) {
            // ✅ CARGAR DATOS BÁSICOS
            const basicFields = [
                'marca', 'modelo', 'version', 'precio', 'caja', 'segmento',
                'cilindrada', 'color', 'anio', 'combustible', 'transmision',
                'kilometraje', 'traccion', 'tapizado', 'categoriaVehiculo',
                'frenos', 'turbo', 'llantas', 'HP', 'detalle'
            ]
            
            basicFields.forEach(field => {
                if (initialData[field] !== undefined) {
                    setValue(field, initialData[field])
                }
            })
            
            // ✅ Sincronizar estado de imágenes desde initialData
            initImageState(mode, initialData)
        } else if (mode === MODE.CREATE) {
            // ✅ RESETEAR FORMULARIO EN MODO CREATE
            reset()
            initImageState(mode, {})
        }
    }, [mode, initialData, setValue, reset, initImageState])

    // ✅ MANEJADORES DE IMAGENES
    const handleFileChange = useCallback((key) => (event) => {
        const file = event.target.files && event.target.files[0] ? event.target.files[0] : null
        setFile(key, file)
        
        // ✅ RESETEAR INPUT PARA PERMITIR SELECCIONAR EL MISMO ARCHIVO
        event.target.value = ''
    }, [setFile])

    const handleRemoveImage = useCallback((key) => () => {
        removeImage(key)
    }, [removeImage])

    // ✅ NUEVO: Manejador para input múltiple de fotos extras
    const handleMultipleExtrasChange = useCallback((event) => {
        const files = event.target.files
        console.log('🔍 handleMultipleExtrasChange - Triggered:', {
            filesLength: files?.length || 0,
            files: files ? Array.from(files).map(f => ({ name: f.name, size: f.size })) : []
        })
        
        if (files && files.length > 0) {
            console.log(`📁 Llamando setMultipleExtras con ${files.length} archivos`)
            setMultipleExtras(files)
            console.log(`✅ setMultipleExtras llamado exitosamente`)
        } else {
            console.warn('⚠️ No se seleccionaron archivos o files es null')
        }
        
        // Resetear input para permitir seleccionar los mismos archivos si es necesario
        event.target.value = ''
    }, [setMultipleExtras])

    // ✅ NUEVOS: Manejadores para fotos existentes
    const handleRemoveExistingExtra = useCallback((index) => () => {
        removeExistingExtra(index)
    }, [removeExistingExtra])

    const handleRestoreExistingExtra = useCallback((index) => () => {
        restoreExistingExtra(index)
    }, [restoreExistingExtra])

    // ✅ VALIDACIÓN CONDICIONAL POR MODO
    const validateForm = useCallback((data) => {
        const errors = {}
        
        // ✅ VALIDAR CAMPOS REQUERIDOS
        const requiredFields = [
            'marca', 'modelo', 'version', 'precio', 'caja', 'segmento',
            'cilindrada', 'color', 'anio', 'combustible', 'transmision',
            'kilometraje', 'traccion', 'tapizado', 'categoriaVehiculo',
            'frenos', 'turbo', 'llantas', 'HP', 'detalle'
        ]
        
        requiredFields.forEach(field => {
            const value = data[field]
            
            if (field === 'precio' || field === 'cilindrada' || field === 'anio' || field === 'kilometraje') {
                // ✅ VALIDAR NÚMEROS
                const numValue = Number(value)
                if (!value || isNaN(numValue)) {
                    errors[field] = `${field} es requerido y debe ser un número`
                }
            } else {
                // ✅ VALIDAR STRINGS
                if (!value || value.trim() === '') {
                    errors[field] = `${field} es requerido`
                }
            }
        })
        
        // ✅ VALIDAR IMÁGENES SEGÚN MODO
        const imageErrors = validateImages(mode)
        Object.assign(errors, imageErrors)
        return errors
    }, [mode, validateImages])

    // ✅ CONSTRUIR FORMDATA SEGÚN MODO
    const buildVehicleFormData = useCallback((data) => {
        const formData = new FormData()
        
        
        // ✅ AGREGAR CAMPOS DE DATOS PRIMITIVOS
        Object.entries(data).forEach(([key, value]) => {
            if (NUMERIC_FIELDS.includes(key)) {
                // ✅ COERCIÓN NUMÉRICA
                const numValue = Number(value).toString()
                formData.append(key, numValue)
            } else {
                formData.append(key, value)
            }
        })
        
        
        // ✅ AGREGAR IMÁGENES SEGÚN ESTADO
        buildImageFormData(formData)
        
        return formData
    }, [mode, buildImageFormData])

    // ✅ MANEJAR SUBMIT
    const onSubmit = async (data) => {
        
        try {
            clearErrors()

            // ✅ VALIDAR FORMULARIO
            const validationErrors = validateForm(data)

            if (Object.keys(validationErrors).length > 0) {
                logger.warn('form:car', 'Errores de validación', Object.keys(validationErrors))

                // ✅ MOSTRAR ERRORES
                Object.entries(validationErrors).forEach(([field, message]) => {
                    setError(field, { type: 'manual', message })
                })
                return
            }

            // ✅ CONSTRUIR FORMDATA
            const formData = buildVehicleFormData(data)

            // ✅ AÑADIR _id EN MODO EDIT (algunos backends lo esperan en body)
            if (mode === MODE.EDIT) {
                const vehicleId = initialData._id || initialData.id
                if (vehicleId) {
                    formData.append('_id', String(vehicleId))
                }
            }

            // ✅ DELEGAR SUBMIT AL PADRE
            await onSubmitFormData(formData)

            // El padre maneja éxito/error, cierre de modal y refetch
        } catch (error) {
            logger.error('form:car', 'submit error', error)
        }
    }

    // ✅ LIMPIAR OBJETOS URL AL DESMONTAJE
    useEffect(() => {
        return () => {
            cleanupObjectUrls()
        }
    }, [cleanupObjectUrls])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formHeader}>
                <h2>{mode === MODE.CREATE ? 'Crear Nuevo Auto' : 'Editar Auto'}</h2>
                <p>Complete todos los campos requeridos</p>
                
                {/* ✅ MENSAJES DE ESTADO */}
                {/* Los mensajes de error/éxito ahora los muestra el contenedor (Dashboard) */}
            </div>

            {/* ✅ SECCIÓN DE IMÁGENES PRINCIPALES - ESTILO MODERNIZADO */}
            <div className={styles.imageSection}>
                <h3>Imágenes Principales</h3>
                
                {/* ✅ INFORMACIÓN SOBRE FORMATOS ACEPTADOS */}
                <div className={styles.formatInfo}>
                    <p><strong>Formatos aceptados:</strong> Solo archivos .jpg, .jpeg y .png</p>
                    <p><strong>Tamaño máximo:</strong> 10MB por imagen</p>
                    {mode === MODE.CREATE ? (
                        <>
                            <p><strong>Las 2 imágenes principales son obligatorias</strong></p>
                            <p><strong>Total mínimo requerido:</strong> 7 fotos (2 principales + 5 extras)</p>
                        </>
                    ) : (
                        <>
                            <p><strong>Modo edición:</strong> Las imágenes son opcionales</p>
                            <p><strong>Puedes editar solo texto sin tocar las imágenes</strong></p>
                        </>
                    )}
                </div>

                {/* ✅ GRID DE IMÁGENES PRINCIPALES CON ESTILO MODERNO */}
                <div className={styles.principalPhotosGrid}>
                    {IMAGE_FIELDS.principales.map((field, index) => {
                        const preview = getPreviewFor(field)
                        const isRemoved = imageState[field]?.remove
                        const fieldTitle = field === 'fotoPrincipal' ? 'Foto Principal' : 'Foto Hover'
                        
                        return (
                            <div key={field} className={styles.principalPhotoCard}>
                                <div className={styles.principalPhotoHeader}>
                                    <h5>{fieldTitle}</h5>
                                    {errors[field] && <span className={styles.error}>* Requerida</span>}
                                </div>

                                {/* ✅ PREVIEW DE IMAGEN CON MISMO ESTILO QUE EXTRAS */}
                                {isRemoved ? (
                                    // Foto marcada para eliminar
                                    <div className={styles.removedPhotoPlaceholder}>
                                        <div className={styles.removedIcon}>🗑️</div>
                                        <span className={styles.removedText}>Marcada para eliminar</span>
                                        <button
                                            type="button"
                                            onClick={() => restoreImage(field)}
                                            className={styles.restoreButton}
                                        >
                                            ↺ Restaurar
                                        </button>
                                    </div>
                                ) : preview ? (
                                    // Foto normal (existente o nueva)
                                    <>
                                        <img 
                                            src={preview} 
                                            alt={`${fieldTitle}`}
                                            className={styles.principalPhotoImg}
                                        />
                                        <div className={styles.principalPhotoInfo}>
                                            {imageState[field]?.file ? (
                                                <small>Nueva imagen seleccionada</small>
                                            ) : (
                                                <div>
                                                    <small>Imagen existente</small>
                                                    {imageState[field]?.publicId && (
                                                        <small className={styles.publicIdInfo}>
                                                            ID: {imageState[field].publicId.slice(-8)}
                                                        </small>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    // Sin imagen - placeholder
                                    <div className={styles.emptyPhotoPlaceholder}>
                                        <div className={styles.emptyIcon}>📷</div>
                                        <span className={styles.emptyText}>Sin imagen</span>
                                        <small className={styles.emptyHint}>
                                            {mode === MODE.CREATE ? 'Requerida' : 'Opcional'}
                                        </small>
                                    </div>
                                )}

                                {/* ✅ INPUT DE ARCHIVO OCULTO */}
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange(field)}
                                    className={styles.hiddenFileInput}
                                    id={`input-${field}`}
                                />

                                {/* ✅ BOTONES DE ACCIÓN CON MISMO ESTILO QUE EXTRAS */}
                                <div className={styles.principalPhotoActions}>
                                    {!isRemoved && (
                                        <label
                                            htmlFor={`input-${field}`}
                                            className={styles.selectButton}
                                        >
                                            📁 {preview ? 'Cambiar foto' : 'Seleccionar foto'}
                                        </label>
                                    )}
                                    
                                    {mode === MODE.EDIT && preview && !isRemoved && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage(field)}
                                            className={styles.removeButton}
                                            title="Eliminar esta foto"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    )}
                                </div>

                                {/* ✅ ERROR ESPECÍFICO DEL CAMPO */}
                                {errors[field] && (
                                    <div className={styles.fieldError}>
                                        {errors[field].message}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ✅ SECCIÓN DE FOTOS EXTRAS - NUEVA ESTRUCTURA */}
            <div className={styles.imageSection}>
                <h3>Fotos Extras</h3>
                
                {/* ✅ INFORMACIÓN SOBRE FOTOS EXTRAS */}
                <div className={styles.formatInfo}>
                    {mode === MODE.CREATE ? (
                        <>
                            <p><strong>Mínimo requerido:</strong> 5 fotos extras</p>
                            <p><strong>Máximo:</strong> 8 fotos extras</p>
                            <p><strong>Input múltiple:</strong> Selecciona varios archivos de una vez</p>
                        </>
                    ) : (
                        <>
                            <p><strong>Fotos existentes:</strong> Puedes eliminar las que ya no necesites</p>
                            <p><strong>Agregar nuevas:</strong> Usa el input múltiple para subir hasta 8 fotos nuevas</p>
                            <p><strong>Opcional:</strong> Todos los cambios de fotos son opcionales</p>
                        </>
                    )}
                </div>
                
                {/* ✅ FOTOS EXISTENTES (Solo en modo EDIT) */}
                {mode === MODE.EDIT && imageState.existingExtras && imageState.existingExtras.length > 0 && (
                    <div className={styles.existingPhotosSection}>
                        <h4>Fotos Existentes</h4>
                        <div className={styles.existingPhotosGrid}>
                            {imageState.existingExtras.map((photo, index) => (
                                <div key={index} className={styles.existingPhotoCard}>
                                    {photo.remove ? (
                                        // Foto marcada para eliminar
                                        <div className={styles.removedPhotoPlaceholder}>
                                                    <div className={styles.removedIcon}>🗑️</div>
                                            <span className={styles.removedText}>Marcada para eliminar</span>
                                            <button
                                                type="button"
                                                onClick={handleRestoreExistingExtra(index)}
                                                className={styles.restoreButton}
                                            >
                                                ↺ Restaurar
                                            </button>
                                        </div>
                                    ) : (
                                        // Foto normal
                                        <>
                                            <img 
                                                src={photo.url} 
                                                alt={`Foto existente ${index + 1}`}
                                                className={styles.existingPhotoImg}
                                            />
                                            <div className={styles.existingPhotoActions}>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveExistingExtra(index)}
                                                    className={styles.removeButton}
                                                    title="Eliminar esta foto"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                                {photo.publicId && (
                                                    <small className={styles.publicIdInfo}>
                                                        ID: {photo.publicId.slice(-8)}
                                                    </small>
                                                )}
                                            </div>
                                        </>
                                        )}
                                </div>
                            ))}
                        </div>
                                    </div>
                                )}
                                
                {/* ✅ INPUT MÚLTIPLE PARA AGREGAR FOTOS */}
                <div className={styles.multipleInputSection}>
                    <h4>{mode === MODE.CREATE ? 'Seleccionar Fotos Extras' : 'Agregar Fotos Nuevas'}</h4>
                    
                    <div className={styles.multipleInputContainer}>
                        <label className={styles.multipleInputLabel}>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                multiple
                                onChange={handleMultipleExtrasChange}
                                className={styles.multipleFileInput}
                            />
                            <div className={styles.multipleInputUI}>
                                <span className={styles.multipleInputIcon}>📁</span>
                                <span className={styles.multipleInputText}>
                                    {mode === MODE.CREATE 
                                        ? 'Seleccionar 5-8 fotos extras'
                                        : 'Seleccionar fotos para agregar'
                                    }
                                </span>
                                <small className={styles.multipleInputHint}>
                                    Puedes seleccionar varios archivos a la vez
                                </small>
                            </div>
                        </label>
                    </div>

                    {/* ✅ DEBUG: Logging del estado */}
                    {console.log('🔍 CarFormRHF - imageState.fotosExtra:', imageState.fotosExtra)}
                    
                    {/* ✅ PREVIEW DE ARCHIVOS SELECCIONADOS */}
                    {imageState.fotosExtra && imageState.fotosExtra.length > 0 && (
                        <div className={styles.newPhotosPreview}>
                            <h5>Fotos seleccionadas ({imageState.fotosExtra.length})</h5>
                            <div className={styles.newPhotosGrid}>
                                {imageState.fotosExtra.map((file, index) => (
                                    <div key={index} className={styles.newPhotoCard}>
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            alt={`Nueva foto ${index + 1}`}
                                            className={styles.newPhotoImg}
                                        />
                                        <div className={styles.newPhotoInfo}>
                                            <small>{file.name}</small>
                                            <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* ✅ ERROR GENERAL DE FOTOS EXTRAS */}
                {errors.fotosExtra && (
                    <div className={styles.errorMessage}>
                        ❌ {errors.fotosExtra}
                    </div>
                )}
            </div>

            {/* ✅ SECCIÓN DE DATOS BÁSICOS */}
            <div className={styles.dataSection}>
                <h3>Datos del Vehículo</h3>
                
                <div className={styles.formGrid}>
                    {/* ✅ MARCA Y MODELO */}
                    <div className={styles.formGroup}>
                        <label>Marca *</label>
                        <input
                            type="text"
                            {...register('marca', { required: 'Marca es requerida' })}
                            className={styles.input}
                        />
                        {errors.marca && <span className={styles.error}>{errors.marca.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Modelo *</label>
                        <input
                            type="text"
                            {...register('modelo', { required: 'Modelo es requerido' })}
                            className={styles.input}
                        />
                        {errors.modelo && <span className={styles.error}>{errors.modelo.message}</span>}
                    </div>

                    {/* ✅ VERSIÓN Y PRECIO */}
                    <div className={styles.formGroup}>
                        <label>Versión *</label>
                        <input
                            type="text"
                            {...register('version', { required: 'Versión es requerida' })}
                            className={styles.input}
                        />
                        {errors.version && <span className={styles.error}>{errors.version.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Precio *</label>
                        <input
                            type="number"
                            {...register('precio', { required: 'Precio es requerido' })}
                            className={styles.input}
                            placeholder="0"
                        />
                        {errors.precio && <span className={styles.error}>{errors.precio.message}</span>}
                    </div>

                    {/* ✅ CAJA Y SEGMENTO */}
                    <div className={styles.formGroup}>
                        <label>Caja *</label>
                        <input
                            type="text"
                            {...register('caja', { required: 'Caja es requerida' })}
                            className={styles.input}
                        />
                        {errors.caja && <span className={styles.error}>{errors.caja.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Segmento *</label>
                        <input
                            type="text"
                            {...register('segmento', { required: 'Segmento es requerido' })}
                            className={styles.input}
                        />
                        {errors.segmento && <span className={styles.error}>{errors.segmento.message}</span>}
                    </div>

                    {/* ✅ CILINDRADA Y COLOR */}
                    <div className={styles.formGroup}>
                        <label>Cilindrada *</label>
                        <input
                            type="number"
                            {...register('cilindrada', { required: 'Cilindrada es requerida' })}
                            className={styles.input}
                            placeholder="0"
                        />
                        {errors.cilindrada && <span className={styles.error}>{errors.cilindrada.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Color *</label>
                        <input
                            type="text"
                            {...register('color', { required: 'Color es requerido' })}
                            className={styles.input}
                        />
                        {errors.color && <span className={styles.error}>{errors.color.message}</span>}
                    </div>

                    {/* ✅ AÑO Y COMBUSTIBLE */}
                    <div className={styles.formGroup}>
                        <label>Año *</label>
                        <input
                            type="number"
                            {...register('anio', { required: 'Año es requerido' })}
                            className={styles.input}
                            placeholder="2024"
                        />
                        {errors.anio && <span className={styles.error}>{errors.anio.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Combustible *</label>
                        <input
                            type="text"
                            {...register('combustible', { required: 'Combustible es requerido' })}
                            className={styles.input}
                        />
                        {errors.combustible && <span className={styles.error}>{errors.combustible.message}</span>}
                    </div>

                    {/* ✅ TRANSMISIÓN Y KILOMETRAJE */}
                    <div className={styles.formGroup}>
                        <label>Transmisión *</label>
                        <input
                            type="text"
                            {...register('transmision', { required: 'Transmisión es requerida' })}
                            className={styles.input}
                        />
                        {errors.transmision && <span className={styles.error}>{errors.transmision.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Kilometraje *</label>
                        <input
                            type="number"
                            {...register('kilometraje', { required: 'Kilometraje es requerido' })}
                            className={styles.input}
                            placeholder="0"
                        />
                        {errors.kilometraje && <span className={styles.error}>{errors.kilometraje.message}</span>}
                    </div>

                    {/* ✅ TRACCIÓN Y TAPIZADO */}
                    <div className={styles.formGroup}>
                        <label>Tracción *</label>
                        <input
                            type="text"
                            {...register('traccion', { required: 'Tracción es requerida' })}
                            className={styles.input}
                        />
                        {errors.traccion && <span className={styles.error}>{errors.traccion.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Tapizado *</label>
                        <input
                            type="text"
                            {...register('tapizado', { required: 'Tapizado es requerido' })}
                            className={styles.input}
                        />
                        {errors.tapizado && <span className={styles.error}>{errors.tapizado.message}</span>}
                    </div>

                    {/* ✅ CATEGORÍA Y FRENOS */}
                    <div className={styles.formGroup}>
                        <label>Categoría Vehículo *</label>
                        <input
                            type="text"
                            {...register('categoriaVehiculo', { required: 'Categoría es requerida' })}
                            className={styles.input}
                        />
                        {errors.categoriaVehiculo && <span className={styles.error}>{errors.categoriaVehiculo.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Frenos *</label>
                        <input
                            type="text"
                            {...register('frenos', { required: 'Frenos es requerido' })}
                            className={styles.input}
                        />
                        {errors.frenos && <span className={styles.error}>{errors.frenos.message}</span>}
                    </div>

                    {/* ✅ TURBO Y LLANTAS */}
                    <div className={styles.formGroup}>
                        <label>Turbo *</label>
                        <input
                            type="text"
                            {...register('turbo', { required: 'Turbo es requerido' })}
                            className={styles.input}
                        />
                        {errors.turbo && <span className={styles.error}>{errors.turbo.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Llantas *</label>
                        <input
                            type="text"
                            {...register('llantas', { required: 'Llantas es requerido' })}
                            className={styles.input}
                        />
                        {errors.llantas && <span className={styles.error}>{errors.llantas.message}</span>}
                    </div>

                    {/* ✅ HP Y DETALLE */}
                    <div className={styles.formGroup}>
                        <label>HP *</label>
                        <input
                            type="text"
                            {...register('HP', { required: 'HP es requerido' })}
                            className={styles.input}
                        />
                        {errors.HP && <span className={styles.error}>{errors.HP.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Detalle *</label>
                        <textarea
                            {...register('detalle', { required: 'Detalle es requerido' })}
                            className={styles.textarea}
                            rows="3"
                        />
                        {errors.detalle && <span className={styles.error}>{errors.detalle.message}</span>}
                    </div>
                </div>
            </div>

            {/* ✅ BOTONES DE ACCIÓN */}
            <div className={styles.formActions}>
                <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span>
                            <span className={styles.loadingSpinner}></span>
                            {mode === MODE.CREATE ? 'Creando auto...' : 'Guardando cambios...'}
                        </span>
                    ) : (
                        mode === MODE.CREATE ? 'Crear Auto' : 'Actualizar Auto'
                    )}
                </button>
                
                {/* ✅ MENSAJE DE PROGRESO PARA OPERACIONES CON IMÁGENES */}
                {isLoading && (
                    <div className={styles.uploadProgress}>
                        <p>⏳ Las imágenes pueden tardar un momento en subirse...</p>
                        <small>Por favor no cierres esta ventana</small>
                    </div>
                )}
            </div>
        </form>
    )
}

export default CarFormRHF
