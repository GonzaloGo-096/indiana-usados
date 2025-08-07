/**
 * Vehiculos - Página principal de vehículos con hook unificado
 * 
 * @author Indiana Usados
 * @version 2.0.0 - Hook unificado integrado
 */

import React, { useEffect } from 'react'
import { VehiclesList } from '@vehicles'
import { useScrollPosition } from '@hooks/useScrollPosition'
import styles from './Vehiculos.module.css'

const Vehiculos = () => {
    // ✅ NUEVO: Hook para restaurar scroll
    const { restoreScrollPosition } = useScrollPosition({
        key: 'vehicles-list',
        enabled: true
    })

    // ✅ NUEVO: Restaurar scroll cuando el componente se monte
    useEffect(() => {
        // Pequeño delay para asegurar que el DOM esté renderizado
        const timer = setTimeout(() => {
            restoreScrollPosition()
        }, 100)
        
        return () => clearTimeout(timer)
    }, [restoreScrollPosition])

    return (
        <div className={styles.container}>
            <VehiclesList />
        </div>
    )
}

export default Vehiculos 