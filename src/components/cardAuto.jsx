import React from 'react'
import { Link } from 'react-router-dom'
import img from '..//assets/auto1.jpg'  // Importar la imagen

export const CardAuto = ({auto}) => {
    // Validar que auto exista
    if (!auto) return null;

    // Extraer datos con valores por defecto
    const {
        id,
        marca = 'Sin marca',
        modelo = 'Sin modelo',
        precio = "Consultar",
        año = "Consultar",
        kms = "Consultar"
    } = auto;

    return (
        <div className="card h-100 shadow-sm">
            <img src={img} className="card-img-top" alt={marca} />
            <div className="card-body">
                <h5 className="card-title">{marca + " " + modelo}</h5>
                <p className="card-text">{precio}</p>
                <p className="card-text">{año}</p>
                <p className="card-text">{kms}</p>
            </div>
            <div className="card-footer bg-transparent border-0">
                <Link 
                    to={`/vehiculo/${id}`} 
                    className="btn btn-primary w-100">
                    Ver más
                </Link>
            </div>
        </div>
    )
}
