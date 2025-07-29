/**
 * PERFORMANCE TEST - Medición profesional de rendimiento
 * 
 * Script para medir y comparar el rendimiento del formulario de filtros
 * antes y después de las optimizaciones
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// ===== CONFIGURACIÓN DE MEDICIÓN =====
const TEST_CONFIG = {
  iterations: 1000,
  warmupRuns: 100,
  timeout: 5000,
  precision: 3
}

// ===== MÉTRICAS A MEDIR =====
const METRICS = {
  // Tiempo de renderizado inicial
  initialRender: 'Tiempo de renderizado inicial',
  
  // Tiempo de re-renderizado
  reRender: 'Tiempo de re-renderizado',
  
  // Tiempo de cálculo de filtros activos
  activeFiltersCalculation: 'Cálculo de filtros activos',
  
  // Tiempo de actualización de rangos
  rangeUpdate: 'Actualización de rangos',
  
  // Tiempo de actualización de MultiSelect
  multiSelectUpdate: 'Actualización MultiSelect',
  
  // Uso de memoria
  memoryUsage: 'Uso de memoria',
  
  // Tiempo de respuesta de interacción
  interactionResponse: 'Respuesta de interacción'
}

// ===== FUNCIONES DE MEDICIÓN =====

/**
 * Medir tiempo de ejecución de una función
 */
function measureExecutionTime(fn, iterations = 1) {
  const times = []
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    fn()
    const end = performance.now()
    times.push(end - start)
  }
  
  return {
    min: Math.min(...times),
    max: Math.max(...times),
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)]
  }
}

/**
 * Medir uso de memoria
 */
function measureMemoryUsage() {
  if (performance.memory) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    }
  }
  return null
}

/**
 * Simular interacciones del usuario
 */
function simulateUserInteractions() {
  // Simular cambios en rangos
  const rangeInteractions = () => {
    // Simular cambio de precio
    const priceChange = { target: { value: [10000000, 50000000] } }
    // Simular cambio de año
    const yearChange = { target: { value: [2010, 2020] } }
    // Simular cambio de kilometraje
    const kmChange = { target: { value: [50000, 150000] } }
  }
  
  // Simular cambios en MultiSelect
  const multiSelectInteractions = () => {
    // Simular selección de marcas
    const marcaSelection = ['Toyota', 'Honda', 'Ford']
    // Simular selección de combustibles
    const combustibleSelection = ['Gasolina', 'Diesel']
    // Simular selección de transmisiones
    const transmisionSelection = ['Manual', 'Automática']
  }
  
  return {
    rangeInteractions,
    multiSelectInteractions
  }
}

/**
 * Medición completa del rendimiento
 */
function runPerformanceTest() {
  console.log('🚀 INICIANDO MEDICIÓN DE RENDIMIENTO PROFESIONAL')
  console.log('=' .repeat(60))
  
  const results = {
    timestamp: new Date().toISOString(),
    version: 'ORIGINAL', // o 'OPTIMIZADO'
    metrics: {}
  }
  
  // 1. MEDICIÓN DE RENDERIZADO INICIAL
  console.log('📊 1. Medición de renderizado inicial...')
  const initialRenderTime = measureExecutionTime(() => {
    // Simular renderizado del componente
    const component = document.createElement('div')
    component.innerHTML = '<div class="filter-form">...</div>'
    document.body.appendChild(component)
    document.body.removeChild(component)
  }, TEST_CONFIG.warmupRuns)
  
  results.metrics.initialRender = initialRenderTime
  console.log(`✅ Renderizado inicial: ${initialRenderTime.avg.toFixed(TEST_CONFIG.precision)}ms (promedio)`)
  
  // 2. MEDICIÓN DE RE-RENDERIZADO
  console.log('📊 2. Medición de re-renderizado...')
  const reRenderTime = measureExecutionTime(() => {
    // Simular actualización de estado
    const stateUpdate = { marca: ['Toyota'], precioDesde: 10000000 }
    // Simular re-renderizado
    const component = document.createElement('div')
    component.innerHTML = '<div class="filter-form updated">...</div>'
  }, TEST_CONFIG.iterations)
  
  results.metrics.reRender = reRenderTime
  console.log(`✅ Re-renderizado: ${reRenderTime.avg.toFixed(TEST_CONFIG.precision)}ms (promedio)`)
  
  // 3. MEDICIÓN DE CÁLCULO DE FILTROS ACTIVOS
  console.log('📊 3. Medición de cálculo de filtros activos...')
  const activeFiltersTime = measureExecutionTime(() => {
    // Simular el cálculo original
    const watchedValues = {
      marca: ['Toyota', 'Honda'],
      combustible: ['Gasolina'],
      transmision: [],
      añoDesde: 2010,
      añoHasta: 2020,
      precioDesde: 10000000,
      precioHasta: 50000000,
      kilometrajeDesde: 50000,
      kilometrajeHasta: 150000
    }
    
    const activeFiltersCount = Object.entries(watchedValues).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value && value !== '' && value !== 0 && value !== '0'
    }).length
  }, TEST_CONFIG.iterations)
  
  results.metrics.activeFiltersCalculation = activeFiltersTime
  console.log(`✅ Cálculo filtros activos: ${activeFiltersTime.avg.toFixed(TEST_CONFIG.precision)}ms (promedio)`)
  
  // 4. MEDICIÓN DE ACTUALIZACIÓN DE RANGOS
  console.log('📊 4. Medición de actualización de rangos...')
  const rangeUpdateTime = measureExecutionTime(() => {
    // Simular actualización de rango de precio
    const newRange = [15000000, 40000000]
    const formatPrice = (value) => `$${value.toLocaleString()}`
    const formattedValues = newRange.map(formatPrice)
  }, TEST_CONFIG.iterations)
  
  results.metrics.rangeUpdate = rangeUpdateTime
  console.log(`✅ Actualización rangos: ${rangeUpdateTime.avg.toFixed(TEST_CONFIG.precision)}ms (promedio)`)
  
  // 5. MEDICIÓN DE ACTUALIZACIÓN DE MULTISELECT
  console.log('📊 5. Medición de actualización MultiSelect...')
  const multiSelectTime = measureExecutionTime(() => {
    // Simular actualización de MultiSelect
    const newValues = ['Toyota', 'Honda', 'Ford']
    const selectedSet = new Set(newValues)
    const isSelected = selectedSet.has('Toyota')
  }, TEST_CONFIG.iterations)
  
  results.metrics.multiSelectUpdate = multiSelectTime
  console.log(`✅ Actualización MultiSelect: ${multiSelectTime.avg.toFixed(TEST_CONFIG.precision)}ms (promedio)`)
  
  // 6. MEDICIÓN DE USO DE MEMORIA
  console.log('📊 6. Medición de uso de memoria...')
  const memoryUsage = measureMemoryUsage()
  results.metrics.memoryUsage = memoryUsage
  
  if (memoryUsage) {
    console.log(`✅ Uso de memoria: ${(memoryUsage.used / 1024 / 1024).toFixed(2)}MB`)
  } else {
    console.log('⚠️ Medición de memoria no disponible')
  }
  
  // 7. MEDICIÓN DE RESPUESTA DE INTERACCIÓN
  console.log('📊 7. Medición de respuesta de interacción...')
  const interactionTime = measureExecutionTime(() => {
    // Simular interacción completa
    const interactions = simulateUserInteractions()
    interactions.rangeInteractions()
    interactions.multiSelectInteractions()
  }, TEST_CONFIG.iterations / 10) // Menos iteraciones para interacciones
  
  results.metrics.interactionResponse = interactionTime
  console.log(`✅ Respuesta interacción: ${interactionTime.avg.toFixed(TEST_CONFIG.precision)}ms (promedio)`)
  
  // ===== RESUMEN DE RESULTADOS =====
  console.log('\n📈 RESUMEN DE RENDIMIENTO')
  console.log('=' .repeat(60))
  
  const summary = {
    totalTime: Object.values(results.metrics).reduce((total, metric) => {
      if (metric && typeof metric.avg === 'number') {
        return total + metric.avg
      }
      return total
    }, 0),
    averageTime: 0,
    performanceScore: 0
  }
  
  const timeMetrics = Object.values(results.metrics).filter(metric => 
    metric && typeof metric.avg === 'number'
  )
  
  summary.averageTime = summary.totalTime / timeMetrics.length
  summary.performanceScore = 1000 / summary.averageTime // Score inverso al tiempo
  
  console.log(`🎯 Tiempo total promedio: ${summary.totalTime.toFixed(TEST_CONFIG.precision)}ms`)
  console.log(`🎯 Tiempo promedio por operación: ${summary.averageTime.toFixed(TEST_CONFIG.precision)}ms`)
  console.log(`🎯 Score de rendimiento: ${summary.performanceScore.toFixed(2)}`)
  
  // ===== GUARDAR RESULTADOS =====
  results.summary = summary
  
  // Guardar en localStorage para comparación
  const testKey = `performance_test_${results.version}_${Date.now()}`
  localStorage.setItem(testKey, JSON.stringify(results))
  
  console.log(`\n💾 Resultados guardados con clave: ${testKey}`)
  console.log('=' .repeat(60))
  
  return results
}

/**
 * Comparar resultados de dos versiones
 */
function comparePerformanceResults(originalKey, optimizedKey) {
  console.log('🔍 COMPARACIÓN DE RENDIMIENTO')
  console.log('=' .repeat(60))
  
  const original = JSON.parse(localStorage.getItem(originalKey))
  const optimized = JSON.parse(localStorage.getItem(optimizedKey))
  
  if (!original || !optimized) {
    console.error('❌ No se encontraron resultados para comparar')
    return
  }
  
  const comparison = {
    timestamp: new Date().toISOString(),
    improvements: {},
    degradations: {},
    overall: {}
  }
  
  // Comparar métricas
  Object.keys(original.metrics).forEach(metric => {
    if (original.metrics[metric] && optimized.metrics[metric] && 
        original.metrics[metric].avg && optimized.metrics[metric].avg) {
      
      const originalTime = original.metrics[metric].avg
      const optimizedTime = optimized.metrics[metric].avg
      const difference = ((optimizedTime - originalTime) / originalTime) * 100
      
      if (difference < 0) {
        comparison.improvements[metric] = {
          original: originalTime,
          optimized: optimizedTime,
          improvement: Math.abs(difference)
        }
      } else {
        comparison.degradations[metric] = {
          original: originalTime,
          optimized: optimizedTime,
          degradation: difference
        }
      }
    }
  })
  
  // Mostrar mejoras
  if (Object.keys(comparison.improvements).length > 0) {
    console.log('✅ MEJORAS DETECTADAS:')
    Object.entries(comparison.improvements).forEach(([metric, data]) => {
      console.log(`  ${metric}: ${data.improvement.toFixed(2)}% más rápido`)
    })
  }
  
  // Mostrar degradaciones
  if (Object.keys(comparison.degradations).length > 0) {
    console.log('❌ DEGRADACIONES DETECTADAS:')
    Object.entries(comparison.degradations).forEach(([metric, data]) => {
      console.log(`  ${metric}: ${data.degradation.toFixed(2)}% más lento`)
    })
  }
  
  // Resumen general
  const totalImprovements = Object.keys(comparison.improvements).length
  const totalDegradations = Object.keys(comparison.degradations).length
  
  console.log(`\n📊 RESUMEN: ${totalImprovements} mejoras, ${totalDegradations} degradaciones`)
  
  return comparison
}

// ===== EXPORTAR FUNCIONES =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runPerformanceTest,
    comparePerformanceResults,
    measureExecutionTime,
    measureMemoryUsage
  }
} else {
  // Para uso en navegador
  window.PerformanceTest = {
    runPerformanceTest,
    comparePerformanceResults,
    measureExecutionTime,
    measureMemoryUsage
  }
}

// ===== EJECUTAR SI SE LLAMA DIRECTAMENTE =====
if (typeof window !== 'undefined') {
  console.log('🎯 Performance Test cargado. Usar:')
  console.log('  PerformanceTest.runPerformanceTest()')
  console.log('  PerformanceTest.comparePerformanceResults(key1, key2)')
} 