/**
 * Tipos JSDoc para el sistema de vehículos Indiana Usados
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Tipos completos para CRUD y detalle
 */

/**
 * @typedef {Object} ImageField
 * @description Campo de imagen con URL existente o archivo nuevo
 * @property {string} [existingUrl] - URL persistida (puede estar vacía)
 * @property {File} [file] - nuevo archivo subido
 */

/**
 * @typedef {Object} Vehicle
 * @description Vehículo completo del sistema
 * @property {string} id - Identificador único
 * @property {string} [_id] - Compatibilidad con MongoDB
 * @property {string} marca - Marca del vehículo
 * @property {string} modelo - Modelo del vehículo
 * @property {string} [version] - Versión del vehículo
 * @property {number} anio - Año del vehículo
 * @property {number} precio - Precio del vehículo
 * @property {string} [caja] - Tipo de caja
 * @property {string} [segmento] - Segmento del vehículo
 * @property {number} [cilindrada] - Cilindrada del motor
 * @property {string} [color] - Color del vehículo
 * @property {string} [combustible] - Tipo de combustible
 * @property {string} [transmision] - Tipo de transmisión
 * @property {number} [kilometraje] - Kilometraje del vehículo
 * @property {string} [traccion] - Tipo de tracción
 * @property {string} [tapizado] - Tipo de tapizado
 * @property {string} [categoriaVehiculo] - Categoría del vehículo
 * @property {string} [frenos] - Tipo de frenos
 * @property {string} [turbo] - Si tiene turbo
 * @property {string} [llantas] - Tipo de llantas
 * @property {string} [HP] - Caballos de fuerza
 * @property {string} [detalle] - Detalles adicionales
 * @property {string} [fotoPrincipal] - URL de imagen principal
 * @property {string} [fotoHover] - URL de imagen hover
 * @property {string[]} [fotosExtras] - Array de URLs de imágenes extras
 * @property {string} [createdAt] - Fecha de creación
 * @property {string} [updatedAt] - Fecha de última actualización
 * @property {boolean} [isActive] - Si está activo
 * @property {boolean} [isPublished] - Si está publicado
 */

/**
 * @typedef {Object} VehicleListResponse
 * @description Respuesta de lista de vehículos con metadatos
 * @property {Vehicle[]} data - Array de vehículos
 * @property {Object} meta - Metadatos de paginación
 * @property {string|null} meta.nextCursor - Cursor para siguiente página
 * @property {number} meta.total - Total de vehículos
 * @property {boolean} meta.hasNextPage - Si hay siguiente página
 * @property {number} meta.currentPage - Página actual
 * @property {number} meta.totalPages - Total de páginas
 */

/**
 * @typedef {Object} CreateVehicleRequest
 * @description Datos para crear un nuevo vehículo
 * @property {string} marca - Marca del vehículo
 * @property {string} modelo - Modelo del vehículo
 * @property {string} [version] - Versión del vehículo
 * @property {number} anio - Año del vehículo
 * @property {number} precio - Precio del vehículo
 * @property {string} [caja] - Tipo de caja
 * @property {string} [segmento] - Segmento del vehículo
 * @property {number} [cilindrada] - Cilindrada del motor
 * @property {string} [color] - Color del vehículo
 * @property {string} [combustible] - Tipo de combustible
 * @property {string} [transmision] - Tipo de transmisión
 * @property {number} [kilometraje] - Kilometraje del vehículo
 * @property {string} [traccion] - Tipo de tracción
 * @property {string} [tapizado] - Tipo de tapizado
 * @property {string} [categoriaVehiculo] - Categoría del vehículo
 * @property {string} [frenos] - Tipo de frenos
 * @property {string} [turbo] - Si tiene turbo
 * @property {string} [llantas] - Tipo de llantas
 * @property {string} [HP] - Caballos de fuerza
 * @property {string} [detalle] - Detalles adicionales
 * @property {ImageField} fotoPrincipal - Campo de imagen principal
 * @property {ImageField} fotoHover - Campo de imagen hover
 * @property {ImageField[]} fotosExtras - Array de campos de imágenes extras
 */

/**
 * @typedef {Object} UpdateVehicleRequest
 * @description Datos para actualizar un vehículo existente
 * @property {string} id - ID del vehículo a actualizar
 * @property {string} [marca] - Marca del vehículo
 * @property {string} [modelo] - Modelo del vehículo
 * @property {string} [version] - Versión del vehículo
 * @property {number} [anio] - Año del vehículo
 * @property {number} [precio] - Precio del vehículo
 * @property {string} [caja] - Tipo de caja
 * @property {string} [segmento] - Segmento del vehículo
 * @property {number} [cilindrada] - Cilindrada del motor
 * @property {string} [color] - Color del vehículo
 * @property {string} [combustible] - Tipo de combustible
 * @property {string} [transmision] - Tipo de transmisión
 * @property {number} [kilometraje] - Kilometraje del vehículo
 * @property {string} [traccion] - Tipo de tracción
 * @property {string} [tapizado] - Tipo de tapizado
 * @property {string} [categoriaVehiculo] - Categoría del vehículo
 * @property {string} [frenos] - Tipo de frenos
 * @property {string} [turbo] - Si tiene turbo
 * @property {string} [llantas] - Tipo de llantas
 * @property {string} [HP] - Caballos de fuerza
 * @property {string} [detalle] - Detalles adicionales
 * @property {ImageField} [fotoPrincipal] - Campo de imagen principal
 * @property {ImageField} [fotoHover] - Campo de imagen hover
 * @property {ImageField[]} [fotosExtras] - Array de campos de imágenes extras
 */

/**
 * @typedef {Object} VehicleFilters
 * @description Filtros para búsqueda de vehículos
 * @property {string[]} [marca] - Marcas a filtrar
 * @property {string[]} [modelo] - Modelos a filtrar
 * @property {number} [anioDesde] - Año mínimo
 * @property {number} [anioHasta] - Año máximo
 * @property {number} [precioDesde] - Precio mínimo
 * @property {number} [precioHasta] - Precio máximo
 * @property {string[]} [combustible] - Tipos de combustible
 * @property {string[]} [caja] - Tipos de caja
 * @property {string[]} [segmento] - Segmentos
 * @property {string[]} [color] - Colores
 * @property {string[]} [traccion] - Tipos de tracción
 * @property {boolean} [isActive] - Si está activo
 * @property {boolean} [isPublished] - Si está publicado
 */

/**
 * @typedef {Object} PaginationParams
 * @description Parámetros de paginación
 * @property {string|number} [cursor] - Cursor para paginación
 * @property {number} [limit] - Límite de elementos por página
 * @property {number} [page] - Número de página
 */

/**
 * @typedef {Object} ApiResponse
 * @description Respuesta estándar de la API
 * @property {boolean} success - Si la operación fue exitosa
 * @property {*} [data] - Datos de la respuesta
 * @property {string} [error] - Mensaje de error
 * @property {string} [message] - Mensaje informativo
 * @property {number} status - Código de estado HTTP
 */

/**
 * @typedef {'create' | 'read' | 'update' | 'delete'} CrudOperation
 * @description Operaciones CRUD disponibles
 */

/**
 * @typedef {'create' | 'edit' | 'view'} FormMode
 * @description Modos del formulario
 */

/**
 * @typedef {Object} ImageValidation
 * @description Resultado de validación de imágenes
 * @property {boolean} isValid - Si la validación es exitosa
 * @property {string[]} errors - Lista de errores
 * @property {string[]} warnings - Lista de advertencias
 */

/**
 * @typedef {Object} ImagePreview
 * @description Preview de imagen para el formulario
 * @property {string} url - URL de la imagen
 * @property {string} name - Nombre del archivo
 * @property {number} size - Tamaño en bytes
 * @property {string} type - Tipo MIME
 * @property {boolean} isNew - Si es una imagen nueva
 * @property {boolean} isExisting - Si es una imagen existente
 */

// ✅ EXPORTAR TIPOS PARA USO EN OTROS ARCHIVOS
export const VEHICLE_TYPES = {
  IMAGE_FIELDS: ['fotoPrincipal', 'fotoHover', 'fotosExtras'],
  REQUIRED_FIELDS: ['marca', 'modelo', 'anio', 'precio'],
  NUMERIC_FIELDS: ['anio', 'precio', 'cilindrada', 'kilometraje'],
  TEXT_FIELDS: ['marca', 'modelo', 'version', 'caja', 'segmento', 'color', 'combustible', 'transmision', 'traccion', 'tapizado', 'categoriaVehiculo', 'frenos', 'turbo', 'llantas', 'HP', 'detalle']
};

