import { useSearchParams, useNavigate } from 'react-router-dom';
import { parseFilters, serializeFilters, hasAnyFilter } from '../../utils/filters';
import { useVehiclesList } from '../../hooks/vehicles/useVehiclesList';
import FilterForm from '../../components/FilterForm';
import AutosGrid from '../../components/AutosGrid';

export default function Vehiculos() {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();

  const filters = parseFilters(sp);
  const isFiltered = hasAnyFilter(filters);

      const { vehicles, total, hasNextPage, isLoading, isError, error, refetch } = useVehiclesList(filters);

  const onApply = (newFilters) => setSp(serializeFilters(newFilters), { replace: false });
  const onClear = () => setSp(new URLSearchParams(), { replace: false });

  return (
    <>
      <FilterForm initialFilters={filters} onApply={onApply} onClear={onClear} />

      <AutosGrid
        vehicles={vehicles}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        total={total}
      />

      {isFiltered && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/vehiculos')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Volver a lista principal
          </button>
        </div>
      )}
    </>
  );
}
