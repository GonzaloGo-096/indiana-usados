/**
 * CarFormRHF - Formulario de autos con React Hook Form
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Form with RHF and image validation
 */

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import styles from './CarFormRHF.module.css'

// ✅ CONSTANTES
const MODE = {
    CREATE: 'create',
    EDIT: 'edit'
}

// ✅ CAMPOS DE IMAGEN EXACTOS DEL BACKEND
const IMAGE_FIELDS = [
    'fotoFrontal',
    'fotoTrasera', 
    'fotoLateralIzquierda',
    'fotoLateralDerecha',
    'fotoInterior'
]

// ✅ VALIDACIÓN GRUPAL DE IMÁGENES
const validateImagesRequired = (mode, files, urls = {}) => {
    const errors = {}
    
    IMAGE_FIELDS.forEach(field => {
        const hasFile = files[field] && files[field].length > 0
        const hasUrl = urls[field] && urls[field].trim() !== ''
        
        if (mode === MODE.CREATE) {
            // ✅ CREATE: Cada slot debe tener archivo
            if (!hasFile) {
                errors[field] = `La ${field} es requerida`
            }
        } else {
            // ✅ EDIT: Cada slot debe tener archivo O URL existente
            if (!hasFile && !hasUrl) {
                errors[field] = `La ${field} debe tener una imagen existente o subir una nueva`
            }
        }
    })
    
    return errors
}

// ✅ PROPS DEL COMPONENTE
const CarFormRHF = ({ 
    mode, 
    initialData = {}, 
    onSubmitFormData,
    isLoading = false,
    onClose
}) => {
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

    // ✅ CARGAR DATOS INICIALES
    useEffect(() => {
        console.log('🔄 CarFormRHF useEffect:', { mode, initialData: !!initialData })
        
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
            console.log('✅ Datos cargados para edición')
        } else if (mode === MODE.CREATE) {
            // ✅ RESETEAR FORMULARIO EN MODO CREATE
            reset()
            console.log('✅ Formulario reseteado para crear')
        }
    }, [mode, initialData, setValue, reset])

    // ✅ MANEJAR SUBMIT
    const onSubmit = async (data) => {
        console.log('🚀 CarFormRHF onSubmit:', { mode, data: Object.keys(data) })
        
        try {
            clearErrors()
            
            // ✅ VALIDAR CAMPOS REQUERIDOS
            const requiredFields = [
                'marca', 'modelo', 'version', 'precio', 'caja', 'segmento',
                'cilindrada', 'color', 'anio', 'combustible', 'transmision',
                'kilometraje', 'traccion', 'tapizado', 'categoriaVehiculo',
                'frenos', 'turbo', 'llantas', 'HP', 'detalle'
            ]
            
            const fieldErrors = {}
            
            requiredFields.forEach(field => {
                const value = data[field]
                
                if (field === 'precio' || field === 'cilindrada' || field === 'anio' || field === 'kilometraje') {
                    // ✅ VALIDAR NÚMEROS
                    const numValue = Number(value)
                    if (!value || isNaN(numValue)) {
                        fieldErrors[field] = `${field} es requerido y debe ser un número`
                    }
                } else {
                    // ✅ VALIDAR STRINGS
                    if (!value || value.trim() === '') {
                        fieldErrors[field] = `${field} es requerido`
                    }
                }
            })
            
            // ✅ VALIDAR IMÁGENES
            const imageFiles = {}
            IMAGE_FIELDS.forEach(field => {
                const fileInput = document.querySelector(`input[name="${field}"]`)
                if (fileInput && fileInput.files.length > 0) {
                    imageFiles[field] = fileInput.files
                }
            })
            
            const imageUrls = initialData.urls || {}
            const imageErrors = validateImagesRequired(mode, imageFiles, imageUrls)
            
            // ✅ COMBINAR ERRORES
            const allErrors = { ...fieldErrors, ...imageErrors }
            
            if (Object.keys(allErrors).length > 0) {
                // ✅ MOSTRAR ERRORES
                Object.entries(allErrors).forEach(([field, message]) => {
                    setError(field, { type: 'manual', message })
                })
                return
            }
            
            // ✅ CONSTRUIR FORMDATA
            const formData = new FormData()
            
            // ✅ AGREGAR CAMPOS DE DATOS
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'precio' || key === 'cilindrada' || key === 'anio' || key === 'kilometraje') {
                    // ✅ COERCIÓN NUMÉRICA
                    formData.append(key, Number(value).toString())
                } else {
                    formData.append(key, value)
                }
            })
            
            // ✅ AGREGAR SOLO ARCHIVOS PRESENTES
            IMAGE_FIELDS.forEach(field => {
                if (imageFiles[field] && imageFiles[field].length > 0) {
                    formData.append(field, imageFiles[field][0])
                }
            })
            
            // ✅ ENVIAR FORMULARIO
            await onSubmitFormData(formData, mode, initialData._id)
            
            // ✅ RESETEAR FORMULARIO
            reset()
            
        } catch (error) {
            console.error('❌ Error en submit:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formHeader}>
                <h2>{mode === MODE.CREATE ? 'Crear Nuevo Auto' : 'Editar Auto'}</h2>
                <p>Complete todos los campos requeridos</p>
            </div>
            


            {/* ✅ SECCIÓN DE IMÁGENES */}
            <div className={styles.imageSection}>
                <h3>Imágenes del Vehículo</h3>
                <div className={styles.imageGrid}>
                    {IMAGE_FIELDS.map(field => (
                        <div key={field} className={styles.imageField}>
                            <label className={styles.imageLabel}>
                                {field.replace(/([A-Z])/g, ' $1').trim()}
                                {errors[field] && <span className={styles.error}>*</span>}
                            </label>
                            
                            {/* ✅ MOSTRAR IMAGEN EXISTENTE SI ESTÁ EN EDIT */}
                            {mode === MODE.EDIT && initialData.urls?.[field] && (
                                <div className={styles.existingImage}>
                                    <img 
                                        src={initialData.urls[field]} 
                                        alt={`${field} existente`}
                                        className={styles.previewImage}
                                    />
                                    <small>Imagen existente</small>
                                </div>
                            )}
                            
                            <input
                                type="file"
                                accept="image/*"
                                {...register(field)}
                                className={styles.fileInput}
                            />
                            
                            {errors[field] && (
                                <span className={styles.error}>{errors[field].message}</span>
                            )}
                        </div>
                    ))}
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
