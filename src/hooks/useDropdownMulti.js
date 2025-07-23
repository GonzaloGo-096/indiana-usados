import { useState, useRef, useEffect } from 'react';

export function useDropdownMulti({ name, watch, setValue, onFiltersChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const seleccionados = watch(name) || [];

  // Manejar selección/deselección
  const handleChange = (option) => {
    let nuevas;
    if (seleccionados.includes(option)) {
      nuevas = seleccionados.filter(o => o !== option);
    } else {
      nuevas = [...seleccionados, option];
    }
    setValue(name, nuevas);
    onFiltersChange({ ...watch(), [name]: nuevas });
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { isOpen, setIsOpen, ref, seleccionados, handleChange };
} 