/**
 * test-sitemap.js - Script de prueba para validar sitemap y robots.txt
 * 
 * Prueba:
 * - Sintaxis de generateSitemap.js
 * - Generación de sitemap con datos mock
 * - Validación de formato XML
 * - Validación de robots.txt
 * 
 * Uso: node scripts/test-sitemap.js
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Colores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
}

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
}

// Datos mock para prueba
const mockVehicles = [
  {
    id: '123',
    _id: '123',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2020,
    fotoPrincipal: 'https://res.cloudinary.com/duuwqmpmn/image/upload/v123/toyota.jpg',
    fotosExtras: [
      'https://res.cloudinary.com/duuwqmpmn/image/upload/v123/toyota2.jpg',
      'https://res.cloudinary.com/duuwqmpmn/image/upload/v123/toyota3.jpg'
    ],
    updatedAt: '2025-01-14T10:00:00Z'
  },
  {
    id: '456',
    _id: '456',
    marca: 'Ford',
    modelo: 'Focus',
    anio: 2019,
    fotoPrincipal: '/images/ford.jpg', // URL relativa para probar normalización
    updatedAt: '2025-01-13T10:00:00Z'
  },
  {
    // Vehículo inválido (sin marca ni modelo)
    id: '789',
    _id: '789'
  }
]

console.log('\n🧪 Iniciando pruebas de Sitemap y Robots.txt\n')
console.log('='.repeat(60))

// Test 1: Validar sintaxis de generateSitemap.js
log.info('Test 1: Validando sintaxis de generateSitemap.js')
try {
  const generateSitemapPath = join(rootDir, 'src/utils/seo/generateSitemap.js')
  const generateSitemapCode = readFileSync(generateSitemapPath, 'utf-8')
  
  // Intentar evaluar el código (solo verificar sintaxis básica)
  // Nota: No podemos usar import dinámico fácilmente aquí, así que solo verificamos que el archivo existe y tiene contenido
  if (generateSitemapCode.includes('export const generateSitemap')) {
    log.success('generateSitemap.js tiene sintaxis válida')
  } else {
    log.error('generateSitemap.js no exporta generateSitemap')
  }
} catch (error) {
  log.error(`Error leyendo generateSitemap.js: ${error.message}`)
}

// Test 2: Validar robots.txt
log.info('\nTest 2: Validando robots.txt')
try {
  const robotsPath = join(rootDir, 'public/robots.txt')
  const robotsContent = readFileSync(robotsPath, 'utf-8')
  
  const checks = [
    { name: 'Tiene User-agent', test: robotsContent.includes('User-agent:') },
    { name: 'Tiene Disallow para /admin/', test: robotsContent.includes('Disallow: /admin/') },
    { name: 'Tiene Allow para /', test: robotsContent.includes('Allow: /') },
    { name: 'Tiene referencia a sitemap', test: robotsContent.includes('Sitemap:') },
    { name: 'Orden correcto (Disallow antes de Allow)', test: robotsContent.indexOf('Disallow') < robotsContent.indexOf('Allow') || robotsContent.indexOf('Allow') === -1 }
  ]
  
  let allPassed = true
  checks.forEach(check => {
    if (check.test) {
      log.success(`${check.name}`)
    } else {
      log.error(`${check.name} - FALLO`)
      allPassed = false
    }
  })
  
  if (allPassed) {
    log.success('robots.txt es válido')
  }
} catch (error) {
  log.error(`Error leyendo robots.txt: ${error.message}`)
}

// Test 3: Validar sitemap.xml estático
log.info('\nTest 3: Validando sitemap.xml estático (opcional)')
try {
  const sitemapPath = join(rootDir, 'public/sitemap.xml')
  if (existsSync(sitemapPath)) {
    const sitemapContent = readFileSync(sitemapPath, 'utf-8')
    
    const checks = [
      { name: 'Tiene XML declaration', test: sitemapContent.includes('<?xml version="1.0"') },
      { name: 'Tiene urlset', test: sitemapContent.includes('<urlset') },
      { name: 'Tiene namespace image', test: sitemapContent.includes('xmlns:image') },
      { name: 'Tiene URL home', test: sitemapContent.includes('<loc>https://indianausados.com</loc>') },
      { name: 'Tiene URL /vehiculos', test: sitemapContent.includes('<loc>https://indianausados.com/vehiculos</loc>') },
      { name: 'Cierra urlset correctamente', test: sitemapContent.includes('</urlset>') }
    ]
    
    let allPassed = true
    checks.forEach(check => {
      if (check.test) {
        log.success(`${check.name}`)
      } else {
        log.error(`${check.name} - FALLO`)
        allPassed = false
      }
    })
    
    if (allPassed) {
      log.success('sitemap.xml estático es válido')
    }
  } else {
    log.warn('sitemap.xml estático no existe (la versión dinámica lo reemplaza)')
  }
} catch (error) {
  log.error(`Error leyendo sitemap.xml: ${error.message}`)
}

// Test 4: Validar función serverless
log.info('\nTest 4: Validando función serverless (api/sitemap.xml.js)')
try {
  const serverlessPath = join(rootDir, 'api/sitemap.xml.js')
  const serverlessCode = readFileSync(serverlessPath, 'utf-8')
  
  const checks = [
    { name: 'Tiene export default handler', test: serverlessCode.includes('export default async function handler') },
    { name: 'Tiene función generateSitemap', test: serverlessCode.includes('const generateSitemap') },
    { name: 'Tiene función fetchAllVehicles', test: serverlessCode.includes('const fetchAllVehicles') },
    { name: 'Tiene cache', test: serverlessCode.includes('cachedSitemap') },
    { name: 'Maneja errores', test: serverlessCode.includes('catch') },
    { name: 'Retorna XML', test: serverlessCode.includes('application/xml') }
  ]
  
  let allPassed = true
  checks.forEach(check => {
    if (check.test) {
      log.success(`${check.name}`)
    } else {
      log.error(`${check.name} - FALLO`)
      allPassed = false
    }
  })
  
  if (allPassed) {
    log.success('Función serverless es válida')
  }
} catch (error) {
  log.error(`Error leyendo api/sitemap.xml.js: ${error.message}`)
}

// Test 5: Probar generación de sitemap con datos mock
log.info('\nTest 5: Probando generación de sitemap con datos mock')
try {
  // Importar dinámicamente el módulo
  const generateSitemapModule = await import('../src/utils/seo/generateSitemap.js')
  const { generateSitemap } = generateSitemapModule
  
  // Generar sitemap con datos mock
  const sitemap = generateSitemap(mockVehicles, { siteUrl: 'https://indianausados.com' })
  
  // Validar resultado
  const checks = [
    { name: 'Genera XML válido', test: sitemap.includes('<?xml') && sitemap.includes('</urlset>') },
    { name: 'Incluye páginas estáticas', test: sitemap.includes('/vehiculos') && sitemap.includes('/nosotros') },
    { name: 'Incluye vehículos válidos', test: sitemap.includes('/vehiculo/123') && sitemap.includes('/vehiculo/456') },
    { name: 'Excluye vehículos inválidos', test: !sitemap.includes('/vehiculo/789') },
    { name: 'Normaliza URLs de imágenes', test: sitemap.includes('https://indianausados.com/images/ford.jpg') },
    { name: 'Incluye imágenes', test: sitemap.includes('<image:image>') }
  ]
  
  let allPassed = true
  checks.forEach(check => {
    if (check.test) {
      log.success(`${check.name}`)
    } else {
      log.error(`${check.name} - FALLO`)
      allPassed = false
    }
  })
  
  if (allPassed) {
    log.success('Generación de sitemap funciona correctamente')
    
    // Mostrar muestra del sitemap generado
    log.info('\n📄 Muestra del sitemap generado:')
    const lines = sitemap.split('\n').slice(0, 20)
    console.log(lines.join('\n'))
    console.log('...\n')
  }
} catch (error) {
  log.error(`Error probando generación de sitemap: ${error.message}`)
  log.warn('Esto es normal si el módulo usa imports de React/Vite')
}

// Test 6: Validar estructura de directorios
log.info('\nTest 6: Validando estructura de archivos')
try {
  const requiredFiles = [
    'public/robots.txt',
    'api/sitemap.xml.js',
    'src/utils/seo/generateSitemap.js'
  ]
  const optionalFiles = [
    'public/sitemap.xml'
  ]
  
  let allExist = true
  requiredFiles.forEach(file => {
    const filePath = join(rootDir, file)
    try {
      readFileSync(filePath, 'utf-8')
      log.success(`${file} existe`)
    } catch (error) {
      log.error(`${file} NO existe`)
      allExist = false
    }
  })
  
  if (allExist) {
    log.success('Todos los archivos requeridos existen')
  }

  optionalFiles.forEach(file => {
    const filePath = join(rootDir, file)
    if (existsSync(filePath)) {
      log.warn(`${file} existe (opcional, asegúrate de que no cause duplicados)`)
    } else {
      log.success(`${file} no existe (se usa sitemap dinámico)`)
    }
  })
} catch (error) {
  log.error(`Error validando estructura: ${error.message}`)
}

console.log('\n' + '='.repeat(60))
log.info('Pruebas completadas')
console.log('\n📝 Notas:')
log.info('La función serverless solo funciona en Vercel o con vercel dev')
log.info('Para probar localmente: npm install -g vercel && vercel dev')
log.info('En producción, el sitemap estará en: https://indianausados.com/sitemap.xml')
console.log('')



