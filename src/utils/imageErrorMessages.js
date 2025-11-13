/**
 * imageErrorMessages.js - Mensajes de error mejorados para imágenes
 * 
 * Proporciona mensajes de error específicos y útiles para el usuario
 * con información detallada sobre archivos, formatos y tamaños.
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

/**
 * Formatea tamaño de archivo en MB con 2 decimales
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado (ej: "10.50 MB")
 */
export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 MB'
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

/**
 * Obtiene el tipo MIME o extensión del archivo
 * @param {File} file - Archivo a analizar
 * @returns {string} - Tipo detectado o 'desconocido'
 */
export const getFileType = (file) => {
    if (!file) return 'desconocido'
    
    // Intentar obtener tipo MIME primero
    if (file.type) return file.type
    
    // Si no hay tipo MIME, intentar obtener extensión del nombre
    if (file.name) {
        const extension = file.name.split('.').pop()?.toLowerCase()
        if (extension) {
            // Mapear extensiones comunes a tipos MIME
            const typeMap = {
                'webp': 'image/webp',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif'
            }
            return typeMap[extension] || extension
        }
    }
    
    return 'desconocido'
}

/**
 * Obtiene nombre del archivo de forma segura
 * @param {File} file - Archivo
 * @returns {string} - Nombre del archivo o 'el archivo'
 */
const getFileName = (file) => {
    return file?.name || 'el archivo'
}

/**
 * Mensaje de error para formato inválido
 * @param {File} file - Archivo inválido
 * @returns {string} - Mensaje de error específico
 */
export const getInvalidFormatMessage = (file) => {
    const fileName = getFileName(file)
    const fileType = getFileType(file)
    return `El archivo "${fileName}" no es válido. Formato detectado: ${fileType}. Solo se aceptan archivos .webp`
}

/**
 * Mensaje de error para tamaño excedido
 * @param {File} file - Archivo que excede el tamaño
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {string} - Mensaje de error específico
 */
export const getSizeExceededMessage = (file, maxSize) => {
    const fileName = getFileName(file)
    const fileSize = formatFileSize(file?.size)
    const maxSizeFormatted = formatFileSize(maxSize)
    return `El archivo "${fileName}" es demasiado grande: ${fileSize}. Tamaño máximo: ${maxSizeFormatted}`
}

/**
 * Analiza por qué un archivo es inválido
 * @param {File} file - Archivo a analizar
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {Array<string>} - Array de razones (formato, tamaño, etc.)
 */
const getInvalidReasons = (file, maxSize) => {
    const reasons = []
    
    if (!file) return reasons
    
    // Verificar formato
    const fileType = getFileType(file)
    const isWebp = fileType === 'image/webp' || file.name?.toLowerCase().endsWith('.webp')
    if (!isWebp) {
        reasons.push('formato no .webp')
    }
    
    // Verificar tamaño
    if (file.size > maxSize) {
        reasons.push('tamaño >10MB')
    }
    
    return reasons
}

/**
 * Mensaje de error para archivos descartados en input múltiple
 * @param {FileList|Array<File>} allFiles - Todos los archivos seleccionados
 * @param {Array<File>} validFiles - Archivos válidos (filtrados)
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {string|null} - Mensaje de error o null si no hay archivos descartados
 */
export const getDiscardedFilesMessage = (allFiles, validFiles, maxSize = 10 * 1024 * 1024) => {
    const allFilesArray = Array.from(allFiles || [])
    const validFilesArray = Array.from(validFiles || [])
    
    // Encontrar archivos inválidos
    const invalidFiles = allFilesArray.filter(file => 
        !validFilesArray.includes(file)
    )
    
    if (invalidFiles.length === 0) return null
    
    // Obtener nombres de archivos inválidos
    const invalidNames = invalidFiles.map(f => f.name).join(', ')
    
    // Obtener razones (puede haber múltiples razones por archivo)
    const allReasons = []
    invalidFiles.forEach(file => {
        const reasons = getInvalidReasons(file, maxSize)
        allReasons.push(...reasons)
    })
    
    // Eliminar duplicados y crear texto de razones
    const uniqueReasons = [...new Set(allReasons)]
    const reasonText = uniqueReasons.join(' o ')
    
    return `${invalidFiles.length} archivo(s) fueron descartados: ${invalidNames}. Razón: ${reasonText}`
}




