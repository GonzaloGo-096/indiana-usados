/**
 * Vehiculos - Página principal de vehículos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { ListAutosContainer } from '../../components/business/ListAutos'
import styles from './Vehiculos.module.css'

const Vehiculos = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Vehículos Disponibles</h1>
                <ListAutosContainer />
            </div>
        </div>
    )
}

export default Vehiculos 