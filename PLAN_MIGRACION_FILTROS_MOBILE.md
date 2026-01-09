# Plan de Migración: Botones Filtros/Ordenar en Mobile

## 📋 Objetivo
Migrar los botones "Filtrar" y "Ordenar" en mobile para que:
- Se parezcan a desktop pero adaptados a mobile
- Salgan del carrusel (BrandsCarousel)
- Estén siempre visibles (no dependan del scroll)
- Mantengan la funcionalidad actual

---

## 🔍 Estado Actual

### Desktop (Funcional ✅)
- **Ubicación**: `src/pages/Vehiculos/Vehiculos.jsx` líneas 231-266
- **Estructura**:
  ```jsx
  <div className={styles.carouselSection}>
    <BrandsCarousel />
    <FilterFormSimple />
    <div className={styles.actionButtons}>  // ✅ Siempre visible
      <button>Filtrar</button>
      <button>Ordenar</button>
    </div>
  </div>
  ```
- **Estilos**: `src/pages/Vehiculos/Vehiculos.module.css`
  - `.actionButtons`: Visible desde 769px, fondo blanco, pegado al carrusel
  - `.actionButton`: Botones transparentes con hover, iconos + texto

### Mobile (Actual - Necesita migración)
- **Ubicación**: `src/components/vehicles/Filters/FilterFormSimple.jsx` líneas 276-322
- **Estructura**:
  ```jsx
  <div className={styles.mobileActionsContainer}>  // Fixed top, aparece con scroll
    <button>Ordenar</button>
    <button>Filtrar</button>
  </div>
  ```
- **Comportamiento**:
  - Solo aparece cuando `scrollY > 100px`
  - Fixed en top: 65px
  - Fondo oscuro con blur
  - Dos botones lado a lado

---

## 🎯 Diseño Propuesto

### Estructura Mobile (Simplificada)
```
.carouselSection (mobile)  ← MISMA estructura que desktop
├── BrandsCarousel
│   └── [logos de marcas]
├── FilterFormSimple
└── .actionButtons  // ✅ MISMO componente, estilos adaptados
    ├── button "Filtrar"
    └── button "Ordenar" + SortDropdown
```

### Características Visuales
- **Posición**: Fijos en el carrusel, igual que desktop
- **Estilo**: Mismo diseño, tamaños adaptados para mobile
  - Fondo blanco (igual que desktop)
  - Botones con iconos + texto (igual que desktop)
  - Padding y tamaños adaptados a mobile (touch-friendly)
  - Integración visual con el carrusel (igual que desktop)

---

## 📐 Cambios Técnicos Necesarios

### 1. `src/pages/Vehiculos/Vehiculos.jsx`

#### Cambios:
- ✅ **NO HAY CAMBIOS** - Los botones ya están en el lugar correcto
- Los botones `.actionButtons` ya están en el carrusel (líneas 231-266)
- Solo necesitamos hacer que sean visibles también en mobile con CSS

#### Código actual (correcto, no necesita cambios):
```jsx
<div className={styles.actionButtons}>  // ✅ Ya existe, solo necesita CSS para mobile
  <button onClick={handleFilterClick}>Filtrar</button>
  <button onClick={handleSortClick}>Ordenar</button>
  <SortDropdown ... />
</div>
```

---

### 2. `src/pages/Vehiculos/Vehiculos.module.css`

#### Cambios necesarios:
- Modificar `.actionButtons` para que sea visible también en mobile
- Ajustar `.actionButton` con tamaños y estilos para mobile
- Mantener estilos desktop existentes

#### Estilos actuales (líneas 160-224):
```css
.actionButtons {
  display: none; /* ❌ Solo visible en desktop desde 769px */
  /* ... estilos desktop ... */
}

.actionButton {
  /* ... estilos desktop ... */
}
```

#### Estilos propuestos:
```css
.actionButtons {
  /* ✅ Mobile-first: visible por defecto */
  display: flex;
  gap: 12px;
  padding: 12px 16px; /* Adaptado para mobile */
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border-radius: 0 0 12px 12px;
  /* ... más estilos base ... */
}

.actionButton {
  /* ✅ Estilos base para mobile */
  padding: 10px 14px; /* Touch-friendly para mobile */
  min-height: 44px; /* Touch-friendly */
  font-size: 0.875rem; /* Tamaño mobile */
  /* ... más estilos base ... */
}

/* Desktop: ajustes específicos desde 769px */
@media (min-width: 769px) {
  .actionButtons {
    padding: 10px 24px; /* Más padding en desktop */
    /* ... ajustes desktop ... */
  }
  
  .actionButton {
    padding: 8px 16px; /* Menos padding en desktop */
    font-size: 0.9375rem; /* Tamaño desktop */
    /* ... ajustes desktop ... */
  }
}
```

---

### 3. `src/components/vehicles/Filters/FilterFormSimple.jsx`

#### Cambios:
- **Eliminar** `.mobileActionsContainer` (líneas 276-322)
- **Eliminar** lógica de scroll para mostrar botones (líneas 115-124)
- **Mantener** toda la lógica de drawer (funciona igual)
- **Mantener** handlers (toggleDrawer, closeDrawer, etc.)

#### Código a eliminar:
```jsx
// ❌ ELIMINAR: Detección de scroll
useEffect(() => {
  const handleScroll = () => {
    setShowMobileActions(window.scrollY > 100)
  }
  handleScroll()
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// ❌ ELIMINAR: Renderizado de botones mobile
<div className={`${styles.mobileActionsContainer} ${showMobileActions ? styles.visible : ''}`}>
  {/* ... botones ... */}
</div>
```

---

### 4. `src/components/vehicles/Filters/FilterFormSimple.module.css`

#### Cambios:
- **Eliminar** estilos de `.mobileActionsContainer` (líneas 539-594)
- **Eliminar** estilos de `.mobileActionButton` relacionados con fixed positioning
- **Mantener** estilos del drawer (overlay, formWrapper, etc.)

---

## 🔄 Flujo de Funcionamiento

### Mobile (Nuevo)
1. Usuario ve carrusel con botones debajo
2. Click en "Filtrar" → Abre drawer desde la derecha (igual que ahora)
3. Click en "Ordenar" → Abre SortDropdown (igual que ahora)
4. Aplicar filtros → Cierra drawer y actualiza URL (igual que ahora)

### Desktop (Sin cambios)
- Todo sigue funcionando igual

---

## ✅ Checklist de Implementación

### Fase 1: Preparación
- [ ] Crear branch de feature
- [ ] Backup de archivos actuales
- [ ] Documentar estado actual (✅ HECHO)

### Fase 2: Migración de Estilos (Simplificada)
- [ ] Modificar `Vehiculos.jsx`:
  - [x] ✅ **NO HAY CAMBIOS** - Los botones ya están correctos
- [ ] Modificar `Vehiculos.module.css`:
  - [ ] Hacer `.actionButtons` visible también en mobile (display: flex por defecto)
  - [ ] Ajustar `.actionButton` con tamaños mobile (padding, font-size, min-height)
  - [ ] Ajustar estilos desktop con @media (min-width: 769px)
  - [ ] Verificar que se vea pegado al carrusel en mobile

### Fase 3: Limpieza
- [ ] Modificar `FilterFormSimple.jsx`:
  - [ ] Eliminar `.mobileActionsContainer`
  - [ ] Eliminar lógica de scroll
  - [ ] Limpiar estados no usados (showMobileActions)
- [ ] Modificar `FilterFormSimple.module.css`:
  - [ ] Eliminar estilos de `.mobileActionsContainer`
  - [ ] Eliminar estilos de `.mobileActionButton` (si no se reutilizan)

### Fase 4: Testing
- [ ] Probar en mobile (< 768px):
  - [ ] Botones aparecen debajo del carrusel
  - [ ] Botones siempre visibles (sin scroll)
  - [ ] Click en "Filtrar" abre drawer
  - [ ] Click en "Ordenar" abre dropdown
  - [ ] Aplicar filtros funciona correctamente
- [ ] Probar en desktop (> 769px):
  - [ ] Botones mobile no aparecen
  - [ ] Botones desktop funcionan igual
- [ ] Probar en tablet (768px-769px):
  - [ ] Transición smooth entre mobile/desktop

### Fase 5: Ajustes Finales
- [ ] Revisar estilos visuales
- [ ] Ajustar padding/márgenes si es necesario
- [ ] Verificar accesibilidad (ARIA labels, focus, etc.)
- [ ] Optimizar performance si es necesario

---

## 🎨 Detalles Visuales

### Estilos Responsive para `.actionButtons`

#### Mobile (por defecto)
```css
.actionButtons {
  display: flex; /* ✅ Visible en mobile */
  gap: 12px;
  padding: 12px 16px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  border-radius: 0 0 12px 12px;
  margin-top: 0; /* Pegado al carrusel */
  align-items: center;
}

.actionButton {
  flex: 1; /* ✅ Ocupa espacio igual en mobile */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px; /* ✅ Touch-friendly */
  min-height: 44px; /* ✅ Touch-friendly mínimo */
  font-size: 0.875rem; /* ✅ Tamaño mobile */
  font-weight: 600;
  /* ... resto de estilos base igual que desktop ... */
}
```

#### Desktop (desde 769px)
```css
@media (min-width: 769px) {
  .actionButtons {
    padding: 10px 24px; /* Más padding en desktop */
    /* resto igual */
  }
  
  .actionButton {
    flex: 0 1 auto; /* ✅ Ancho natural en desktop */
    padding: 8px 16px; /* Menos padding en desktop */
    font-size: 0.9375rem; /* ✅ Tamaño desktop */
    min-height: auto; /* Sin restricción de altura */
  }
}
```

---

## 📝 Notas Adicionales

### Consideraciones
- Mantener compatibilidad con código existente
- No romper funcionalidad de desktop
- Asegurar que SortDropdown funcione correctamente en mobile (ya funciona)
- El drawer de filtros ya funciona bien, solo mover los triggers

### Posibles Mejoras Futuras
- Animación suave al aparecer botones
- Badge de contador de filtros activos en botón "Filtrar"
- Indicador visual cuando hay ordenamiento activo

---

## 🚀 Próximos Pasos

1. **Revisar este plan** y validar con el equipo/usuario
2. **Aprobar cambios** antes de implementar
3. **Crear branch** y comenzar Fase 2
4. **Testing exhaustivo** en dispositivos reales
5. **Deploy** y monitoreo

---

**Documento creado**: Fase de investigación y planificación
**Estado**: ✅ Listo para revisión y aprobación
**Próximo paso**: Revisar y aprobar antes de implementar

