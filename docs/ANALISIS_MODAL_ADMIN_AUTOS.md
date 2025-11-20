# 🎨 ANÁLISIS ESTÉTICO: Modales de Crear/Editar Autos (Admin)

**Fecha**: 2025-11-20  
**Componentes Analizados**:  
- `Dashboard.jsx` + `Dashboard.module.css`
- `CarFormRHF.jsx` + `CarFormRHF.module.css`

**Estado**: 📋 Análisis Completo para Mejoras Estéticas

---

## 📋 ÍNDICE

1. [Arquitectura Actual](#arquitectura-actual)
2. [Sistema de Colores](#sistema-de-colores)
3. [Tipografía y Espaciado](#tipografía-y-espaciado)
4. [Componentes Visuales](#componentes-visuales)
5. [Responsive Design](#responsive-design)
6. [Puntos Fuertes](#puntos-fuertes)
7. [Oportunidades de Mejora](#oportunidades-de-mejora)
8. [Comparación con Sistema de Diseño](#comparación-con-sistema-de-diseño)

---

## 1. ARQUITECTURA ACTUAL

### 📐 Estructura del Modal

```
Dashboard (modalOverlay)
  └── Modal Container (modal)
      ├── Close Button (modalCloseButton) - Top Right
      ├── Error/Success Messages
      └── Modal Body (modalBody)
          └── CarFormRHF (form)
              ├── Form Header
              ├── Sección Imágenes Principales
              ├── Sección Fotos Extras
              ├── Sección Datos del Vehículo
              └── Botones de Acción
```

### 🎭 Overlay y Modal

```css
/* Overlay */
- Position: Fixed Fullscreen
- Background: #000000 (Negro sólido) ⚠️
- Z-index: 1000
- Padding: 20px

/* Modal Container */
- Background: #f8f9fa (Gris muy claro)
- Border-radius: 12px
- Max-width: 1400px ⚠️ (Muy ancho)
- Max-height: 90vh
- Box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3)
```

**Observación**: Overlay negro sólido es muy agresivo, normalmente se usa semi-transparente.

---

## 2. SISTEMA DE COLORES

### 🎨 Paleta Principal

| Uso | Color | Código | Observación |
|-----|-------|--------|-------------|
| **Overlay** | Negro sólido | `#000000` | ⚠️ Muy oscuro |
| **Modal Background** | Gris claro | `#f8f9fa` | ✅ Neutro |
| **Form Background** | Blanco | `#ffffff` | ✅ Limpio |
| **Secciones** | Gris claro | `#f8f9fa` | ✅ Consistente |
| **Bordes** | Gris medio | `#e9ecef`, `#dee2e6` | ✅ Suaves |
| **Texto Principal** | Gris oscuro | `#2c3e50`, `#495057` | ✅ Legible |
| **Texto Secundario** | Gris medio | `#6c757d` | ✅ Jerarquía clara |

### 🔵 Botones y Acciones

| Tipo | Color | Código | Uso |
|------|-------|--------|-----|
| **Primary** | Azul | `#007bff` → `#0056b3` | Submit, Seleccionar |
| **Success** | Verde | `#28a745` → `#218838` | Restaurar, Agregar |
| **Danger** | Rojo | `#dc3545` → `#c82333` | Eliminar, Cancelar (parcial) |
| **Secondary** | Gris | `#6c757d` → `#5a6268` | Cancelar |
| **Warning** | Amarillo | `#ffc107` → `#e0a800` | (No usado actualmente) |

### 📊 Estados Visuales

```css
/* Mensajes de Error */
background: #f8d7da (Rosa claro)
color: #721c24 (Rojo oscuro)
border: #f5c6cb (Rosa)

/* Mensajes de Éxito */
background: #d4edda (Verde claro)
color: #155724 (Verde oscuro)
border: #c3e6cb (Verde)

/* Información / Hints */
background: #f8f9fa (Gris)
color: #6c757d (Gris medio)
border: #dee2e6 (Gris claro)

/* Preview de Fotos Nuevas */
background: #e7f3ff (Azul muy claro)
border: #007bff (Azul)
```

**Observación**: Paleta Bootstrap estándar - funcional pero genérica.

---

## 3. TIPOGRAFÍA Y ESPACIADO

### 📝 Tipografía

| Elemento | Font Size | Font Weight | Color | Line Height |
|----------|-----------|-------------|-------|-------------|
| **Modal Title** | 24px | 600 | `#2c3e50` | - |
| **Section Headings (h3)** | 20px | 600 | `#2c3e50` | - |
| **Subsection (h4)** | 16px | 600 | `#495057` | - |
| **Labels** | 14px | 600 | `#495057` | - |
| **Inputs** | 14px | Normal | `#2c3e50` | - |
| **Body Text** | 14px | Normal | `#6c757d` | 1.4 |
| **Small Text** | 12px | 500 | `#6c757d` | - |
| **Tiny Text** | 10-11px | Normal | `#6c757d` | - |

**Font Family**: No especificada → usa `system-ui` o fuente del navegador

**Observación**: No usa las fuentes del sistema de diseño (`--font-display`, `Barlow Condensed`).

### 📏 Espaciado

| Elemento | Padding | Margin | Gap |
|----------|---------|--------|-----|
| **Form** | 20px | - | - |
| **Form Header** | - | 0 0 20px 0 | - |
| **Image Section** | 25px | 0 0 40px 0 | - |
| **Data Section** | - | 0 0 40px 0 | - |
| **Form Grid** | - | - | 20px |
| **Image Cards** | - | - | 20px |
| **Form Group** | - | - | 8px |
| **Action Buttons** | - | - | 15px |
| **Modal Body** | 20px | - | - |

**Observación**: Espaciado consistente pero no usa variables CSS del sistema (`--spacing-X`).

---

## 4. COMPONENTES VISUALES

### 🖼️ Sección de Imágenes Principales

#### Estructura

```css
.principalImagesGrid {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.imageCard {
  width: 280px; /* Fijo */
  background: white;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.imageCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}
```

#### Características

- ✅ **Cards bien definidas** con bordes y sombras
- ✅ **Hover effects** sutiles (translate + shadow)
- ✅ **Ancho fijo** (280px) evita estiramientos
- ✅ **Preview de imagen** con placeholder 📷
- ⚠️ **Altura fija** (150px) puede recortar imágenes
- ⚠️ **Sin aspect-ratio** para mantener proporciones

---

### 📸 Sección de Fotos Extras

#### Fotos Existentes (Modo Edit)

```css
.existingPhotosGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.existingPhotoCard {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.existingPhotoImg {
  width: 100%;
  height: 80px;
  object-fit: cover;
}
```

**Características**:
- ✅ Grid responsive con auto-fill
- ✅ Thumbnails pequeños (80px alto)
- ✅ Botón eliminar individual
- ✅ Muestra public_id (últimos 8 chars)
- ✅ Estado "eliminada" visual con borde rojo punteado

#### Input Múltiple

```css
.multipleInputUI {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 14px; /* Reducido */
  border: 2px dashed #007bff;
  border-radius: 6px;
  background: #f8f9fa;
  max-width: 250px; /* Compacto */
  margin: 0 auto;
}

.multipleInputIcon {
  font-size: 18px;
  color: #007bff;
}

.multipleInputText {
  font-size: 12px;
  font-weight: 600;
}
```

**Características**:
- ✅ **Compacto** (max-width 250px, centrado)
- ✅ **Borde punteado** indica drop zone
- ✅ **Hover effects** (transform, shadow, bg color)
- ✅ **Preview grid** de archivos nuevos seleccionados
- ⚠️ Usa emoji 📁 como ícono

---

### 📝 Sección de Datos del Vehículo

#### Grid de Formulario

```css
.formGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

#### Inputs

```css
.input, .textarea {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  background: #f8f9fa;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.input:hover {
  border-color: #6c757d;
  background: #e9ecef;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  background: #ffffff;
}
```

**Características**:
- ✅ **Fondo gris** por defecto, blanco en focus
- ✅ **Bordes gruesos** (2px) visibles
- ✅ **Focus ring** con box-shadow azul
- ✅ **Hover states** cambio de color sutil
- ✅ **Placeholder** con opacity 0.8
- ⚠️ No usa variables CSS del sistema

---

### 🔘 Botones de Acción

#### Submit Button

```css
.submitButton {
  padding: 14px 32px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
}

.submitButton:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.submitButton:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.7;
}
```

**Características**:
- ✅ **Gradiente azul** llamativo
- ✅ **Hover effect** con transform + shadow
- ✅ **Estado disabled** claro
- ✅ **Padding generoso** (14px 32px)
- ⚠️ Gradiente no es estándar en el resto del sitio

#### Cancel Button

```css
.cancelButton {
  padding: 14px 32px;
  background: #6c757d; /* Gris plano */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.cancelButton:hover {
  background: #5a6268;
}
```

**Características**:
- ✅ **Gris neutro** sin gradiente
- ✅ **Mismo tamaño** que submit
- ✅ **Hover sutil**
- ⚠️ Contraste con submit es muy fuerte

---

### ❌ Botón de Cerrar Modal

```css
.modalCloseButton {
  position: absolute;
  top: 10px;
  right: 15px;
  background: #6c757d;
  border: 2px solid #495057;
  color: white;
  font-size: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  z-index: 1001;
  transition: all 0.2s ease;
}

.modalCloseButton:hover {
  background: #495057;
  transform: scale(1.05);
}
```

**Características**:
- ✅ **Posición absoluta** top-right
- ✅ **Icono ✕** claro
- ✅ **Hover scale** sutil
- ⚠️ Color gris puede confundirse con disabled
- ⚠️ Tamaño pequeño (30x30px)

---

## 5. RESPONSIVE DESIGN

### 📱 Breakpoints

| Breakpoint | Target | Cambios Principales |
|------------|--------|---------------------|
| **< 480px** | Mobile Small | Padding reducido, margin reducido |
| **< 768px** | Mobile/Tablet | Grid → 1 columna, flex → column, input múltiple full-width |
| **≥ 768px** | Desktop | Grid 2-3 columnas, layout horizontal |

### 🔄 Adaptaciones Mobile

```css
@media (max-width: 768px) {
  /* Form */
  .form {
    padding: 15px;
    margin: 10px;
  }
  
  /* Imágenes principales */
  .principalImagesGrid {
    flex-direction: column;
    gap: 15px;
  }
  
  .imageCard {
    width: 100%;
    max-width: 400px;
    align-self: center;
  }
  
  /* Grid de datos */
  .formGrid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  /* Botón submit full-width */
  .submitButton {
    width: 100%;
    padding: 16px;
  }
  
  /* Input múltiple */
  .multipleInputUI {
    max-width: 100%;
    padding: 10px 12px;
  }
}
```

**Características**:
- ✅ **Mobile-first approach** parcial
- ✅ **Columnas únicas** en mobile
- ✅ **Botones full-width** en mobile
- ✅ **Padding reducido** progresivamente
- ⚠️ Modal puede ser difícil de usar en mobile (mucho contenido)

---

## 6. PUNTOS FUERTES

### ✅ Funcionalidad

1. **Arquitectura sólida**
   - Reducer pattern para estado de imágenes
   - React Hook Form para validación
   - Separación clara entre crear/editar

2. **Manejo de imágenes avanzado**
   - Preview inmediato con Object URLs
   - Distinción entre fotos existentes/nuevas/eliminadas
   - Input múltiple para fotos extras
   - Validación de formato y tamaño

3. **Feedback visual claro**
   - Estados hover bien definidos
   - Mensajes de error específicos por campo
   - Loading states (disabled buttons)
   - Placeholders informativos

4. **Responsive bien implementado**
   - Breakpoints razonables
   - Adaptación de grid a columna única
   - Botones full-width en mobile

### ✅ UI/UX

1. **Jerarquía visual clara**
   - Secciones bien delimitadas
   - Headings consistentes
   - Espaciado uniforme

2. **Interactividad**
   - Hover effects en cards, buttons, inputs
   - Focus states con box-shadow
   - Transform animations sutiles

3. **Accesibilidad básica**
   - Labels asociados a inputs
   - Placeholders descriptivos
   - Colores con contraste suficiente (mayormente)

---

## 7. OPORTUNIDADES DE MEJORA

### 🎨 Diseño Visual

#### 1. **Overlay Agresivo**

**Problema**:
```css
.modalOverlay {
  background: #000000; /* Negro sólido al 100% */
}
```

**Sugerencia**:
```css
.modalOverlay {
  background: rgba(0, 0, 0, 0.7); /* Negro semi-transparente */
  backdrop-filter: blur(4px); /* Efecto glassmorphism */
}
```

**Beneficio**: Menos agresivo, más moderno, mantiene contexto.

---

#### 2. **Modal Muy Ancho**

**Problema**:
```css
.modal {
  max-width: 1400px; /* Demasiado ancho */
}
```

**Sugerencia**:
```css
.modal {
  max-width: 1200px; /* Más contenido, mejor lectura */
}
```

**Beneficio**: Mejor densidad de información, menos scroll horizontal innecesario.

---

#### 3. **Botón Cerrar Pequeño**

**Problema**:
```css
.modalCloseButton {
  width: 30px;
  height: 30px;
  font-size: 20px;
  background: #6c757d; /* Gris apagado */
}
```

**Sugerencia**:
```css
.modalCloseButton {
  width: 40px;
  height: 40px;
  font-size: 24px;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: rgba(255, 255, 255, 0.9);
}

.modalCloseButton:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: white;
  color: white;
}
```

**Beneficio**: Más fácil de clickear (móvil), más visible, más moderno.

---

#### 4. **Inputs con Fondo Gris**

**Problema**:
```css
.input {
  background: #f8f9fa; /* Gris por defecto */
}
```

**Sugerencia**: Dos opciones

**Opción A (Mantener gris)**:
```css
.input {
  background: #ffffff; /* Blanco siempre */
  border: 1px solid #dee2e6; /* Borde más fino */
}

.input:hover {
  border-color: #adb5bd;
}

.input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1);
}
```

**Opción B (Outlined style)**:
```css
.input {
  background: transparent;
  border: 2px solid #dee2e6;
  border-radius: 8px;
}

.input:focus {
  border-color: #007bff;
  background: rgba(0, 123, 255, 0.02);
}
```

**Beneficio**: Inputs más limpios y modernos, mejor contraste.

---

#### 5. **Botón Submit con Gradiente Único**

**Problema**: El gradiente azul no se usa en ningún otro lugar del sitio.

**Sugerencia**: Alinear con el sistema de diseño

```css
.submitButton {
  padding: 14px 32px;
  background: var(--color-brand-600); /* #003d7a */
  color: white;
  border: none;
  border-radius: var(--border-radius-lg);
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 61, 122, 0.25);
}

.submitButton:hover {
  background: var(--color-brand-500); /* #0055A4 */
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 85, 164, 0.35);
}
```

**Beneficio**: Consistencia con el resto del sitio (botones de "Ver todos", Postventa, etc.)

---

#### 6. **Sin Uso de Variables CSS del Sistema**

**Problema**: No usa `--spacing-X`, `--color-X`, `--font-display`, etc.

**Sugerencia**: Migrar a variables del sistema

```css
/* ANTES */
padding: 20px;
color: #2c3e50;
font-size: 14px;
gap: 20px;

/* DESPUÉS */
padding: var(--spacing-5);
color: var(--color-text-primary);
font-size: var(--font-size-sm);
gap: var(--spacing-5);
```

**Beneficio**: Consistencia global, fácil mantenimiento, theming futuro.

---

### 🎯 Mejoras de UX

#### 7. **Sección de Imágenes Muy Grande**

**Problema**: Las secciones de imágenes ocupan mucho espacio vertical.

**Sugerencia**: Tabs o Accordion

```jsx
<Tabs defaultValue="principales">
  <TabsList>
    <Tab value="principales">Fotos Principales *</Tab>
    <Tab value="extras">Fotos Extras</Tab>
  </TabsList>
  
  <TabsContent value="principales">
    {/* Grid de fotos principales */}
  </TabsContent>
  
  <TabsContent value="extras">
    {/* Input múltiple y grid de extras */}
  </TabsContent>
</Tabs>
```

**Beneficio**: Reduce scroll, organiza mejor, más limpio.

---

#### 8. **Sin Indicadores de Progreso**

**Problema**: No hay feedback visual durante el upload/submit.

**Sugerencia**: Progress indicators

```jsx
{isLoading && (
  <div className={styles.uploadProgress}>
    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${progress}%` }} />
    </div>
    <p>Subiendo imágenes... {progress}%</p>
  </div>
)}
```

**Beneficio**: Usuario sabe que algo está pasando, reduce ansiedad.

---

#### 9. **Validación Solo al Submit**

**Problema**: Errores solo aparecen al enviar el formulario completo.

**Sugerencia**: Validación en tiempo real (opcional)

```jsx
// Con React Hook Form
{...register('marca', { 
  required: 'Marca es requerida',
  onBlur: (e) => trigger('marca') // Validar al salir del campo
})}
```

**Beneficio**: Feedback inmediato, menos frustraciones.

---

### 🚀 Mejoras de Performance

#### 10. **Object URLs No Limpiados**

**Problema Potencial**: Si el usuario selecciona muchas imágenes sin enviar.

**Actual**:
```jsx
useEffect(() => {
  return () => {
    cleanupObjectUrls()
  }
}, [cleanupObjectUrls])
```

**Sugerencia**: Mejorado ✅ (Ya está implementado correctamente)

---

### ♿ Mejoras de Accesibilidad

#### 11. **Labels No Asociados Visualmente**

**Problema**: `htmlFor` no está presente en algunos labels.

**Sugerencia**:
```jsx
<label htmlFor="marca-input" className={styles.label}>
  Marca *
</label>
<input
  id="marca-input"
  {...register('marca')}
/>
```

**Beneficio**: Screen readers, mejor UX, clickear label enfoca input.

---

#### 12. **Sin Aria Labels en Botones de Imagen**

**Problema**: Botones de eliminar/restaurar sin contexto.

**Sugerencia**:
```jsx
<button
  type="button"
  onClick={() => removeImage(field)}
  className={styles.removeButton}
  aria-label={`Eliminar ${field === 'fotoPrincipal' ? 'foto principal' : 'foto hover'}`}
>
  🗑️ Eliminar
</button>
```

**Beneficio**: Accesibilidad para screen readers.

---

## 8. COMPARACIÓN CON SISTEMA DE DISEÑO

### 🎨 Variables CSS Disponibles (No Usadas)

| Variable | Valor | Usado en Modal |
|----------|-------|----------------|
| `--color-brand-600` | `#003d7a` | ❌ No |
| `--color-brand-500` | `#0055A4` | ❌ No |
| `--font-display` | `'Barlow Condensed'` | ❌ No |
| `--spacing-1` a `--spacing-6` | `0.25rem` - `1.5rem` | ❌ No |
| `--border-radius-lg` | `12px` | ✅ Parcial (8px usado) |
| `--shadow-lg` | Predefinida | ❌ No |
| `--transition-fast` | `0.15s ease` | ❌ No |
| `--color-text-primary` | `var(--color-neutral-900)` | ❌ No |
| `--color-text-inverse` | `var(--color-white)` | ❌ No |

### 📊 Análisis de Consistencia

| Aspecto | Home/Postventa | Modal Admin | Consistente |
|---------|----------------|-------------|-------------|
| **Colores de marca** | `#003d7a`, `#0055A4` | `#007bff`, `#0056b3` | ❌ No |
| **Fuente display** | `Barlow Condensed` | Sistema | ❌ No |
| **Border radius** | `12px` (`--lg`) | `8px`, `12px` mixto | ⚠️ Parcial |
| **Espaciado** | Variables `--spacing-X` | Hardcoded `20px`, `15px` | ❌ No |
| **Sombras** | Variables `--shadow-X` | Hardcoded | ❌ No |
| **Transiciones** | `--transition-fast` | `0.3s ease` hardcoded | ❌ No |
| **Botones** | Estilo consistente | Gradiente único | ❌ No |

**Conclusión**: El modal admin está **desconectado del sistema de diseño** del resto del sitio.

---

## 📝 RESUMEN EJECUTIVO

### ✅ Lo Que Funciona Bien

1. ✅ **Funcionalidad robusta** con manejo avanzado de imágenes
2. ✅ **Arquitectura sólida** con reducers y React Hook Form
3. ✅ **Responsive design** funcional
4. ✅ **Feedback visual** claro (hover, focus, errors)
5. ✅ **UI limpia** y organizada

### ⚠️ Principales Oportunidades

1. 🎨 **Inconsistencia visual** con el resto del sitio
2. 🎨 **No usa variables CSS** del sistema de diseño
3. 🎨 **Overlay negro sólido** muy agresivo
4. 🎨 **Botón cerrar pequeño** y difícil de ver
5. 🎨 **Modal muy ancho** (1400px)
6. 🎯 **Sin indicadores de progreso** durante uploads
7. ♿ **Accesibilidad mejorable** (aria-labels, associations)

### 📊 Score General

| Aspecto | Puntuación | Comentario |
|---------|------------|------------|
| **Funcionalidad** | 9/10 | Muy completo y robusto |
| **UI/UX** | 7/10 | Funcional pero mejorable |
| **Consistencia** | 4/10 | Desconectado del sistema de diseño |
| **Responsive** | 8/10 | Bien implementado |
| **Accesibilidad** | 6/10 | Básica, necesita mejoras |
| **Performance** | 8/10 | Optimizaciones presentes |
| **Mantenibilidad** | 6/10 | Hardcoded values dificultan cambios |

**TOTAL**: **6.9/10** - Funcional pero necesita integración con el sistema de diseño.

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### Fase 1: Integración Visual (Prioridad ALTA)
1. Migrar colores a variables del sistema
2. Usar `--font-display` para headings y botones
3. Cambiar overlay a semi-transparente
4. Alinear botones con estilo del sitio (como Postventa)

### Fase 2: Mejoras UX (Prioridad MEDIA)
5. Mejorar botón de cerrar (más grande, más visible)
6. Reducir max-width del modal a 1200px
7. Agregar indicadores de progreso
8. Implementar tabs para secciones de imágenes (opcional)

### Fase 3: Refinamiento (Prioridad BAJA)
9. Mejorar accesibilidad (aria-labels, associations)
10. Validación en tiempo real (opcional)
11. Animaciones de entrada/salida del modal
12. Dark mode support (futuro)

---

**Documento generado**: 2025-11-20  
**Próxima revisión**: Después de implementar cambios de Fase 1  
**Autor**: Análisis de sistema de diseño Indiana Usados

