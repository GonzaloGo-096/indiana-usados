/**
 * logger.js - Sistema de logging minimalista
 * Solo lo esencial: log (dev), warn y error (siempre)
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args) => isDev && console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args)
}

export default logger
