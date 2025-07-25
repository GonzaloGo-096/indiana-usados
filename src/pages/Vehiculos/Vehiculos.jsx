/**
 * Vehiculos - Página principal de vehículos
 * 
 * @author Indiana Usados
 * @version 1.0.0
 */

import React from 'react'
import { ListAutos } from '../../components/business/ListAutos'
import styles from './Vehiculos.module.css'

const Vehiculos = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <ListAutos />
            </div>
        </div>
    )
}

export default Vehiculos 