#!/usr/bin/env node

/**
 * Script de medición de rendimiento
 * 
 * Mide el rendimiento de la aplicación antes y después de las optimizaciones
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Métricas a medir
const metrics = {
  cssFiles: 0,
  cssSize: 0,
  mediaQueries: 0,
  hardcodedBreakpoints: 0,
  variablesUsed: 0,
  duplicateBreakpoints: 0,
  totalLines: 0
};

// Función para analizar un archivo CSS
function analyzeCSSFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    metrics.cssFiles++;
    metrics.cssSize += content.length;
    metrics.totalLines += lines.length;
    
    // Contar media queries
    const mediaQueryMatches = content.match(/@media/g);
    if (mediaQueryMatches) {
      metrics.mediaQueries += mediaQueryMatches.length;
    }
    
    // Contar breakpoints hardcodeados
    const hardcodedMatches = content.match(/768px|576px|992px|1200px|1400px|480px|1024px|769px/g);
    if (hardcodedMatches) {
      metrics.hardcodedBreakpoints += hardcodedMatches.length;
    }
    
    // Contar variables CSS usadas
    const variableMatches = content.match(/var\(--breakpoint-/g);
    if (variableMatches) {
      metrics.variablesUsed += variableMatches.length;
    }
    
    // Contar breakpoints duplicados
    const duplicateMatches = content.match(/@media \(max-width: 768px\)/g);
    if (duplicateMatches) {
      metrics.duplicateBreakpoints += duplicateMatches.length;
    }
    
  } catch (error) {
    console.error(`Error analizando ${filePath}:`, error.message);
  }
}

// Función principal
async function main() {
  console.log('🔍 Analizando rendimiento CSS...\n');
  
  // Buscar archivos CSS
  const cssFiles = await glob('src/**/*.css');
  const moduleFiles = await glob('src/**/*.module.css');
  const allFiles = [...cssFiles, ...moduleFiles];
  
  console.log(`📁 Analizando ${allFiles.length} archivos CSS...\n`);
  
  // Analizar cada archivo
  allFiles.forEach(analyzeCSSFile);
  
  // Calcular métricas adicionales
  const avgFileSize = metrics.cssSize / metrics.cssFiles;
  const avgLinesPerFile = metrics.totalLines / metrics.cssFiles;
  const optimizationRatio = metrics.variablesUsed / (metrics.hardcodedBreakpoints + metrics.variablesUsed);
  
  // Mostrar resultados
  console.log('📊 MÉTRICAS DE RENDIMIENTO CSS\n');
  console.log('📁 Archivos analizados:', metrics.cssFiles);
  console.log('📏 Tamaño total CSS:', (metrics.cssSize / 1024).toFixed(2), 'KB');
  console.log('📄 Líneas totales:', metrics.totalLines);
  console.log('📱 Media queries encontradas:', metrics.mediaQueries);
  console.log('🔢 Breakpoints hardcodeados:', metrics.hardcodedBreakpoints);
  console.log('🎯 Variables CSS usadas:', metrics.variablesUsed);
  console.log('🔄 Breakpoints duplicados:', metrics.duplicateBreakpoints);
  console.log('\n📈 MÉTRICAS PROMEDIO:');
  console.log('   Tamaño promedio por archivo:', (avgFileSize / 1024).toFixed(2), 'KB');
  console.log('   Líneas promedio por archivo:', avgLinesPerFile.toFixed(1));
  console.log('   Ratio de optimización:', (optimizationRatio * 100).toFixed(1) + '%');
  
  // Evaluación de rendimiento
  console.log('\n🎯 EVALUACIÓN DE RENDIMIENTO:');
  
  if (optimizationRatio > 0.7) {
    console.log('   ✅ Excelente: Más del 70% de breakpoints optimizados');
  } else if (optimizationRatio > 0.5) {
    console.log('   🟡 Bueno: Más del 50% de breakpoints optimizados');
  } else if (optimizationRatio > 0.3) {
    console.log('   🟠 Regular: Más del 30% de breakpoints optimizados');
  } else {
    console.log('   🔴 Necesita mejora: Menos del 30% de breakpoints optimizados');
  }
  
  if (metrics.duplicateBreakpoints === 0) {
    console.log('   ✅ Sin duplicaciones: No hay breakpoints duplicados');
  } else {
    console.log('   ⚠️  Duplicaciones: Se encontraron breakpoints duplicados');
  }
  
  if (avgFileSize < 5000) {
    console.log('   ✅ Archivos compactos: Tamaño promedio optimizado');
  } else {
    console.log('   ⚠️  Archivos grandes: Considerar optimización de tamaño');
  }
  
  // Recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  
  if (optimizationRatio < 0.5) {
    console.log('   • Continuar migrando breakpoints hardcodeados a variables CSS');
  }
  
  if (metrics.duplicateBreakpoints > 0) {
    console.log('   • Eliminar breakpoints duplicados para mejorar mantenibilidad');
  }
  
  if (avgFileSize > 5000) {
    console.log('   • Considerar dividir archivos CSS grandes');
  }
  
  console.log('   • Usar las utilidades responsive del sistema unificado');
  console.log('   • Mantener consistencia en el uso de variables CSS');
  
  console.log('\n✅ Análisis completado!');
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { analyzeCSSFile, metrics }; 