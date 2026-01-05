# Auditoría Visual Real - CTAs Filtros (Diagnóstico Técnico)

## Resumen

Diagnóstico técnico para identificar por qué los CTAs de filtros no reflejan visualmente el uso de `var(--color-brand-500)` pese a estar definidos en CSS.

**Fecha:** 2024  
**Tipo:** Auditoría técnica (sin modificaciones)  
**Componente:** FilterFormSimple

---

## 1. IDENTIFICACIÓN EN JSX

### 1.1. Desktop (min-width: 769px)

**Botón visible:** Línea 344 de `FilterFormSimple.jsx`

```jsx
<button type="submit" className={styles.applyButton} disabled={isLoading || isSubmitting}>
  {isSubmitting ? 'Aplicando...' : 'Aplicar'}
</button>
```

**Contexto:**
- Ubicación: Dentro de `.titleActions` (línea 337)
- Estructura: `.formTitle > .titleActions > button.applyButton`
- Condición de render: Desktop (`!isMobile && isVisibleDesktop`)

**ClassName aplicado:**
- `styles.applyButton` → `.applyButton` (CSS Module)

---

### 1.2. Mobile (max-width: 768px)

**Botón visible:** Línea 355 de `FilterFormSimple.jsx`

```jsx
<button type="submit" className={styles.applyButton} disabled={isLoading || isSubmitting}>
  Aplicar
</button>
```

**Contexto:**
- Ubicación: Dentro de `.mobileButtons` (línea 351)
- Estructura: `.mobileButtons > button.applyButton`
- Condición de render: Mobile (`isMobile`)

**Nota:** Hay otro botón `.applyButton` en `.titleActions` (línea 344) pero está oculto en mobile con `display: none` (línea 386 del CSS).

**ClassName aplicado:**
- `styles.applyButton` → `.applyButton` (CSS Module)
- Contexto CSS: `.mobileButtons .applyButton` (mayor especificidad en media query)

---

## 2. AUDITORÍA CSS EFECTIVO

### 2.1. Selector Base: `.applyButton`

**Archivo:** `FilterFormSimple.module.css`  
**Líneas:** 221-227

```css
.applyButton {
  composes: buttonBase;
  /* ✅ Migrado: CTA principal → color de marca según sistema */
  background-color: var(--color-brand-500);
  color: #ffffff;
  border-color: var(--color-brand-500);
}
```

**Especificidad:** `(0,1,0)` - Clase simple

**Estado:** ✅ Definido correctamente

---

### 2.2. Selector Hover: `.applyButton:hover:not(:disabled)`

**Archivo:** `FilterFormSimple.module.css`  
**Línea:** 230

```css
.applyButton:hover:not(:disabled) { 
  background-color: var(--color-brand-600); 
  border-color: var(--color-brand-600); 
  transform: translateY(-1px); 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
}
```

**Especificidad:** `(0,2,0)` - Clase + pseudo-clase

**Estado:** ✅ Definido correctamente

---

### 2.3. Selector Active: `.applyButton:active:not(:disabled)`

**Archivo:** `FilterFormSimple.module.css`  
**Línea:** 237

```css
.applyButton:active:not(:disabled),
.clearButton:active:not(:disabled) { 
  transform: translateY(0); 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}
```

**Especificidad:** `(0,2,0)`

**Estado:** ⚠️ **NO define background-color** - El background del hover se mantiene (correcto)

---

### 2.4. Selector Disabled: `.applyButton:disabled`

**Archivo:** `FilterFormSimple.module.css`  
**Línea:** 244

```css
.applyButton:disabled,
.clearButton:disabled { 
  opacity: 0.6; 
  cursor: not-allowed; 
  transform: none; 
  box-shadow: none; 
}
```

**Especificidad:** `(0,1,1)` - Clase + pseudo-clase

**Estado:** ⚠️ **NO define background-color** - Usa `opacity: 0.6` (correcto, mantiene el color base)

---

### 2.5. Selector Desktop: `.titleActions .applyButton`

**Archivo:** `FilterFormSimple.module.css`  
**Línea:** 386-387

```css
@media (max-width: 768px) {
  .titleActions .applyButton,
  .titleActions .clearButton { 
    display: none; 
  }
}
```

**Especificidad:** `(0,2,0)` - Dos clases

**Estado:** ⚠️ **Solo oculta en mobile** - No define background en desktop

**Problema detectado:** En **DESKTOP**, el selector `.titleActions .applyButton` tiene mayor especificidad (`0,2,0`) que `.applyButton` (`0,1,0`), pero **NO tiene regla de background** en la media query desktop. Sin embargo, esto no debería ser un problema porque CSS funciona por cascada - si no hay regla más específica, se aplica la menos específica.

**Revisando media query desktop:**
```css
@media (min-width: 769px) {
  .rangesSection,
  .selectsSection { grid-template-columns: repeat(3, 1fr); }
  .formWrapper { width: 90%; max-width: 700px; }
  .filterContainer { margin-top: 2rem; }
  .mobileButtons,
  .mobileActionsContainer { display: none; }
}
```

✅ **No hay regla específica para `.titleActions .applyButton` en desktop** - El selector base `.applyButton` debería aplicarse.

---

### 2.6. Selector Mobile: `.mobileButtons .applyButton`

**Archivo:** `FilterFormSimple.module.css`  
**Líneas:** 408-411

```css
@media (max-width: 768px) {
  .mobileButtons .applyButton { 
    background-color: var(--color-brand-500); 
    color: #ffffff; 
    border: 1px solid var(--color-brand-500); 
  }
  .mobileButtons .applyButton:hover { 
    background-color: var(--color-brand-600); 
  }
}
```

**Especificidad:** `(0,2,0)` - Dos clases (mayor que `.applyButton`)

**Estado:** ✅ Definido correctamente en mobile

---

### 2.7. Selector Touch Devices: `@media (hover: none)`

**Archivo:** `FilterFormSimple.module.css`  
**Línea:** 474-476

```css
@media (hover: none) and (pointer: coarse) {
  .applyButton:hover:not(:disabled),
  .clearButton:hover:not(:disabled),
  .filterButtonMobile:hover { 
    transform: none; 
  }
}
```

**Estado:** ⚠️ Solo anula `transform`, **NO anula background-color** - Correcto

---

## 3. ANÁLISIS DE ESPECIFICIDAD

### Cascada CSS para `.applyButton` en Desktop

**Selector aplicado:** `.titleActions .applyButton` (desde JSX)

**Reglas CSS disponibles:**
1. `.applyButton` (línea 221) - Especificidad: `(0,1,0)`
   - `background-color: var(--color-brand-500)` ✅
   
2. `.titleActions .applyButton` - Especificidad: `(0,2,0)`
   - **NO tiene regla de background en desktop** ⚠️
   - Solo tiene `display: none` en mobile (línea 386)

**Resultado esperado:** El selector base `.applyButton` debería aplicarse porque `.titleActions .applyButton` no sobrescribe `background-color` en desktop.

---

### Cascada CSS para `.applyButton` en Mobile

**Selector aplicado:** `.mobileButtons .applyButton` (desde JSX)

**Reglas CSS disponibles:**
1. `.applyButton` (línea 221) - Especificidad: `(0,1,0)`
   - `background-color: var(--color-brand-500)` ✅
   
2. `.mobileButtons .applyButton` (línea 409) - Especificidad: `(0,2,0)`
   - `background-color: var(--color-brand-500)` ✅ (dentro de media query mobile)

**Resultado esperado:** El selector más específico `.mobileButtons .applyButton` debería aplicarse y sobrescribir el base (aunque tienen el mismo valor).

---

## 4. PROBLEMA DETECTADO

### Hipótesis Principal

**El selector `.titleActions .applyButton` en DESKTOP no tiene regla de background**, pero esto **NO debería ser un problema** porque CSS funciona por cascada - si no hay regla más específica que sobrescriba, se aplica la menos específica.

**Sin embargo**, si el botón se ve negro en desktop, puede ser por:

1. **Especificidad insuficiente en desktop:** El selector `.titleActions .applyButton` tiene mayor especificidad (`0,2,0`) pero no define background. Sin embargo, esto debería hacer que se aplique el selector base `.applyButton`.

2. **Problema con `composes: buttonBase`:** El `composes` de CSS Modules puede estar causando que se genere un orden de clases diferente. Revisando `buttonBase`:

```css
.buttonBase {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  text-decoration: none;
  min-height: 2rem;
}
```

`buttonBase` no define background, así que no debería interferir.

---

## 5. CONFIRMACIÓN DEL SELECTOR FINAL

### Desktop (min-width: 769px)

**Selector que aplica el color visible:**
- **Esperado:** `.applyButton` (línea 221)
- **Clases CSS generadas:** Probablemente `.FilterFormSimple_module_applyButton__[hash]`
- **Archivo:** `FilterFormSimple.module.css` línea 224
- **Regla:** `background-color: var(--color-brand-500);`

**Si el color visible es NEGRO en lugar de AZUL:**
- **Causa probable:** El selector `.titleActions .applyButton` tiene mayor especificidad pero no define background. Sin embargo, esto no debería causar que se vea negro a menos que haya una regla más específica en otro lugar.

---

### Mobile (max-width: 768px)

**Selector que aplica el color visible:**
- **Esperado:** `.mobileButtons .applyButton` (línea 409)
- **Clases CSS generadas:** Probablemente `.FilterFormSimple_module_mobileButtons__[hash] .FilterFormSimple_module_applyButton__[hash]`
- **Archivo:** `FilterFormSimple.module.css` línea 409
- **Regla:** `background-color: var(--color-brand-500);` (dentro de `@media (max-width: 768px)`)

**Si el color visible es NEGRO en lugar de AZUL:**
- **Causa probable:** El selector está correctamente definido, pero puede haber un problema con el orden de las reglas CSS o con CSS Modules.

---

## 6. DIAGNÓSTICO FINAL

### Problema Identificado

**El CSS está correctamente definido, pero puede haber un problema de especificidad en DESKTOP.**

**Desktop:**
- El botón está dentro de `.titleActions`
- El selector `.titleActions .applyButton` tiene mayor especificidad (`0,2,0`) que `.applyButton` (`0,1,0`)
- **PERO** `.titleActions .applyButton` solo tiene `display: none` en mobile, no tiene regla de background en desktop
- **Resultado esperado:** El selector base `.applyButton` debería aplicarse (cascada CSS)

**Mobile:**
- El botón está dentro de `.mobileButtons`
- El selector `.mobileButtons .applyButton` tiene mayor especificidad y define `background-color: var(--color-brand-500)`
- **Resultado esperado:** El selector específico debería aplicarse correctamente

---

## 7. PROPUESTA MÍNIMA Y SEGURA PARA CORREGIR

### Opción 1: Agregar regla específica en desktop (RECOMENDADA)

**Archivo:** `FilterFormSimple.module.css`  
**Ubicación:** Dentro de `@media (min-width: 769px)` (línea 293)

```css
@media (min-width: 769px) {
  /* ... código existente ... */
  
  /* ✅ Asegurar color de marca en desktop */
  .titleActions .applyButton {
    background-color: var(--color-brand-500);
    border-color: var(--color-brand-500);
  }
  
  .titleActions .applyButton:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    border-color: var(--color-brand-600);
  }
}
```

**Justificación:**
- Asegura que el selector más específico (`.titleActions .applyButton`) tenga la regla explícita
- Mantiene coherencia con el patrón usado en mobile
- Es seguro (no afecta otros elementos)
- Es mínimo (solo agrega reglas específicas donde se necesitan)

---

### Opción 2: Eliminar especificidad innecesaria (ALTERNATIVA)

Cambiar la estructura JSX para que el botón no esté dentro de `.titleActions` en desktop, pero esto requeriría cambios en JSX (prohibido en esta fase).

---

## 8. CONCLUSIÓN

### Selector Exacto que Pinta el Botón Visible

**Desktop:**
- **Selector esperado:** `.applyButton` (línea 221)
- **Selector real (si hay problema):** `.titleActions .applyButton` sin regla de background (fallback a cascada)

**Mobile:**
- **Selector real:** `.mobileButtons .applyButton` (línea 409) - Correctamente definido

### Motivo Concreto por el Cual No Se Ve el Azul

**Hipótesis más probable:**
1. En desktop, el selector `.titleActions .applyButton` tiene mayor especificidad pero no define background explícitamente. Aunque CSS debería aplicar el selector base por cascada, puede haber un problema con el orden de generación de CSS Modules.

2. **Solución:** Agregar regla explícita `.titleActions .applyButton` dentro de la media query desktop para asegurar que el color se aplique con la especificidad correcta.

### Propuesta Mínima y Segura

**Agregar reglas específicas en media query desktop para `.titleActions .applyButton`** (Opción 1 arriba).

---

**Fin de la auditoría técnica**

