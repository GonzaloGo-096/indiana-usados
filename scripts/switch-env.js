#!/usr/bin/env node

/**
 * Script para cambiar rápidamente entre entornos
 * 
 * Uso:
 * node scripts/switch-env.js postman
 * node scripts/switch-env.js local
 * node scripts/switch-env.js mock-local
 * node scripts/switch-env.js production
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Mock local agregado
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuraciones predefinidas
const ENVIRONMENTS = {
    postman: {
        name: '🟢 Desarrollo con Postman',
        config: {
            VITE_USE_MOCK_API: 'true',
            VITE_USE_POSTMAN_MOCK: 'true',
            VITE_POSTMAN_MOCK_URL: 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io',
            VITE_POSTMAN_DETAIL_URL: 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io',
            VITE_API_URL: 'https://tu-backend-real.com/api',
            VITE_MOCK_API_URL: 'http://localhost:3000/api',
            VITE_API_TIMEOUT: '5000',
            VITE_API_RETRIES: '3',
            VITE_API_RETRY_DELAY: '1000',
            VITE_AUTH_ENABLED: 'true',
            VITE_AUTH_STORAGE_KEY: 'indiana_auth_token',
            VITE_ENABLE_LAZY_LOADING: 'true',
            VITE_ENABLE_CODE_SPLITTING: 'true',
            VITE_ENABLE_DEBUG_LOGS: 'true',
            VITE_ENABLE_ERROR_BOUNDARIES: 'true',
            VITE_IMAGE_OPTIMIZATION: 'true',
            VITE_USE_CDN: 'false',
            VITE_CDN_URL: 'https://tu-cdn.com',
            VITE_CONTACT_EMAIL: 'info@indianausados.com',
            VITE_CONTACT_WHATSAPP: '5491112345678',
            VITE_ENVIRONMENT: 'development'
        }
    },
    'mock-local': {
        name: '🟣 Desarrollo con Mock Local',
        config: {
            VITE_USE_MOCK_API: 'true',
            VITE_USE_POSTMAN_MOCK: 'false',
            VITE_POSTMAN_MOCK_URL: 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io',
            VITE_POSTMAN_DETAIL_URL: 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io',
            VITE_API_URL: 'https://tu-backend-real.com/api',
            VITE_MOCK_API_URL: 'http://localhost:3000/api',
            VITE_API_TIMEOUT: '1000',
            VITE_API_RETRIES: '1',
            VITE_API_RETRY_DELAY: '500',
            VITE_AUTH_ENABLED: 'true',
            VITE_AUTH_STORAGE_KEY: 'indiana_auth_token',
            VITE_ENABLE_LAZY_LOADING: 'true',
            VITE_ENABLE_CODE_SPLITTING: 'true',
            VITE_ENABLE_DEBUG_LOGS: 'true',
            VITE_ENABLE_ERROR_BOUNDARIES: 'true',
            VITE_IMAGE_OPTIMIZATION: 'true',
            VITE_USE_CDN: 'false',
            VITE_CDN_URL: 'https://tu-cdn.com',
            VITE_CONTACT_EMAIL: 'info@indianausados.com',
            VITE_CONTACT_WHATSAPP: '5491112345678',
            VITE_ENVIRONMENT: 'development'
        }
    },
    local: {
        name: '🟡 Desarrollo con Backend Local',
        config: {
            VITE_USE_MOCK_API: 'false',
            VITE_USE_POSTMAN_MOCK: 'false',
            VITE_POSTMAN_MOCK_URL: 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io',
            VITE_POSTMAN_DETAIL_URL: 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io',
            VITE_API_URL: 'http://localhost:3001/api',
            VITE_MOCK_API_URL: 'http://localhost:3000/api',
            VITE_API_TIMEOUT: '5000',
            VITE_API_RETRIES: '3',
            VITE_API_RETRY_DELAY: '1000',
            VITE_AUTH_ENABLED: 'true',
            VITE_AUTH_STORAGE_KEY: 'indiana_auth_token',
            VITE_ENABLE_LAZY_LOADING: 'true',
            VITE_ENABLE_CODE_SPLITTING: 'true',
            VITE_ENABLE_DEBUG_LOGS: 'true',
            VITE_ENABLE_ERROR_BOUNDARIES: 'true',
            VITE_IMAGE_OPTIMIZATION: 'true',
            VITE_USE_CDN: 'false',
            VITE_CDN_URL: 'https://tu-cdn.com',
            VITE_CONTACT_EMAIL: 'info@indianausados.com',
            VITE_CONTACT_WHATSAPP: '5491112345678',
            VITE_ENVIRONMENT: 'development'
        }
    },
    production: {
        name: '🔴 Producción',
        config: {
            VITE_USE_MOCK_API: 'false',
            VITE_USE_POSTMAN_MOCK: 'false',
            VITE_POSTMAN_MOCK_URL: 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io',
            VITE_POSTMAN_DETAIL_URL: 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io',
            VITE_API_URL: 'https://api.indiana-usados.com',
            VITE_MOCK_API_URL: 'http://localhost:3000/api',
            VITE_API_TIMEOUT: '10000',
            VITE_API_RETRIES: '2',
            VITE_API_RETRY_DELAY: '2000',
            VITE_AUTH_ENABLED: 'true',
            VITE_AUTH_STORAGE_KEY: 'indiana_auth_token',
            VITE_ENABLE_LAZY_LOADING: 'true',
            VITE_ENABLE_CODE_SPLITTING: 'true',
            VITE_ENABLE_DEBUG_LOGS: 'false',
            VITE_ENABLE_ERROR_BOUNDARIES: 'true',
            VITE_IMAGE_OPTIMIZATION: 'true',
            VITE_USE_CDN: 'true',
            VITE_CDN_URL: 'https://cdn.indiana-usados.com',
            VITE_CONTACT_EMAIL: 'info@indianausados.com',
            VITE_CONTACT_WHATSAPP: '5491112345678',
            VITE_ENVIRONMENT: 'production'
        }
    },
    testing: {
        name: '🟣 Testing',
        config: {
            VITE_USE_MOCK_API: 'true',
            VITE_USE_POSTMAN_MOCK: 'false',
            VITE_POSTMAN_MOCK_URL: 'https://c65a35e4-099e-4f66-a282-1f975219d583.mock.pstmn.io',
            VITE_POSTMAN_DETAIL_URL: 'https://0ce757d8-1c7a-4cec-9872-b3e45dd2d032.mock.pstmn.io',
            VITE_API_URL: 'https://tu-backend-real.com/api',
            VITE_MOCK_API_URL: 'http://localhost:3000/api',
            VITE_API_TIMEOUT: '3000',
            VITE_API_RETRIES: '1',
            VITE_API_RETRY_DELAY: '500',
            VITE_AUTH_ENABLED: 'true',
            VITE_AUTH_STORAGE_KEY: 'indiana_auth_token',
            VITE_ENABLE_LAZY_LOADING: 'false',
            VITE_ENABLE_CODE_SPLITTING: 'false',
            VITE_ENABLE_DEBUG_LOGS: 'false',
            VITE_ENABLE_ERROR_BOUNDARIES: 'true',
            VITE_IMAGE_OPTIMIZATION: 'false',
            VITE_USE_CDN: 'false',
            VITE_CDN_URL: 'https://tu-cdn.com',
            VITE_CONTACT_EMAIL: 'info@indianausados.com',
            VITE_CONTACT_WHATSAPP: '5491112345678',
            VITE_ENVIRONMENT: 'testing'
        }
    }
}

// Función para generar contenido del archivo .env.local
function generateEnvContent(config) {
    let content = '# ===== CONFIGURACIÓN LOCAL - INDIANA USADOS =====\n'
    content += '# Generado automáticamente por switch-env.js\n\n'
    
    // Agrupar variables por categoría
    const categories = {
        'API CONFIGURATION': ['VITE_API_URL', 'VITE_POSTMAN_MOCK_URL', 'VITE_POSTMAN_DETAIL_URL', 'VITE_MOCK_API_URL'],
        'FEATURES FLAGS': ['VITE_USE_MOCK_API', 'VITE_USE_POSTMAN_MOCK'],
        'CONFIGURACIÓN DE API': ['VITE_API_TIMEOUT', 'VITE_API_RETRIES', 'VITE_API_RETRY_DELAY'],
        'AUTHENTICATION': ['VITE_AUTH_ENABLED', 'VITE_AUTH_STORAGE_KEY'],
        'PERFORMANCE': ['VITE_ENABLE_LAZY_LOADING', 'VITE_ENABLE_CODE_SPLITTING'],
        'DEBUGGING': ['VITE_ENABLE_DEBUG_LOGS', 'VITE_ENABLE_ERROR_BOUNDARIES'],
        'IMAGES': ['VITE_IMAGE_OPTIMIZATION', 'VITE_USE_CDN', 'VITE_CDN_URL'],
        'CONTACT': ['VITE_CONTACT_EMAIL', 'VITE_CONTACT_WHATSAPP'],
        'ENVIRONMENT': ['VITE_ENVIRONMENT']
    }
    
    Object.entries(categories).forEach(([category, vars]) => {
        content += `# ===== ${category} =====\n`
        vars.forEach(varName => {
            if (config[varName] !== undefined) {
                content += `${varName}=${config[varName]}\n`
            }
        })
        content += '\n'
    })
    
    return content
}

// Función principal
function switchEnvironment(envName) {
    const env = ENVIRONMENTS[envName]
    
    if (!env) {
        console.error('❌ Entorno no válido. Opciones disponibles:')
        Object.keys(ENVIRONMENTS).forEach(key => {
            console.log(`  - ${key}: ${ENVIRONMENTS[key].name}`)
        })
        process.exit(1)
    }
    
    const envFilePath = path.join(__dirname, '..', '.env.local')
    const content = generateEnvContent(env.config)
    
    try {
        fs.writeFileSync(envFilePath, content)
        console.log(`✅ Entorno cambiado a: ${env.name}`)
        console.log(`📁 Archivo actualizado: ${envFilePath}`)
        console.log('\n🔧 Configuración aplicada:')
        
        // Mostrar configuración clave
        const keyConfigs = {
            'API URL': env.config.VITE_API_URL,
            'Use Mock': env.config.VITE_USE_MOCK_API,
            'Use Postman': env.config.VITE_USE_POSTMAN_MOCK,
            'Debug Logs': env.config.VITE_ENABLE_DEBUG_LOGS,
            'Environment': env.config.VITE_ENVIRONMENT
        }
        
        Object.entries(keyConfigs).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`)
        })
        
        console.log('\n🚀 Para aplicar los cambios, reinicia el servidor de desarrollo:')
        console.log('  npm run dev')
        
    } catch (error) {
        console.error('❌ Error al escribir el archivo .env.local:', error.message)
        process.exit(1)
    }
}

// Obtener argumento de línea de comandos
const envName = process.argv[2]

if (!envName) {
    console.log('🚀 Script de cambio de entorno - Indiana Usados')
    console.log('\n📋 Uso:')
    console.log('  node scripts/switch-env.js <entorno>')
    console.log('\n🎯 Entornos disponibles:')
    Object.entries(ENVIRONMENTS).forEach(([key, env]) => {
        console.log(`  ${key}: ${env.name}`)
    })
    console.log('\n💡 Ejemplo:')
    console.log('  node scripts/switch-env.js postman')
    process.exit(0)
}

// Ejecutar cambio de entorno
switchEnvironment(envName) 