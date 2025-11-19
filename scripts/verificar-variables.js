/**
 * Script de Verificación de Variables de Entorno
 * 
 * Este script verifica que las variables de entorno estén configuradas correctamente
 * y muestra qué valores se están usando.
 */

console.log('🔍 VERIFICACIÓN DE VARIABLES DE ENTORNO\n');
console.log('=' .repeat(50));

// Verificar variables de entorno
const variables = {
  'VITE_API_URL': import.meta.env.VITE_API_URL,
  'VITE_ENVIRONMENT': import.meta.env.VITE_ENVIRONMENT,
  'VITE_API_TIMEOUT': import.meta.env.VITE_API_TIMEOUT,
  'VITE_CLOUDINARY_CLOUD_NAME': import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  'VITE_CONTACT_EMAIL': import.meta.env.VITE_CONTACT_EMAIL,
  'VITE_CONTACT_WHATSAPP': import.meta.env.VITE_CONTACT_WHATSAPP,
}

console.log('\n📋 Variables de Entorno:');
console.log('-'.repeat(50));

let hayProblemas = false;

for (const [key, value] of Object.entries(variables)) {
  const status = value ? '✅' : '❌';
  const valor = value || '(no definida)';
  
  if (!value && (key === 'VITE_API_URL' || key === 'VITE_ENVIRONMENT')) {
    hayProblemas = true;
  }
  
  console.log(`${status} ${key}: ${valor}`);
}

console.log('\n' + '='.repeat(50));

// Verificar configuración de API
console.log('\n🔧 Configuración de API:');
console.log('-'.repeat(50));

try {
  // Importar configuración
  const configModule = await import('../src/config/index.js');
  const config = configModule.config;
  
  console.log(`✅ Base URL: ${config.api.baseURL}`);
  console.log(`✅ Timeout: ${config.api.timeout}ms`);
  console.log(`✅ Environment: ${config.environment}`);
  
  // Verificar si está usando localhost
  if (config.api.baseURL.includes('localhost')) {
    console.log('\n⚠️  ADVERTENCIA: Está usando localhost en lugar de la URL de producción!');
    hayProblemas = true;
  }
  
  // Verificar si la URL es correcta
  if (config.api.baseURL === 'https://back-indiana.vercel.app') {
    console.log('\n✅ URL del backend es correcta');
  } else {
    console.log(`\n⚠️  URL del backend: ${config.api.baseURL}`);
    console.log('   Esperado: https://back-indiana.vercel.app');
  }
  
} catch (error) {
  console.error('❌ Error al cargar configuración:', error.message);
  hayProblemas = true;
}

console.log('\n' + '='.repeat(50));

// Resumen
if (hayProblemas) {
  console.log('\n❌ PROBLEMAS DETECTADOS:');
  console.log('   1. Verifica que las variables estén en Vercel');
  console.log('   2. Haz un redeploy después de agregar variables');
  console.log('   3. Verifica que estén seleccionadas para Production');
} else {
  console.log('\n✅ TODO CORRECTO');
  console.log('   Las variables están configuradas correctamente');
}

console.log('\n' + '='.repeat(50));



