#!/usr/bin/env node

/**
 * Script de migración de breakpoints
 * 
 * Migra automáticamente breakpoints hardcodeados a variables CSS
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Mapeo de breakpoints hardcodeados a variables CSS
const breakpointMappings = {
  // Max-width queries
  '@media (max-width: 768px)': '@media (max-width: var(--breakpoint-md))',
  '@media (max-width: 576px)': '@media (max-width: var(--breakpoint-sm))',
  '@media (max-width: 992px)': '@media (max-width: var(--breakpoint-lg))',
  '@media (max-width: 1200px)': '@media (max-width: var(--breakpoint-xl))',
  '@media (max-width: 1400px)': '@media (max-width: var(--breakpoint-2xl))',
  '@media (max-width: 480px)': '@media (max-width: var(--breakpoint-sm))',
  '@media (max-width: 1024px)': '@media (max-width: var(--breakpoint-lg))',
  
  // Min-width queries
  '@media (min-width: 768px)': '@media (min-width: var(--breakpoint-md))',
  '@media (min-width: 576px)': '@media (min-width: var(--breakpoint-sm))',
  '@media (min-width: 992px)': '@media (min-width: var(--breakpoint-lg))',
  '@media (min-width: 1200px)': '@media (min-width: var(--breakpoint-xl))',
  '@media (min-width: 1400px)': '@media (min-width: var(--breakpoint-2xl))',
  '@media (min-width: 769px)': '@media (min-width: var(--breakpoint-lg))',
  '@media (min-width: 1024px)': '@media (min-width: var(--breakpoint-lg))',
  
  // Valores hardcodeados en propiedades
  '768px': 'var(--breakpoint-md)',
  '576px': 'var(--breakpoint-sm)',
  '992px': 'var(--breakpoint-lg)',
  '1200px': 'var(--breakpoint-xl)',
  '1400px': 'var(--breakpoint-2xl)',
  '480px': 'var(--breakpoint-sm)',
  '1024px': 'var(--breakpoint-lg)',
  '769px': 'var(--breakpoint-lg)'
};

// Función para migrar un archivo
function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;
    
    // Aplicar mapeos
    for (const [oldValue, newValue] of Object.entries(breakpointMappings)) {
      const regex = new RegExp(oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newValue);
        changes += matches.length;
      }
    }
    
    // Si hubo cambios, escribir el archivo
    if (changes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath} - ${changes} cambios aplicados`);
      return { file: filePath, changes };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return null;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando migración de breakpoints...\n');
  
  // Buscar archivos CSS
  const cssFiles = await glob('src/**/*.css');
  const moduleFiles = await glob('src/**/*.module.css');
  const allFiles = [...cssFiles, ...moduleFiles];
  
  console.log(`📁 Encontrados ${allFiles.length} archivos CSS para procesar\n`);
  
  let totalChanges = 0;
  let filesChanged = 0;
  
  // Procesar cada archivo
  allFiles.forEach(filePath => {
    const result = migrateFile(filePath);
    if (result) {
      filesChanged++;
      totalChanges += result.changes;
    }
  });
  
  console.log('\n📊 Resumen de migración:');
  console.log(`   Archivos procesados: ${allFiles.length}`);
  console.log(`   Archivos modificados: ${filesChanged}`);
  console.log(`   Total de cambios: ${totalChanges}`);
  
  if (filesChanged > 0) {
    console.log('\n✅ Migración completada exitosamente!');
    console.log('💡 Recuerda revisar los cambios y probar la aplicación.');
  } else {
    console.log('\nℹ️  No se encontraron breakpoints hardcodeados para migrar.');
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { migrateFile, breakpointMappings }; 