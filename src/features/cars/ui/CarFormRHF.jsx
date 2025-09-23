/**
 * CarFormRHF - Formulario de autos con React Hook Form
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Restaurado con useImageReducer y lógica avanzada de imágenes
 */

import React, { useEffect, useCallback, useMemo } from 'react'
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
        restoreImage, // ✅ NUEVA FUNCIÓN IMPORTADA
        resetImages,
        validateImages,
        buildImageFormData,
        getPreviewFor,
        cleanupObjectUrls
    } = useImageReducer(mode, initialData)

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
        console.log('[Form] init', { mode, hasInitial: !!initialData, id: initialData?._id || initialData?.id })
        
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

    // ✅ VALIDACIÓN CONDICIONAL POR MODO
    const validateForm = useCallback((data) => {
        const errors = {}
        
        console.log('🔍 validateForm - mode:', mode, 'type:', typeof mode)
        console.log('🔍 validateForm - data keys:', Object.keys(data))
        
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
        console.log('🔍 Llamando validateImages con mode:', mode)
        console.log('🔍 validateImages - antes de llamar')
        const imageErrors = validateImages(mode)
        console.log('🔍 imageErrors recibidos:', imageErrors)
        console.log('🔍 imageErrors keys:', Object.keys(imageErrors))
        Object.assign(errors, imageErrors)
        
        console.log('🔍 Errores finales:', errors)
        console.log('🔍 Errores finales keys:', Object.keys(errors))
        return errors
    }, [mode, validateImages])

    // ✅ CONSTRUIR FORMDATA SEGÚN MODO
    const buildVehicleFormData = useCallback((data) => {
        const formData = new FormData()
        
        console.log('🏗️ Construyendo FormData para modo:', mode)
        
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
        
        console.log('📝 Campos agregados:', Object.keys(data).length, 'campos')
        
        // ✅ AGREGAR IMÁGENES SEGÚN ESTADO
        buildImageFormData(formData)
        
        return formData
    }, [mode, buildImageFormData])

    // ✅ MANEJAR SUBMIT
    const onSubmit = async (data) => {
        console.log('[Form] submit', { mode })
        
        try {
            clearErrors()

            // ✅ VALIDAR FORMULARIO
            const validationErrors = validateForm(data)

            if (Object.keys(validationErrors).length > 0) {
                console.log('❌ Errores de validación:', validationErrors)

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
            console.error('[Form] submit error', error)
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

            {/* ✅ SECCIÓN DE IMÁGENES PRINCIPALES */}
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
                
                <div className={styles.imageGrid}>
                    {useMemo(() => {
                        return IMAGE_FIELDS.principales.map(field => (
                            <div key={field} className={styles.imageField}>
                                <label className={styles.imageLabel}>
                                    {field === 'fotoPrincipal' ? 'Foto Principal' : 'Foto Hover'}
                                    {errors[field] && <span className={styles.error}>*</span>}
                                </label>
                                
                                {/* ✅ PREVIEW DE IMAGEN - SIEMPRE MOSTRAR CONTENEDOR */}
                                {(() => {
                                    const preview = getPreviewFor(field)
                                    const isRemoved = imageState[field]?.remove
                                    
                                    if (isRemoved) {
                                        // Estado "eliminado" - mostrar placeholder
                                        return (
                                            <div className={styles.imagePreview}>
                                                <div className={styles.removedPlaceholder}>
                                                    <div className={styles.removedIcon}>🗑️</div>
                                                    <span className={styles.removedText}>Foto eliminada</span>
                                                    <small className={styles.removedSubtext}>Se eliminará al guardar</small>
                                                </div>
                                            </div>
                                        )
                                    }
                                    
                                    if (preview) {
                                        // Mostrar imagen (existente o nueva)
                                        return (
                                            <div className={styles.imagePreview}>
                                                <img 
                                                    src={preview} 
                                                    alt={`${field} preview`}
                                                    className={styles.previewImage}
                                                />
                                                <div className={styles.previewInfo}>
                                                    {imageState[field]?.file ? (
                                                        <small>Nueva imagen seleccionada</small>
                                                    ) : (
                                                        <div>
                                                            <small>Imagen existente</small>
                                                            {imageState[field]?.publicId && (
                                                                <div className={styles.publicIdBadge}>
                                                                    📷 {imageState[field].publicId}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                    
                                    // Sin imagen - mostrar placeholder vacío
                                    return (
                                        <div className={styles.imagePreview}>
                                            <div className={styles.emptyPlaceholder}>
                                                <span>Sin imagen</span>
                                            </div>
                                        </div>
                                    )
                                })()}
                                
                                {/* ✅ INPUT DE ARCHIVO */}
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange(field)}
                                    className={styles.fileInput}
                                />
                                
                                {/* ✅ BOTONES DE ACCIÓN - SIEMPRE MOSTRAR */}
                                <div className={styles.imageActions}>
                                    {mode === MODE.EDIT && imageState[field]?.file && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage(field)}
                                            className={styles.removeButton}
                                        >
                                            🗑️ Quitar nueva imagen
                                        </button>
                                    )}
                                    
                                    {mode === MODE.EDIT && imageState[field]?.existingUrl && !imageState[field]?.remove && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage(field)}
                                            className={styles.removeButton}
                                        >
                                            🗑️ Eliminar imagen
                                        </button>
                                    )}
                                    
                                    {mode === MODE.EDIT && imageState[field]?.remove && (
                                        <span className={styles.removedLabel}>
                                            ❌ Imagen marcada para eliminar
                                        </span>
                                    )}
                                    
                                    {mode === MODE.CREATE && (
                                        <small className={styles.createHint}>
                                            Selecciona una imagen para subir
                                        </small>
                                    )}
                                </div>
                                
                                {errors[field] && (
                                    <span className={styles.error}>{errors[field].message}</span>
                                )}
                            </div>
                        ))
                    }, [imageState, errors, mode, getPreviewFor, handleFileChange, handleRemoveImage])}
                </div>
            </div>

            {/* ✅ SECCIÓN DE FOTOS EXTRAS */}
            <div className={styles.imageSection}>
                <h3>Fotos Extras</h3>
                
                {/* ✅ INFORMACIÓN SOBRE FOTOS EXTRAS */}
                <div className={styles.formatInfo}>
                    {mode === MODE.CREATE ? (
                        <>
                            <p><strong>Mínimo requerido:</strong> 5 fotos extras</p>
                            <p><strong>Máximo:</strong> 8 fotos extras</p>
                            <p><strong>Opcional:</strong> Las fotos marcadas con (opcional) no son obligatorias</p>
                        </>
                    ) : (
                        <>
                            <p><strong>Modo edición:</strong> Las fotos extras son opcionales</p>
                            <p><strong>Máximo:</strong> 8 fotos extras</p>
                            <p><strong>Puedes mantener las existentes sin cambios</strong></p>
                        </>
                    )}
                </div>
                
                <div className={styles.imageGrid}>
                    {useMemo(() => {
                        return IMAGE_FIELDS.extras.map((field, index) => (
                            <div key={field} className={styles.imageField}>
                                <label className={styles.imageLabel}>
                                    Foto Extra {index + 1}
                                    {index >= 5 && <span className={styles.optional}>(opcional)</span>}
                                    {errors[field] && <span className={styles.error}>*</span>}
                                </label>
                                
                                {/* ✅ PREVIEW DE IMAGEN - SIEMPRE MOSTRAR CONTENEDOR */}
                                {(() => {
                                    const preview = getPreviewFor(field)
                                    const isRemoved = imageState[field]?.remove
                                    
                                    if (isRemoved) {
                                        // Estado "eliminado" - mostrar placeholder
                                        return (
                                            <div className={styles.imagePreview}>
                                                <div className={styles.removedPlaceholder}>
                                                    <div className={styles.removedIcon}>🗑️</div>
                                                    <span className={styles.removedText}>Foto eliminada</span>
                                                    <small className={styles.removedSubtext}>Se eliminará al guardar</small>
                                                </div>
                                            </div>
                                        )
                                    }
                                    
                                    if (preview) {
                                        // Mostrar imagen (existente o nueva)
                                        return (
                                            <div className={styles.imagePreview}>
                                                <img 
                                                    src={preview} 
                                                    alt={`${field} preview`}
                                                    className={styles.previewImage}
                                                />
                                                <div className={styles.previewInfo}>
                                                    {imageState[field]?.file ? (
                                                        <small>Nueva imagen seleccionada</small>
                                                    ) : (
                                                        <div>
                                                            <small>Imagen existente</small>
                                                            {imageState[field]?.publicId && (
                                                                <div className={styles.publicIdBadge}>
                                                                    📷 {imageState[field].publicId}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                    
                                    // Sin imagen - mostrar placeholder vacío
                                    return (
                                        <div className={styles.imagePreview}>
                                            <div className={styles.emptyPlaceholder}>
                                                <span>Sin imagen</span>
                                            </div>
                                        </div>
                                    )
                                })()}
                                
                                {/* ✅ INPUT DE ARCHIVO */}
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange(field)}
                                    className={styles.fileInput}
                                />
                                
                                {/* ✅ BOTONES DE ACCIÓN PARA EDIT */}
                                {mode === MODE.EDIT && (
                                    <div className={styles.imageActions}>
                                        {imageState[field]?.file && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage(field)}
                                                className={styles.removeButton}
                                            >
                                                Quitar nueva imagen
                                            </button>
                                        )}
                                        {imageState[field]?.existingUrl && !imageState[field]?.remove && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage(field)}
                                                className={styles.removeButton}
                                            >
                                                Quitar imagen existente
                                            </button>
                                        )}
                                        {imageState[field]?.remove && (
                                            <div className={styles.removedActions}>
                                                <span className={styles.removedLabel}>
                                                    ❌ Marcada para eliminar
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => restoreImage(field)}
                                                    className={styles.restoreButton}
                                                >
                                                    ↺ Restaurar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {errors[field] && (
                                    <span className={styles.error}>{errors[field].message}</span>
                                )}
                            </div>
                        ))
                    }, [imageState, errors, mode, getPreviewFor, handleFileChange, handleRemoveImage, restoreImage])}
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
                        'Procesando...'
                    ) : (
                        mode === MODE.CREATE ? 'Crear Auto' : 'Actualizar Auto'
                    )}
                </button>
            </div>
        </form>
    )
}

export default CarFormRHF
