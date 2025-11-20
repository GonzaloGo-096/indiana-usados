/**
 * generate-image-manifest.js - Script para generar manifest de imágenes
 * 
 * PROPÓSITO:
 * - Escanea /public/images/vehicles/ y genera el manifest automáticamente
 * - Detecta pattern: {vehicle_id}-{tipo}.webp
 * - Actualiza src/utils/imageManifest.js con las rutas
 * 
 * USO:
 * node scripts/generate-image-manifest.js
 * 
 * FLUJO:
 * 1. Escanear /public/images/vehicles/
 * 2. Extraer vehicle_id e imageType de cada archivo
 * 3. Agrupar por vehicle_id
 * 4. Generar objeto IMAGE_MANIFEST
 * 5. Actualizar imageManifest.js automáticamente
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ===== CONFIGURACIÓN =====
const IMAGES_DIR = path.join(__dirname, '../public/images/vehicles')
const MANIFEST_FILE = path.join(__dirname, '../src/utils/imageManifest.js')

/**
 * Parsea nombre de archivo para extraer vehicle_id e imageType
 * Formato esperado: {vehicle_id}-{tipo}.webp
 * 
 * @param {string} filename - Nombre del archivo
 * @returns {Object|null} { vehicleId, imageType } o null si no es válido
 */
function parseFilename(filename) {
  // Verificar que sea .webp
  if (!filename.endsWith('.webp')) return null
  
  // Remover extensión
  const nameWithoutExt = filename.replace('.webp', '')
  
  // Buscar el último guión (antes del tipo de imagen)
  // Ejemplo: 673ce5f4aa297cb9e041a26f-principal
  const lastDashIndex = nameWithoutExt.lastIndexOf('-')
  
  if (lastDashIndex === -1) {
    console.warn(`⚠️  Formato inválido (sin guión): ${filename}`)
    return null
  }
  
  const vehicleId = nameWithoutExt.substring(0, lastDashIndex)
  const imageType = nameWithoutExt.substring(lastDashIndex + 1)
  
  // Validar que vehicleId no esté vacío
  if (!vehicleId || vehicleId.length < 10) {
    console.warn(`⚠️  Vehicle ID muy corto: ${filename}`)
    return null
  }
  
  // Validar imageType
  const validTypes = ['principal', 'hover', 'extra1', 'extra2', 'extra3', 'extra4', 'extra5', 'extra6', 'extra7', 'extra8']
  if (!validTypes.includes(imageType)) {
    console.warn(`⚠️  Tipo de imagen desconocido: ${imageType} (archivo: ${filename})`)
    // Aún así lo agregamos, pero advertimos
  }
  
  return { vehicleId, imageType }
}

/**
 * Escanea directorio de imágenes y genera manifest
 * 
 * @returns {Object} - Manifest agrupado por vehicle_id
 */
function scanImagesDirectory() {
  console.log('📂 Escaneando directorio:', IMAGES_DIR)
  
  // Verificar que el directorio exista
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ Error: Directorio no encontrado:', IMAGES_DIR)
    console.log('💡 Crea el directorio: public/images/vehicles/')
    return {}
  }
  
  // Leer archivos
  const files = fs.readdirSync(IMAGES_DIR)
  console.log(`📄 Archivos encontrados: ${files.length}`)
  
  const manifest = {}
  let validFiles = 0
  
  files.forEach(filename => {
    const parsed = parseFilename(filename)
    
    if (!parsed) return // Skip invalid files
    
    const { vehicleId, imageType } = parsed
    
    // Inicializar entrada si no existe
    if (!manifest[vehicleId]) {
      manifest[vehicleId] = {}
    }
    
    // Agregar imagen
    manifest[vehicleId][imageType] = `/images/vehicles/${filename}`
    validFiles++
  })
  
  console.log(`✅ Imágenes válidas procesadas: ${validFiles}`)
  console.log(`🚗 Vehículos encontrados: ${Object.keys(manifest).length}`)
  
  return manifest
}

/**
 * Genera código JavaScript del manifest
 * 
 * @param {Object} manifest - Manifest agrupado
 * @returns {string} - Código JavaScript
 */
function generateManifestCode(manifest) {
  const entries = Object.entries(manifest)
  
  if (entries.length === 0) {
    return '  // ⚠️  No hay imágenes en /public/images/vehicles/\n  // Ejecuta el script .bat para generar imágenes WebP optimizadas'
  }
  
  const lines = entries.map(([vehicleId, images]) => {
    const imageEntries = Object.entries(images)
      .map(([type, path]) => `    ${type}: "${path}"`)
      .join(',\n')
    
    return `  "${vehicleId}": {\n${imageEntries}\n  }`
  })
  
  return lines.join(',\n')
}

/**
 * Actualiza archivo imageManifest.js con el nuevo manifest
 * 
 * @param {Object} manifest - Manifest generado
 */
function updateManifestFile(manifest) {
  console.log('\n📝 Actualizando imageManifest.js...')
  
  // Leer archivo actual
  const currentContent = fs.readFileSync(MANIFEST_FILE, 'utf-8')
  
  // Generar código del manifest
  const manifestCode = generateManifestCode(manifest)
  
  // Buscar y reemplazar el contenido de IMAGE_MANIFEST
  const regex = /export const IMAGE_MANIFEST = \{[\s\S]*?\n\}/
  
  const newManifestBlock = `export const IMAGE_MANIFEST = {\n${manifestCode}\n}`
  
  const updatedContent = currentContent.replace(regex, newManifestBlock)
  
  // Escribir archivo
  fs.writeFileSync(MANIFEST_FILE, updatedContent, 'utf-8')
  
  console.log('✅ imageManifest.js actualizado correctamente')
  console.log(`📊 Estadísticas:`)
  console.log(`   - Vehículos: ${Object.keys(manifest).length}`)
  console.log(`   - Imágenes totales: ${Object.values(manifest).reduce((sum, imgs) => sum + Object.keys(imgs).length, 0)}`)
}

/**
 * Función principal
 */
function main() {
  console.log('🚀 Generador de Image Manifest\n')
  
  try {
    // 1. Escanear directorio
    const manifest = scanImagesDirectory()
    
    if (Object.keys(manifest).length === 0) {
      console.log('\n⚠️  No se encontraron imágenes válidas')
      console.log('💡 Asegúrate de que:')
      console.log('   1. El directorio /public/images/vehicles/ existe')
      console.log('   2. Contiene archivos .webp')
      console.log('   3. Siguen el formato: {vehicle_id}-{tipo}.webp')
      return
    }
    
    // 2. Actualizar archivo
    updateManifestFile(manifest)
    
    console.log('\n🎉 ¡Manifest generado exitosamente!')
    console.log('🔄 Reinicia el servidor de desarrollo para aplicar cambios')
    
  } catch (error) {
    console.error('\n❌ Error al generar manifest:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Ejecutar
main()

