import React from 'react'
import { Link } from 'react-router-dom'
import { useGetCars } from '../../hooks/useGetCars'
import '../../styles/admin/dashboard.css'

const Dashboard = () => {
    const { 
        autos, 
        loadMore, 
        hasNextPage, 
        isLoading, 
        isError, 
        error, 
        isFetchingNextPage,
        refetch
    } = useGetCars()

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="dashboard-error">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">¡Error!</h4>
                    <p>{error?.message || 'Error al cargar los vehículos'}</p>
                    <button 
                        onClick={() => refetch()} 
                        className="btn btn-danger"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="dashboard-header-left">
                    <h1>Panel de Administración</h1>
                    <Link to="/" className="btn btn-outline-secondary ms-3">
                        Ver Sitio Público
                    </Link>
                </div>
                <Link to="/admin/vehiculos/nuevo" className="btn btn-primary">
                    Agregar Vehículo
                </Link>
            </div>

            <div className="dashboard-content">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Año</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {autos.map(auto => (
                                <tr key={auto.id}>
                                    <td>{auto.id}</td>
                                    <td>{auto.marca}</td>
                                    <td>{auto.modelo}</td>
                                    <td>{auto.anio}</td>
                                    <td>${auto.precio?.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${auto.estado === 'disponible' ? 'bg-success' : 'bg-warning'}`}>
                                            {auto.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <Link 
                                                to={`/admin/vehiculos/editar/${auto.id}`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Editar
                                            </Link>
                                            <button 
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => {/* TODO: Implementar eliminación */}}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {hasNextPage && (
                    <div className="dashboard-load-more">
                        <button 
                            onClick={loadMore}
                            disabled={isFetchingNextPage}
                            className="btn btn-outline-primary"
                        >
                            {isFetchingNextPage ? 'Cargando...' : 'Cargar más'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard 