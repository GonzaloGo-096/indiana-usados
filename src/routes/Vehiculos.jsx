import React from 'react'
import { ListAutos } from '../components/ListAutos'

const Vehiculos = () => {
    return (
        <div className="container-fluid px-4">
            <div className="vehiculos-container w-100 px-0">
                <h1 className="mb-4">Vehículos Disponibles</h1>
                <ListAutos />
            </div>
        </div>
    )
}

export default Vehiculos 