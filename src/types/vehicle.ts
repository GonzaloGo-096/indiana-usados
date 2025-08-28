/**
 * Tipos TypeScript para el sistema de vehículos Indiana Usados
 * 
 * @author Indiana Usados
 * @version 1.0.0 - Tipos completos para CRUD y detalle
 */

// ✅ TIPO PARA CAMPOS DE IMAGEN
export type ImageField = {
  existingUrl?: string; // URL persistida (puede estar vacía)
  file?: File;          // nuevo archivo subido
};

// ✅ TIPO PRINCIPAL DE VEHÍCULO
export type Vehicle = {
  // Identificación
  id: string;
  _id?: string; // Compatibilidad con MongoDB
  
  // Información básica
  marca: string;
  modelo: string;
  version?: string;
  anio: number;
  precio: number;
  
  // Características técnicas
  caja?: string;
  segmento?: string;
  cilindrada?: number;
  color?: string;
  combustible?: string;
  transmision?: string;
  kilometraje?: number;
  traccion?: string;
  tapizado?: string;
  categoriaVehiculo?: string;
  frenos?: string;
  turbo?: string;
  llantas?: string;
  HP?: string;
  detalle?: string;
  
  // Imágenes (URLs normalizadas en APIs de lectura)
  fotoFrontal?: string;
  fotoTrasera?: string;
  fotoLateralIzquierda?: string;
  fotoLateralDerecha?: string;
  fotoInterior?: string;
  
  // Metadatos
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isPublished?: boolean;
};

// ✅ TIPO PARA RESPUESTA DE LISTA
export type VehicleListResponse = {
  data: Vehicle[];
  meta: {
    nextCursor: string | null;
    total: number;
    hasNextPage: boolean;
    currentPage: number;
    totalPages: number;
  };
};

// ✅ TIPO PARA CREAR VEHÍCULO
export type CreateVehicleRequest = Omit<Vehicle, 'id' | '_id' | 'createdAt' | 'updatedAt'> & {
  // Campos de imagen para creación
  fotoFrontal: ImageField;
  fotoTrasera: ImageField;
  fotoLateralIzquierda: ImageField;
  fotoLateralDerecha: ImageField;
  fotoInterior: ImageField;
};

// ✅ TIPO PARA ACTUALIZAR VEHÍCULO
export type UpdateVehicleRequest = Partial<CreateVehicleRequest> & {
  id: string;
};

// ✅ TIPO PARA FILTROS
export type VehicleFilters = {
  marca?: string[];
  modelo?: string[];
  anioDesde?: number;
  anioHasta?: number;
  precioDesde?: number;
  precioHasta?: number;
  combustible?: string[];
  caja?: string[];
  segmento?: string[];
  color?: string[];
  traccion?: string[];
  isActive?: boolean;
  isPublished?: boolean;
};

// ✅ TIPO PARA PAGINACIÓN
export type PaginationParams = {
  cursor?: string | number;
  limit?: number;
  page?: number;
};

// ✅ TIPO PARA RESPUESTA DE API
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
};

// ✅ TIPO PARA OPERACIÓN CRUD
export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

// ✅ TIPO PARA ESTADO DE FORMULARIO
export type FormMode = 'create' | 'edit' | 'view';

// ✅ TIPO PARA VALIDACIÓN DE IMÁGENES
export type ImageValidation = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

// ✅ TIPO PARA PREVIEW DE IMAGEN
export type ImagePreview = {
  url: string;
  name: string;
  size: number;
  type: string;
  isNew: boolean;
  isExisting: boolean;
};
