import React from 'react'
import { ListAutos } from '../components/ListAutos'
import { useLoaderData } from 'react-router-dom'
// export const loadAutos =async () =>{
// const response = await fetch('http://localhost:3000/autos')
// const data = await response.json()
// return data 
// }
const Vehiculos = () => {
    // const data = useLoaderData()
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
