import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import img from '../assets/auto1.jpg'
import '../styles/cardAuto.css'

export const CardAuto = memo(({auto}) => {
    if (!auto) return null;

    const {
        id,
        marca = 'Sin marca',
        modelo = 'Sin modelo',
        precio = "Consultar",
        año = "Consultar",
        kms = "Consultar"
    } = auto;

    return (
        <div className="card card-auto shadow-sm">
            <div className="card-auto__image-container">
                <img 
                    src={img} 
                    className="card-auto__image" 
                    alt={`${marca} ${modelo}`}
                    loading="lazy"
                />
            </div>
            <div className="card-auto__body">
                <h5 className="card-auto__title">{marca} {modelo}</h5>
                <div className="card-auto__details">
                    <div className="card-auto__detail">
                        <span className="card-auto__label">Precio:</span>
                        <span>{precio}</span>
                    </div>
                    <div className="card-auto__detail">
                        <span className="card-auto__label">Año:</span>
                        <span>{año}</span>
                    </div>
                    <div className="card-auto__detail">
                        <span className="card-auto__label">Kilómetros:</span>
                        <span>{kms}</span>
                    </div>
                </div>
            </div>
            <div className="card-auto__footer">
                <Link 
                    to={`/vehiculo/${id}`} 
                    className="btn btn-primary card-auto__button">
                    Ver más
                </Link>
            </div>
        </div>
    )
})
