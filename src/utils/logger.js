/**
 * logger.js - Sistema de logging profesional minimalista
 * 
 * Características:
 * - Niveles: debug/info/warn/error
 * - Umbral por ambiente: dev=debug, prod=warn
 * - Debug on-demand en prod (localStorage.debug=1)
 * - Scrubber de PII básico
 * - Formato legible en dev, austero en prod
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Sistema profesional
 */

// Configuración de niveles
const LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// Detectar ambiente y nivel de debug
const isDev = process.env.NODE_ENV === 'development'
const isDebugOnDemand = typeof localStorage !== 'undefined' && localStorage.debug === '1'

// Nivel base por ambiente
const getBaseLevel = () => {
  if (isDebugOnDemand) return LEVELS.DEBUG // Debug on-demand en prod
  return isDev ? LEVELS.DEBUG : LEVELS.WARN
}

// Scrubber básico de PII
const scrubSensitiveData = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj
  
  const scrubbed = Array.isArray(obj) ? [...obj] : { ...obj }
  
  // Campos sensibles a limpiar
  const sensitiveFields = [
    'password', 'token', 'authorization', 'auth_token',
    'email', 'telefono', 'phone', 'patente', 'license_plate'
  ]
  
  const scrubValue = (value) => {
    if (typeof value === 'string') {
      // Patrones de PII comunes
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        return '[EMAIL_REDACTED]'
      }
      if (/^\d{10,}$/.test(value) || /^\+?\d{1,3}[\s-]?\d{3,4}[\s-]?\d{3,4}$/.test(value)) {
        return '[PHONE_REDACTED]'
      }
      if (value.length > 50 && /Bearer|Token|Key/i.test(value)) {
        return '[TOKEN_REDACTED]'
      }
    }
    return value
  }
  
  for (const key in scrubbed) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      scrubbed[key] = '[REDACTED]'
    } else if (typeof scrubbed[key] === 'object') {
      scrubbed[key] = scrubSensitiveData(scrubbed[key])
    } else {
      scrubbed[key] = scrubValue(scrubbed[key])
    }
  }
  
  return scrubbed
}

// Formateador para desarrollo
const formatDev = (level, tag, ...args) => {
  const timestamp = new Date().toLocaleTimeString()
  const levelStr = level.toUpperCase().padEnd(5)
  const prefix = tag ? `[${timestamp}] ${levelStr} [${tag}]` : `[${timestamp}] ${levelStr}`
  return [prefix, ...args.map(arg => scrubSensitiveData(arg))]
}

// Formateador para producción (austero)
const formatProd = (level, tag, ...args) => {
  const timestamp = new Date().toISOString()
  const prefix = tag ? `${timestamp} ${level.toUpperCase()} [${tag}]` : `${timestamp} ${level.toUpperCase()}`
  return [prefix, ...args.map(arg => scrubSensitiveData(arg))]
}

// Logger principal
export const logger = {
  debug: (tag, ...args) => {
    if (getBaseLevel() > LEVELS.DEBUG) return
    const formatted = isDev ? formatDev('debug', tag, ...args) : formatProd('debug', tag, ...args)
    console.log(...formatted)
  },
  
  info: (tag, ...args) => {
    if (getBaseLevel() > LEVELS.INFO) return
    const formatted = isDev ? formatDev('info', tag, ...args) : formatProd('info', tag, ...args)
    console.info(...formatted)
  },
  
  warn: (tag, ...args) => {
    if (getBaseLevel() > LEVELS.WARN) return
    const formatted = isDev ? formatDev('warn', tag, ...args) : formatProd('warn', tag, ...args)
    console.warn(...formatted)
  },
  
  error: (tag, ...args) => {
    if (getBaseLevel() > LEVELS.ERROR) return
    const formatted = isDev ? formatDev('error', tag, ...args) : formatProd('error', tag, ...args)
    console.error(...formatted)
  }
}

// Mantener compatibilidad con API anterior
logger.log = logger.debug

export default logger
