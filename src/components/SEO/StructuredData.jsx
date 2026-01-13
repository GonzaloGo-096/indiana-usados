/**
 * StructuredData.jsx - Componente para inyectar JSON-LD (Structured Data)
 * 
 * Implementa Schema.org para mejorar SEO y rich snippets en Google
 * 
 * @author Indiana Peugeot
 * @version 1.0.0
 */

import { useEffect } from 'react'

/**
 * Inyecta JSON-LD en el head del documento
 * 
 * @param {Object} schema - Objeto JSON-LD válido
 * @param {string} id - ID único para el script (opcional, para poder actualizarlo)
 */
export const StructuredData = ({ schema, id = 'structured-data' }) => {
  useEffect(() => {
    if (!schema || typeof schema !== 'object') return

    // Buscar script existente
    let script = document.getElementById(id)
    
    // Si existe, actualizarlo
    if (script) {
      script.textContent = JSON.stringify(schema, null, 0)
      return
    }

    // Si no existe, crearlo
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema, null, 0)
    document.head.appendChild(script)

    // Cleanup: remover al desmontar
    return () => {
      const existingScript = document.getElementById(id)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [schema, id])

  return null // Componente sin renderizado visual
}

export default StructuredData


