import fs from 'fs';

console.log('🔍 Analizando rendimiento CSS...\n');

// Métricas
let cssFiles = 0;
let cssSize = 0;
let mediaQueries = 0;
let hardcodedBreakpoints = 0;
let variablesUsed = 0;
let totalLines = 0;

// Buscar archivos CSS manualmente
const cssFilesList = [
  'src/styles/globals.css',
  'src/styles/variables.css',
  'src/styles/responsive.css',
  'src/styles/typography.css',
  'src/components/ui/Button/Button.module.css',
  'src/components/ui/Modal/Modal.module.css',
  'src/components/ui/LoadingSpinner/LoadingSpinner.module.css',
  'src/components/ui/Alert/Alert.module.css',
  'src/components/vehicles/Card/CardAuto/CardAuto.module.css',
  'src/components/vehicles/List/ListAutos/ListAutos.module.css',
  'src/components/layout/layouts/Nav/Nav.module.css',
  'src/pages/Home/Home.module.css',
  'src/pages/Vehiculos/Vehiculos.module.css',
  'src/pages/VehiculoDetalle/VehiculoDetalle.module.css',
  'src/pages/Nosotros/Nosotros.module.css',
  'src/components/vehicles/Detail/CardDetalle/CardDetalle.module.css'
];

// Analizar cada archivo
cssFilesList.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      cssFiles++;
      cssSize += content.length;
      totalLines += lines.length;
      
      // Contar media queries
      const mediaQueryMatches = content.match(/@media/g);
      if (mediaQueryMatches) {
        mediaQueries += mediaQueryMatches.length;
      }
      
      // Contar breakpoints hardcodeados
      const hardcodedMatches = content.match(/768px|576px|992px|1200px|1400px|480px|1024px|769px/g);
      if (hardcodedMatches) {
        hardcodedBreakpoints += hardcodedMatches.length;
      }
      
      // Contar variables CSS usadas
      const variableMatches = content.match(/var\(--breakpoint-/g);
      if (variableMatches) {
        variablesUsed += variableMatches.length;
      }
      
      console.log(`✅ ${filePath} - ${lines.length} líneas`);
    }
  } catch (error) {
    console.error(`❌ Error analizando ${filePath}:`, error.message);
  }
});

// Calcular métricas
const avgFileSize = cssSize / cssFiles;
const avgLinesPerFile = totalLines / cssFiles;
const optimizationRatio = variablesUsed / (hardcodedBreakpoints + variablesUsed);

// Mostrar resultados
console.log('\n📊 MÉTRICAS DE RENDIMIENTO CSS\n');
console.log('📁 Archivos analizados:', cssFiles);
console.log('📏 Tamaño total CSS:', (cssSize / 1024).toFixed(2), 'KB');
console.log('📄 Líneas totales:', totalLines);
console.log('📱 Media queries encontradas:', mediaQueries);
console.log('🔢 Breakpoints hardcodeados:', hardcodedBreakpoints);
console.log('🎯 Variables CSS usadas:', variablesUsed);

console.log('\n📈 MÉTRICAS PROMEDIO:');
console.log('   Tamaño promedio por archivo:', (avgFileSize / 1024).toFixed(2), 'KB');
console.log('   Líneas promedio por archivo:', avgLinesPerFile.toFixed(1));
console.log('   Ratio de optimización:', (optimizationRatio * 100).toFixed(1) + '%');

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

console.log('\n✅ Análisis completado!'); 