/**
 * ListAutosContainer - Contenedor simplificado para ListAutos
 * 
 * Responsabilidades:
 * - Renderizar ListAutos que usa FilterContext directamente
 * - Ya no maneja lógica de estado (lo hace FilterContext)
 * 
 * @author Indiana Usados
 * @version 2.0.0
 */

import React from 'react'
import ListAutos from './ListAutos'

const ListAutosContainer = () => {
    // ListAutos ahora usa FilterContext directamente
    // No necesita props adicionales
    return <ListAutos />
}

export default ListAutosContainer 