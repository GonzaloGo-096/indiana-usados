/**
 * CarFormRHF - Formulario de autos con React Hook Form
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Restaurado con useImageReducer y lógica avanzada de imágenes
 */

import React, { useEffect, useCallback } from 'react'
import { logger } from '@utils/logger'
import { useForm } from 'react-hook-form'
import { useImageReducer, IMAGE_FIELDS } from '@components/admin/hooks/useImageReducer'
import styles from './CarFormRHF.module.css'
import { FORM_RULES } from '@constants/forms'
import { isValidWebp, isUnderMaxSize, filterValidFiles } from '@utils/files'

// ✅ CONSTANTES
const MODE = {
    CREATE: 'create',
    EDIT: 'edit'
}

// ✅ CAMPOS NUMÉRICOS (para coerción automática)
const NUMERIC_FIELDS = ['precio', 'cilindrada', 'anio', 'kilometraje']

// ✅ VALIDACIONES centralizadas en FORM_RULES

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
    logger.debug('carform:init', 'Estado inicial del imageState', {
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

    // ✅ INICIALIZAR FORMULARIO CON DATOS INICIALES
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            const formData = { ...initialData }
            delete formData.urls // Los URLs se manejan por separado
            
            reset(formData)
            initImageState(mode, initialData)
        }
    }, [initialData, mode, reset, initImageState])

    // ✅ VALIDAR FORMULARIO COMPLETO
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
            if (!data[field] || data[field].toString().trim() === '') {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} es requerido`
            }
        })
        
        // ✅ VALIDAR NÚMEROS
        NUMERIC_FIELDS.forEach(field => {
            if (data[field] && isNaN(Number(data[field]))) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} debe ser un número válido`
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
    }, [buildImageFormData])

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
                <p>Complete los campos requeridos</p>
            </div>

            {/* ✅ SECCIÓN DE IMÁGENES PRINCIPALES - ESTILO MODERNIZADO */}
            <div className={styles.imageSection}>
                <h3>Imágenes Principales</h3>
                
                {/* ✅ INFORMACIÓN SOBRE FORMATOS ACEPTADOS */}
                <div className={styles.formatInfo}>
                    <p><strong>Formatos aceptados:</strong> Solo archivos .webp</p>
                    <p><strong>Tamaño máximo:</strong> 10MB por imagen</p>
                    {mode === MODE.CREATE ? (
                        <>
                            <p><strong>Las 2 imágenes principales son obligatorias</strong></p>
                            <p><strong>Total mínimo requerido:</strong> 7 fotos (2 principales + 5 extras)</p>
                        </>
                    ) : (
                        <>
                            <p><strong>Imágenes existentes:</strong> Puedes reemplazarlas o mantenerlas</p>
                            <p><strong>Opcional:</strong> Los cambios de imágenes son opcionales</p>
                        </>
                    )}
                </div>
                
                {/* ✅ GRID DE IMÁGENES PRINCIPALES */}
                <div className={styles.principalImagesGrid}>
                    {IMAGE_FIELDS.principales.map(field => {
                        const { file, existingUrl, remove } = imageState[field] || {}
                        const preview = getPreviewFor(field)
                        
                        return (
                            <div key={field} className={styles.imageCard}>
                                <label className={styles.imageLabel}>
                                    {field === 'fotoPrincipal' ? 'Foto Principal *' : 'Foto Hover *'}
                                </label>
                                
                                <div className={styles.imageContainer}>
                                    {preview ? (
                                        <img 
                                            src={preview} 
                                            alt={`Preview ${field}`}
                                            className={styles.previewImage}
                                        />
                                    ) : (
                                        <div className={styles.placeholder}>
                                            <span>📷</span>
                                            <p>Seleccionar imagen</p>
                                        </div>
                                    )}
                                    
                                    {remove && (
                                        <div className={styles.removedOverlay}>
                                            <span>🗑️ Eliminada</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className={styles.imageActions}>
                                    <input
                                        type="file"
                                        accept=".webp"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                const isValidType = isValidWebp(file)
                                                const isValidSize = isUnderMaxSize(file, FORM_RULES.MAX_FILE_SIZE)
                                                if (!isValidType) {
                                                    setError(field, { type: 'manual', message: 'Formato inválido. Solo .webp' })
                                                    return
                                                }
                                                if (!isValidSize) {
                                                    setError(field, { type: 'manual', message: 'La imagen supera 10MB' })
                                                    return
                                                }
                                                clearErrors(field)
                                                setFile(field, file)
                                            }
                                        }}
                                        className={styles.fileInput}
                                        id={`${field}-input`}
                                    />
                                    <label htmlFor={`${field}-input`} className={styles.fileButton}>
                                        {file ? 'Cambiar' : 'Seleccionar'}
                                    </label>
                                    
                                    {existingUrl && !file && (
                                        <button
                                            type="button"
                                            onClick={() => removeImage(field)}
                                            className={styles.removeButton}
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                    
                                    {remove && (
                                        <button
                                            type="button"
                                            onClick={() => restoreImage(field)}
                                            className={styles.restoreButton}
                                        >
                                            Restaurar
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
                            <p><strong>Opcional:</strong> Los cambios de fotos son opcionales</p>
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
                                                onClick={() => restoreExistingExtra(index)}
                                                className={styles.restoreButton}
                                            >
                                                ↺ Restaurar
                                            </button>
                                        </div>
                                    ) : (
                                        // Photo normal
                                        <>
                                            <img 
                                                src={photo.url} 
                                                alt={`Foto existente ${index + 1}`}
                                                className={styles.existingPhotoImg}
                                            />
                                            <div className={styles.existingPhotoActions}>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingExtra(index)}
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
                                accept=".webp"
                                multiple
                                onChange={(e) => {
                                    const files = e.target.files
                                    if (files && files.length > 0) {
                                        const validFiles = filterValidFiles(files, {
                                            maxBytes: FORM_RULES.MAX_FILE_SIZE,
                                            acceptWebpOnly: true
                                        })
                                        if (validFiles.length !== files.length) {
                                            setError('fotosExtra', { type: 'manual', message: 'Algunas fotos fueron descartadas (no .webp o >10MB)' })
                                        } else {
                                            clearErrors('fotosExtra')
                                        }
                                        setMultipleExtras(validFiles)
                                    }
                                }}
                                className={styles.multipleFileInput}
                            />
                            <div className={styles.multipleInputUI}>
                                <span className={styles.multipleInputIcon}>📁</span>
                                <span className={styles.multipleInputText}>
                                    {imageState.fotosExtra?.length > 0 
                                        ? `${imageState.fotosExtra.length} archivo(s) seleccionado(s)`
                                        : 'Seleccionar múltiples archivos'
                                    }
                                </span>
                            </div>
                        </label>
                    </div>
                    
                    {/* ✅ PREVIEW DE ARCHIVOS NUEVOS */}
                    {imageState.fotosExtra && imageState.fotosExtra.length > 0 && (
                        <div className={styles.newFilesPreview}>
                            <h5>Archivos Nuevos:</h5>
                            <div className={styles.newFilesGrid}>
                                {imageState.fotosExtra.map((file, index) => (
                                    <div key={index} className={styles.newFileCard}>
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            alt={`Nuevo archivo ${index + 1}`}
                                            className={styles.newFileImg}
                                        />
                                        <div className={styles.newFileInfo}>
                                            <span className={styles.newFileName}>{file.name}</span>
                                            <span className={styles.newFileSize}>
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* ✅ ERROR DE FOTOS EXTRAS */}
                {errors.fotosExtra && (
                    <div className={styles.fieldError}>
                        {errors.fotosExtra.message || errors.fotosExtra}
                    </div>
                )}
            </div>

            {/* ✅ SECCIÓN DE DATOS DEL VEHÍCULO */}
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
                            type="number"
                            {...register('HP', { required: 'HP es requerido' })}
                            className={styles.input}
                            placeholder="0"
                        />
                        {errors.HP && <span className={styles.error}>{errors.HP.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Detalle *</label>
                        <textarea
                            {...register('detalle', { required: 'Detalle es requerido' })}
                            className={styles.textarea}
                            rows="4"
                            placeholder="Descripción detallada del vehículo..."
                        />
                        {errors.detalle && <span className={styles.error}>{errors.detalle.message}</span>}
                    </div>
                </div>
            </div>

            {/* ✅ BOTONES DE ACCIÓN */}
            <div className={styles.actionButtons}>
                <button
                    type="button"
                    onClick={onClose}
                    className={styles.cancelButton}
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Procesando...' : (mode === MODE.CREATE ? 'Crear Auto' : 'Actualizar Auto')}
                </button>
            </div>
        </form>
    )
}

export default CarFormRHF
