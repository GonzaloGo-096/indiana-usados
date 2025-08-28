/**
 * CarFormRHF - Formulario de autos con React Hook Form
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Restaurado con useImageReducer y lógica avanzada de imágenes
 */

import React, { useEffect, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useCarMutation } from '@hooks'
import { useImageReducer } from './useImageReducer'
import styles from './CarFormRHF.module.css'

// ✅ CONSTANTES
const MODE = {
    CREATE: 'create',
    EDIT: 'edit'
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
            marca: '',
            modelo: '',
            version: '',
            precio: '',
            caja: '',
            segmento: '',
            cilindrada: '',
            color: '',
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
        console.log('🔄 CarFormRHF useEffect:', { mode, initialData: !!initialData })
        
        if (mode === MODE.EDIT && initialData) {
            // ✅ DEBUG: Ver qué URLs se están pasando
            console.log('🔍 DEBUG - initialData.urls:', initialData.urls)
            console.log('🔍 DEBUG - initialData completo:', initialData)
            
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
            console.log('✅ Datos cargados para edición')
            
            // ✅ Sincronizar estado de imágenes desde initialData
            initImageState(mode, initialData)
        } else if (mode === MODE.CREATE) {
            // ✅ RESETEAR FORMULARIO EN MODO CREATE
            reset()
            console.log('✅ Formulario reseteado para crear')
            initImageState(mode, {})
        }
    }, [mode, initialData, setValue, reset, initImageState])

    // ✅ HOOK DE MUTACIÓN
    const { createCar, updateCar, deleteCar, isLoading: mutationLoading, error: mutationError, success, resetState } = useCarMutation()
    
    // ✅ MANEJADORES DE IMAGENES
    const handleFileChange = useCallback((key) => (event) => {
        const file = event.target.files && event.target.files[0] ? event.target.files[0] : null
        setFile(key, file)
    }, [setFile])

    const handleRemoveImage = useCallback((key) => () => {
        removeImage(key)
    }, [removeImage])

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
        
        console.log('🏗️ Construyendo FormData para modo:', mode)
        
        // ✅ AGREGAR CAMPOS DE DATOS PRIMITIVOS
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'precio' || key === 'cilindrada' || key === 'anio' || key === 'kilometraje') {
                // ✅ COERCIÓN NUMÉRICA
                const numValue = Number(value).toString()
                formData.append(key, numValue)
                console.log(`📊 ${key}: ${value} → ${numValue}`)
            } else {
                formData.append(key, value)
                console.log(`📝 ${key}: ${value}`)
            }
        })
        
        // ✅ AGREGAR IMÁGENES SEGÚN ESTADO
        buildImageFormData(formData)
        
        console.log('✅ FormData construido exitosamente')
        return formData
    }, [mode, buildImageFormData])

    // ✅ MANEJAR SUBMIT
    const onSubmit = async (data) => {
        console.log('🚀 CarFormRHF onSubmit:', { mode, data: Object.keys(data) })
        
        try {
            clearErrors()
            resetState()
            
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
            
            // ✅ ENVIAR FORMULARIO SEGÚN MODO
            let result
            
            if (mode === MODE.CREATE) {
                result = await createCar(formData)
            } else if (mode === MODE.EDIT) {
                // ✅ USAR updateCar CON EL ID DEL VEHÍCULO
                const vehicleId = initialData._id || initialData.id
                result = await updateCar(vehicleId, formData)
            }
            
            if (result && result.success) {
                // ✅ ÉXITO: RESETEAR FORMULARIO Y CERRAR MODAL
                reset()
                resetImages()
                if (onClose) {
                    onClose()
                }
            } else {
                // ✅ ERROR: Mostrar error del hook
                console.error('❌ Error del hook:', result?.error)
            }
            
        } catch (error) {
            console.error('❌ Error en submit:', error)
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
                {mutationError && (
                    <div className={styles.errorMessage}>
                        ❌ Error: {mutationError}
                    </div>
                )}
                
                {success && (
                    <div className={styles.successMessage}>
                        ✅ Auto {mode === MODE.CREATE ? 'creado' : 'actualizado'} exitosamente
                    </div>
                )}
            </div>

            {/* ✅ SECCIÓN DE IMÁGENES */}
            <div className={styles.imageSection}>
                <h3>Imágenes del Vehículo</h3>
                
                {/* ✅ INFORMACIÓN SOBRE FORMATOS ACEPTADOS */}
                <div className={styles.formatInfo}>
                    <p><strong>Formatos aceptados:</strong> Solo archivos .jpg, .jpeg y .png</p>
                    <p><strong>Tamaño máximo:</strong> 10MB por imagen</p>
                    <p><strong>Todas las imágenes son obligatorias</strong></p>
                </div>
                
                <div className={styles.imageGrid}>
                    {useMemo(() => {
                        const fields = Object.keys(imageState)
                        return fields.map(field => (
                            <div key={field} className={styles.imageField}>
                                <label className={styles.imageLabel}>
                                    {field.replace(/([A-Z])/g, ' $1').trim()}
                                    {errors[field] && <span className={styles.error}>*</span>}
                                </label>
                                
                                {/* ✅ PREVIEW DE IMAGEN: file → URL.createObjectURL, si no existingUrl, oculto si remove */}
                                {(() => {
                                    const preview = getPreviewFor(field)
                                    if (!preview) return null
                                    
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
                                                    <small>Imagen existente</small>
                                                )}
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
                                            <span className={styles.removedLabel}>
                                                Imagen marcada para quitar
                                            </span>
                                        )}
                                    </div>
                                )}
                                
                                {errors[field] && (
                                    <span className={styles.error}>{errors[field].message}</span>
                                )}
                            </div>
                        ))
                    }, [imageState, errors, mode, getPreviewFor, handleFileChange, handleRemoveImage])}
                </div>
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
                    disabled={mutationLoading}
                >
                    {mutationLoading ? (
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
