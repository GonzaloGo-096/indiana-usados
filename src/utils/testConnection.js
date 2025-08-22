/**
 * testConnection.js - Utilidad para probar conexión al backend
 * 
 * Uso: Copiar y pegar en la consola del navegador para probar la conexión
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

// Función para probar la conexión al backend
export const testBackendConnection = async () => {
    console.log('🧪 INICIANDO PRUEBA DE CONEXIÓN AL BACKEND')
    console.log('=' .repeat(50))
    
    try {
        // 1. Verificar configuración
        console.log('1️⃣ VERIFICANDO CONFIGURACIÓN...')
        const config = await import('@config')
        console.log('✅ Configuración cargada:', {
            baseURL: config.default.api.baseURL,
            timeout: config.default.api.timeout,
            mock: config.default.api.mock,
            environment: config.default.environment
        })
        
        // 2. Verificar axios instance
        console.log('\n2️⃣ VERIFICANDO INSTANCIA AXIOS...')
        const { axiosInstance } = await import('@api')
        console.log('✅ Axios instance configurada:', {
            baseURL: axiosInstance.defaults.baseURL,
            timeout: axiosInstance.defaults.timeout,
            headers: axiosInstance.defaults.headers
        })
        
        // 3. Probar endpoint GET
        console.log('\n3️⃣ PROBANDO ENDPOINT GET /photos/getallphotos...')
        const getResponse = await axiosInstance.get('/photos/getallphotos', {
            params: { limit: 2, page: 1 }
        })
        console.log('✅ GET exitoso:', {
            status: getResponse.status,
            statusText: getResponse.statusText,
            dataLength: getResponse.data ? (Array.isArray(getResponse.data) ? getResponse.data.length : 'No es array') : 'No data',
            sample: getResponse.data ? (Array.isArray(getResponse.data) ? getResponse.data.slice(0, 1) : getResponse.data) : 'No data'
        })
        
        // 4. Probar endpoint POST
        console.log('\n4️⃣ PROBANDO ENDPOINT POST /photos/getallphotos...')
        const postResponse = await axiosInstance.post('/photos/getallphotos', {
            filters: {},
            pagination: { limit: 2, page: 1 }
        })
        console.log('✅ POST exitoso:', {
            status: postResponse.status,
            statusText: postResponse.statusText,
            dataLength: postResponse.data ? (Array.isArray(postResponse.data) ? postResponse.data.length : 'No es array') : 'No data'
        })
        
        // 5. Resumen final
        console.log('\n🎉 PRUEBA COMPLETADA EXITOSAMENTE!')
        console.log('✅ Backend conectado correctamente')
        console.log('✅ Endpoints funcionando')
        console.log('✅ Configuración correcta')
        
    } catch (error) {
        console.error('\n❌ ERROR EN LA PRUEBA DE CONEXIÓN')
        console.error('🚨 Error:', {
            message: error.message,
            name: error.name,
            code: error.code
        })
        
        if (error.response) {
            console.error('📡 Error del servidor:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            })
        } else if (error.request) {
            console.error('🌐 Error de red:', {
                message: 'No se recibió respuesta del servidor',
                request: error.request
            })
        } else {
            console.error('⚙️ Error de configuración:', {
                message: 'Error al configurar la petición'
            })
        }
        
        console.log('\n🔧 POSIBLES SOLUCIONES:')
        console.log('1. Verificar que el backend esté corriendo en localhost:3001')
        console.log('2. Verificar que el endpoint /photos/getallphotos exista')
        console.log('3. Verificar configuración CORS en el backend')
        console.log('4. Verificar variables de entorno en .env')
    }
}

// Función para probar solo la configuración
export const testConfig = async () => {
    console.log('🔧 VERIFICANDO CONFIGURACIÓN...')
    try {
        const config = await import('@config')
        console.log('✅ Configuración:', config.default)
        return config.default
    } catch (error) {
        console.error('❌ Error cargando configuración:', error)
        return null
    }
}

// Función para probar solo axios
export const testAxios = async () => {
    console.log('🔧 VERIFICANDO AXIOS...')
    try {
        const { axiosInstance } = await import('@api')
        console.log('✅ Axios instance:', {
            baseURL: axiosInstance.defaults.baseURL,
            timeout: axiosInstance.defaults.timeout,
            headers: axiosInstance.defaults.headers
        })
        return axiosInstance
    } catch (error) {
        console.error('❌ Error cargando axios:', error)
        return null
    }
}

// Función para hacer una petición simple
export const simpleRequest = async () => {
    console.log('🔧 HACIENDO PETICIÓN SIMPLE...')
    try {
        const { axiosInstance } = await import('@api')
        const response = await axiosInstance.get('/photos/getallphotos?limit=1&page=1')
        console.log('✅ Respuesta simple:', {
            status: response.status,
            data: response.data
        })
        return response
    } catch (error) {
        console.error('❌ Error en petición simple:', error)
        return null
    }
}

// Exportar funciones para uso en consola
if (typeof window !== 'undefined') {
    window.testBackendConnection = testBackendConnection
    window.testConfig = testConfig
    window.testAxios = testAxios
    window.simpleRequest = simpleRequest
    
    console.log('🧪 FUNCIONES DE PRUEBA DISPONIBLES:')
    console.log('- testBackendConnection() - Prueba completa de conexión')
    console.log('- testConfig() - Verifica configuración')
    console.log('- testAxios() - Verifica instancia axios')
    console.log('- simpleRequest() - Hace una petición simple')
}
