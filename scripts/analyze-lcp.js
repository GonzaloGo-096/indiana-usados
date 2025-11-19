/**
 * Script de análisis de LCP
 * 
 * Analiza posibles problemas de rendimiento relacionados con LCP
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

console.log('🔍 Análisis de LCP - Indiana Usados\n')
console.log('=' .repeat(60))

// 1. Analizar tamaños de imágenes
console.log('\n📸 1. ANÁLISIS DE IMÁGENES')
console.log('-'.repeat(60))

const assetsDir = path.join(rootDir, 'src', 'assets')
const imageExtensions = ['.webp', '.png', '.jpg', '.jpeg']

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch (e) {
    return null
  }
}

function formatSize(bytes) {
  if (bytes === null) return 'N/A'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function analyzeImages(dir, depth = 0) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  const results = []
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    
    if (file.isDirectory()) {
      if (depth < 2) { // Limitar profundidad
        results.push(...analyzeImages(fullPath, depth + 1))
      }
    } else {
      const ext = path.extname(file.name).toLowerCase()
      if (imageExtensions.includes(ext)) {
        const size = getFileSize(fullPath)
        const relPath = path.relative(rootDir, fullPath)
        results.push({ path: relPath, size, ext })
      }
    }
  }
  
  return results
}

const images = analyzeImages(assetsDir)
const heroImage = images.find(img => img.path.includes('foto-principal'))
const logoImage = images.find(img => img.path.includes('logo'))

console.log(`Total imágenes encontradas: ${images.length}`)
console.log('\nImágenes críticas:')

if (heroImage) {
  console.log(`  🖼️  Hero: ${heroImage.path}`)
  console.log(`     Tamaño: ${formatSize(heroImage.size)}`)
  if (heroImage.size > 300 * 1024) {
    console.log(`     ⚠️  ADVERTENCIA: Imagen > 300 KB - Considerar comprimir`)
  } else if (heroImage.size > 200 * 1024) {
    console.log(`     ⚠️  ADVERTENCIA: Imagen > 200 KB - Podría optimizarse`)
  } else {
    console.log(`     ✅ Tamaño aceptable`)
  }
} else {
  console.log(`  ⚠️  Hero image no encontrada`)
}

if (logoImage) {
  console.log(`  🖼️  Logo: ${logoImage.path}`)
  console.log(`     Tamaño: ${formatSize(logoImage.size)}`)
  if (logoImage.size > 50 * 1024) {
    console.log(`     ⚠️  ADVERTENCIA: Logo > 50 KB - Considerar comprimir`)
  } else {
    console.log(`     ✅ Tamaño aceptable`)
  }
}

// 2. Analizar imports síncronos en main.jsx
console.log('\n📦 2. ANÁLISIS DE IMPORTS SÍNCRONOS')
console.log('-'.repeat(60))

const mainJsx = path.join(rootDir, 'src', 'main.jsx')
if (fs.existsSync(mainJsx)) {
  const content = fs.readFileSync(mainJsx, 'utf-8')
  const imports = content.match(/import\s+.*?from\s+['"](.*?)['"]/g) || []
  
  console.log(`Imports en main.jsx: ${imports.length}`)
  imports.forEach((imp, i) => {
    const match = imp.match(/from\s+['"](.*?)['"]/)
    if (match) {
      const importPath = match[1]
      if (importPath.includes('.css')) {
        console.log(`  ${i + 1}. ${importPath} ⚠️  CSS (puede bloquear render)`)
      } else {
        console.log(`  ${i + 1}. ${importPath}`)
      }
    }
  })
}

// 3. Verificar lazy loading de Home
console.log('\n⚡ 3. ANÁLISIS DE LAZY LOADING')
console.log('-'.repeat(60))

const publicRoutes = path.join(rootDir, 'src', 'routes', 'PublicRoutes.jsx')
if (fs.existsSync(publicRoutes)) {
  const content = fs.readFileSync(publicRoutes, 'utf-8')
  
  if (content.includes('lazy(() => import(\'../pages/Home/Home\'))')) {
    console.log('  ⚠️  PROBLEMA: Home está en lazy loading')
    console.log('     Esto retrasa el render inicial y el LCP')
  } else if (content.includes('import Home from')) {
    console.log('  ✅ Home cargado directamente (no lazy)')
  } else {
    console.log('  ⚠️  No se pudo determinar el estado de Home')
  }
}

// 4. Verificar preloads en index.html
console.log('\n🔗 4. ANÁLISIS DE PRELOADS')
console.log('-'.repeat(60))

const indexHtml = path.join(rootDir, 'index.html')
if (fs.existsSync(indexHtml)) {
  const content = fs.readFileSync(indexHtml, 'utf-8')
  
  const preloads = content.match(/<link[^>]*rel=["']preload["'][^>]*>/g) || []
  console.log(`Preloads encontrados: ${preloads.length}`)
  
  preloads.forEach((preload, i) => {
    const hrefMatch = preload.match(/href=["'](.*?)["']/)
    const asMatch = preload.match(/as=["'](.*?)["']/)
    const href = hrefMatch ? hrefMatch[1] : 'N/A'
    const as = asMatch ? asMatch[1] : 'N/A'
    
    if (as === 'image') {
      console.log(`  ${i + 1}. ✅ Preload de imagen: ${href}`)
    } else {
      console.log(`  ${i + 1}. Preload: ${href} (as: ${as})`)
    }
  })
  
  if (!content.includes('preload') || !content.includes('image')) {
    console.log('  ⚠️  ADVERTENCIA: No se encontró preload de imagen hero')
  }
}

// 5. Resumen y recomendaciones
console.log('\n📊 5. RESUMEN Y RECOMENDACIONES')
console.log('-'.repeat(60))

const issues = []
const recommendations = []

if (heroImage && heroImage.size > 300 * 1024) {
  issues.push('Imagen hero muy grande (> 300 KB)')
  recommendations.push('Comprimir foto-principal.webp a calidad 75-80%')
}

if (logoImage && logoImage.size > 50 * 1024) {
  issues.push('Logo muy grande (> 50 KB)')
  recommendations.push('Comprimir logo a WebP con calidad 90%')
}

const cssImports = images.filter(img => img.path.includes('.css'))
if (cssImports.length > 0) {
  recommendations.push('Considerar lazy loading de CSS no crítico')
}

if (issues.length === 0) {
  console.log('  ✅ No se encontraron problemas críticos obvios')
} else {
  console.log('  ⚠️  Problemas encontrados:')
  issues.forEach((issue, i) => {
    console.log(`     ${i + 1}. ${issue}`)
  })
}

if (recommendations.length > 0) {
  console.log('\n  💡 Recomendaciones:')
  recommendations.forEach((rec, i) => {
    console.log(`     ${i + 1}. ${rec}`)
  })
}

console.log('\n' + '='.repeat(60))
console.log('✅ Análisis completado')
console.log('\nPróximos pasos:')
console.log('  1. Ejecutar Lighthouse (F12 → Lighthouse → Performance)')
console.log('  2. Verificar Network tab para timing de recursos')
console.log('  3. Revisar Performance tab para render blocking')
console.log('  4. Si imagen hero es grande, comprimirla')






