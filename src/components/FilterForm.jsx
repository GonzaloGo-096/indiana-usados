import React from 'react';
import { useForm } from 'react-hook-form';
import { RangeSlider } from './ui/RangeSlider';
import { MultiSelect } from './ui/MultiSelect';
import { marcas, combustibles, cajas } from '../constants';

export default function FilterForm({ initialFilters = {}, onApply, onClear }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      marca: initialFilters.marca || [],
      anioMin: initialFilters.anioMin || 1990,
      anioMax: initialFilters.anioMax || 2024,
      precioMin: initialFilters.precioMin || 5000000,
      precioMax: initialFilters.precioMax || 100000000,
      kilometrajeMin: initialFilters.kilometrajeMin || 0,
      kilometrajeMax: initialFilters.kilometrajeMax || 200000,
      combustible: initialFilters.combustible || [],
      caja: initialFilters.caja || []
    }
  });

  // Watch values
  const marca = watch('marca');
  const combustible = watch('combustible');
  const caja = watch('caja');
  const anioMin = watch('anioMin');
  const anioMax = watch('anioMax');
  const precioMin = watch('precioMin');
  const precioMax = watch('precioMax');
  const kilometrajeMin = watch('kilometrajeMin');
  const kilometrajeMax = watch('kilometrajeMax');

  const onSubmit = (data) => {
    const filters = {
      marca: data.marca,
      anioMin: data.anioMin,
      anioMax: data.anioMax,
      precioMin: data.precioMin,
      precioMax: data.precioMax,
      kilometrajeMin: data.kilometrajeMin,
      kilometrajeMax: data.kilometrajeMax,
      combustible: data.combustible,
      caja: data.caja
    };
    onApply(filters);
  };

  const handleClear = () => {
    reset({
      marca: [],
      anioMin: 1990,
      anioMax: 2024,
      precioMin: 5000000,
      precioMax: 100000000,
      kilometrajeMin: 0,
      kilometrajeMax: 200000,
      combustible: [],
      caja: []
    });
    onClear();
  };

  const formatPrice = (value) => `$${value.toLocaleString()}`;
  const formatKms = (value) => `${value.toLocaleString()} km`;
  const formatYear = (value) => value.toString();

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Filtros de Búsqueda</h3>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Rangos */}
        <div style={{ marginBottom: '20px' }}>
          <h4>Rangos</h4>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Año: {anioMin} - {anioMax}</label>
            <RangeSlider
              min={1990}
              max={2024}
              step={1}
              value={[anioMin, anioMax]}
              onChange={([min, max]) => {
                setValue('anioMin', min);
                setValue('anioMax', max);
              }}
              formatValue={formatYear}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Precio: ${precioMin.toLocaleString()} - ${precioMax.toLocaleString()}</label>
            <RangeSlider
              min={5000000}
              max={100000000}
              step={1000000}
              value={[precioMin, precioMax]}
              onChange={([min, max]) => {
                setValue('precioMin', min);
                setValue('precioMax', max);
              }}
              formatValue={formatPrice}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Kilometraje: {kilometrajeMin.toLocaleString()} - {kilometrajeMax.toLocaleString()} km</label>
            <RangeSlider
              min={0}
              max={200000}
              step={5000}
              value={[kilometrajeMin, kilometrajeMax]}
              onChange={([min, max]) => {
                setValue('kilometrajeMin', min);
                setValue('kilometrajeMax', max);
              }}
              formatValue={formatKms}
            />
          </div>
        </div>

        {/* Selects */}
        <div style={{ marginBottom: '20px' }}>
          <h4>Características</h4>
          
          <div style={{ marginBottom: '15px' }}>
            <MultiSelect
              label="Marca"
              options={marcas}
              value={marca}
              onChange={(values) => setValue('marca', values)}
              placeholder="Todas las marcas"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <MultiSelect
              label="Combustible"
              options={combustibles}
              value={combustible}
              onChange={(values) => setValue('combustible', values)}
              placeholder="Todos los combustibles"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <MultiSelect
              label="Caja"
              options={cajas}
              value={caja}
              onChange={(values) => setValue('caja', values)}
              placeholder="Todas las cajas"
            />
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Aplicar Filtros
          </button>
          <button type="button" onClick={handleClear} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
