import React from 'react';
import { CardAuto } from './vehicles/Card/CardAuto';

export default function AutosGrid({
  vehicles,
  isLoading,
  hasNextPage,
  isLoadingMore,
  onLoadMore,
  total,
  isError,
  error
}) {
  // ✅ Estado local para error de "cargar más"
  const [loadMoreError, setLoadMoreError] = React.useState(null);

  // ✅ Interceptar onLoadMore para capturar errores
  const handleLoadMore = async () => {
    setLoadMoreError(null);
    try {
      await onLoadMore?.();
    } catch (e) {
      setLoadMoreError(e ?? { message: 'No pudimos cargar más.' });
    }
  };
  if (isLoading && (!vehicles || vehicles.length === 0)) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div>Cargando vehículos...</div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>No se encontraron vehículos</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div>
      {/* Información de resultados */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p>Mostrando {vehicles.length} de {total} vehículos</p>
      </div>

      {/* Grid de vehículos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 400px))', 
        gap: '20px',
        marginBottom: '20px',
        justifyContent: 'center' /* ✅ NUEVO: Centrar el grid cuando hay pocas cards */
      }}>
        {vehicles.map((vehicle) => (
          <CardAuto key={vehicle.id || vehicle._id} auto={vehicle} />
        ))}
      </div>

      {/* Botón "Cargar más" */}
      {hasNextPage && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isLoadingMore ? 'not-allowed' : 'pointer',
              opacity: isLoadingMore ? 0.6 : 1
            }}
          >
            {isLoadingMore ? 'Cargando…' : 'Cargar más'}
          </button>
          
          {/* ✅ Mensaje de error y botón de reintento */}
          {loadMoreError && (
            <div role="alert" style={{ marginTop: 8 }}>
              No pudimos cargar más. <button onClick={handleLoadMore} disabled={isLoadingMore}>Reintentar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
