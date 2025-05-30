import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CardAuto } from './cardAuto'
import { ListAutosSkeleton } from './skeletons/ListAutosSkeleton'
import { useGetCars } from '../hooks/useGetCars'

export const ListAutos = () => {
    const { autos, loadMore, hasNextPage, isLoading, isError, error, isFetchingNextPage } = useGetCars()

    if (isLoading) {
        return <ListAutosSkeleton cantidad={6} />
    }

    if (isError) {
        return (
            <div className="text-center text-danger py-5">
                <h3>Error al cargar los vehículos</h3>
                <p>{error?.message || 'Error desconocido'}</p>
            </div>
        )
    }

    if (!autos.length) {
        return (
            <div className="text-center py-5">
                <h3>No hay vehículos disponibles</h3>
                <p>Por favor, intente más tarde</p>
            </div>
        )
    }

    return (
        <InfiniteScroll
            dataLength={autos.length}
            next={loadMore}
            hasMore={hasNextPage}
            loader={
                <div className="py-3">
                    <ListAutosSkeleton cantidad={3} />
                </div>
            }
            endMessage={
                <div className="text-center py-3">
                    <p className="text-muted">No hay más vehículos para mostrar</p>
                </div>
            }
            scrollThreshold="80%"
            style={{ overflow: 'visible' }}
        >
            <div className="row g-4">
                {autos.map(auto => (
                    <div key={auto.id} className="col-12 col-md-6 col-lg-4">
                        <CardAuto auto={auto} />
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    )
}
