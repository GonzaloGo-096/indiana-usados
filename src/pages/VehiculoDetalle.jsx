import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import autoService, { queryKeys } from '../service/service'
import img from '..//assets/auto1.jpg'  // Importar la imagen

// Componente Skeleton para el detalle
const DetalleSkeleton = () => (
    <div className="container py-5">
        <div className="row">
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="placeholder-glow">
                        <div className="placeholder w-100" style={{ height: '400px' }}></div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card shadow-sm h-100">
                    <div className="card-body">
                        <div className="placeholder-glow">
                            <h2 className="card-title placeholder col-8 mb-4"></h2>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="placeholder col-4"></div>
                                <div className="placeholder col-4"></div>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="placeholder col-3"></div>
                                <div className="placeholder col-3"></div>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="placeholder col-5"></div>
                                <div className="placeholder col-5"></div>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="placeholder col-4"></div>
                                <div className="placeholder col-4"></div>
                            </div>
                            <div className="placeholder col-12 mt-4" style={{ height: '100px' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const VehiculoDetalle = () => {
    const { id } = useParams()

    const { 
        data: auto, 
        isLoading, 
        isError, 
        error 
    } = useQuery({
        queryKey: queryKeys.auto(id),
        queryFn: () => autoService.getAutoById(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
        cacheTime: 1000 * 60 * 30, // 30 minutos
        retry: 1
    })

    if (isLoading) return <DetalleSkeleton />

    if (isError) return (
        <div className="container py-5 text-center">
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Error al cargar el vehículo</h4>
                <p>{error.message}</p>
                <hr />
                <Link to="/vehiculos" className="btn btn-outline-danger">
                    Volver a la lista de vehículos
                </Link>
            </div>
        </div>
    )

    if (!auto) return (
        <div className="container py-5 text-center">
            <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">Vehículo no encontrado</h4>
                <p>El vehículo que buscas no existe o ha sido removido.</p>
                <hr />
                <Link to="/vehiculos" className="btn btn-outline-warning">
                    Volver a la lista de vehículos
                </Link>
            </div>
        </div>
    )

    // Extraer datos con valores por defecto
    const {
        marca = 'Sin marca',
        modelo = 'Sin modelo', 
        precio = 'Consultar',
        año = 'Sin año',
        color = 'Sin color',
        combustible = 'Sin combustible',
        categoria = 'Sin categoría',
        detalle = 'Sin detalles',
        kms = 'Sin kilometraje',
       
    } = auto;

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to="/vehiculos" className="btn btn-outline-primary">
                        ← Volver a vehículos
                    </Link>
                </div>
                <div className="col-md-6 mb-4">
                    <img 
                        src={img} 
                        alt={`${marca} ${modelo}`}
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                    />
                </div>
                <div className="col-md-6">
                    <h2 className="mb-3">{marca} {modelo}</h2>
                    <div className="card shadow-sm">
                        <div className="card-body">
                            {/* Tabla con los detalles del vehículo */}
                            <div className="row">
                                <div className="col-6">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th scope="row">Precio</th>
                                                <td>${precio}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Año</th>
                                                <td>{año}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Kilometraje</th>
                                                <td>{kms} km</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-6">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th scope="row" >Combustible</th>
                                                <td>{combustible}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Color</th>
                                                <td>{color}</td>
                                            </tr>
                                            <tr>
                                                <th>Categoría</th>
                                                <td>{categoria}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mt-3">
                               <h4>Detalle</h4>
                               <p>{detalle}</p>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehiculoDetalle
    
        