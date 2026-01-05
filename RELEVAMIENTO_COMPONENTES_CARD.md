# Relevamiento Técnico: Componentes Card

## Objetivo

Recolectar información detallada sobre todos los componentes tipo "Card" para preparar la migración hacia el sistema de tokens de color, sin modificar código.

---

## Componentes Card Identificados

### Lista de Componentes Candidatos

1. **CardAuto** - Card principal de vehículos usados
2. **CardAutoCompact** - Card compacta de vehículos (alternativa)
3. **ModelCard** - Card de modelos 0km
4. **PostventaServiceCard** - Card de servicios postventa
5. **ServiceCard** - Card genérica de servicios (ya migrado parcialmente)
6. **CardDetalle** - NO considerado (componente de detalle, no card tradicional)

---

## Análisis Detallado por Componente

### 1. CardAuto

**Archivos:**
- Componente: `src/components/vehicles/Card/CardAuto/CardAuto.jsx`
- Estilos: `src/components/vehicles/Card/CardAuto/CardAuto.module.css` (380 líneas)

**Contexto de Uso:**
- **Ubicación principal:** Página `/vehiculos` (listado de vehículos)
- **Contexto visual:** **FONDO OSCURO** (sección `.vehiclesGrid` con `background: #0a0d14`)
- **Frecuencia de uso:** Alta (componente principal del listado)

**Colores Utilizados:**

#### Fondos
- ✅ `background: var(--color-white)` - Fondo de card (línea 25, 83)
- ✅ `background: var(--color-neutral-50)` - Placeholder de imagen (línea 56)

#### Textos
- ✅ `color: var(--color-text-primary)` - Títulos principales (marca, modelo, valores) - líneas 152, 179, 264
- ✅ `color: var(--color-neutral-400)` - Separadores (línea 161)
- ✅ `color: var(--color-neutral-500)` - Versión y labels (líneas 170, 194, 252, 303)
- ✅ `color: var(--color-neutral-600)` - Label de precio (línea 303)
- ✅ `color: var(--color-brand-500)` - Precio (línea 325) - ✅ Token de marca usado correctamente

#### Bordes
- ⚠️ `border: 0.5px solid rgba(255, 255, 255, 0.05)` - Borde card (línea 28) - **HARDCODED**
- ⚠️ `border-color: rgba(255, 255, 255, 0.1)` - Borde hover (línea 39) - **HARDCODED**
- ✅ `border-top: 1px solid var(--color-neutral-200)` - Divisor de precio (línea 285)

#### Sombras
- ⚠️ `box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.05)` - Sombra card (línea 29) - **HARDCODED** (múltiples rgba blancos)
- ⚠️ `box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.15), 0 4px 10px rgba(255, 255, 255, 0.08)` - Sombra hover (línea 40) - **HARDCODED**

#### Estados Hover
- Efecto glow blanco en bordes y sombras (hardcoded rgba blancos)
- Transform: translateY(-4px)
- Zoom imagen: scale(1.03)

**Resumen de Uso de Tokens:**
- ✅ **Bien usado:** Fondos (white, neutral-50), textos (text-primary, neutral-*), bordes (neutral-200), marca (brand-500)
- ⚠️ **Hardcoded:** Bordes blancos con alpha (rgba(255,255,255,*)), sombras blancas con alpha
- 📊 **Porcentaje variables:** ~70% (mayoría usa variables, solo bordes/sombras hardcoded)

**Decisión de Diseño Requerida:**
- Los bordes y sombras blancos con alpha están diseñados específicamente para verse sobre fondo oscuro (#0a0d14). ¿Mantener como está o crear tokens para "bordes/sombras sobre fondo oscuro"?

---

### 2. CardAutoCompact

**Archivos:**
- Componente: `src/components/vehicles/Card/CardAutoCompact/CardAutoCompact.module.css`
- Estilos: `src/components/vehicles/Card/CardAutoCompact/CardAutoCompact.module.css` (251 líneas)

**Contexto de Uso:**
- **Ubicación:** Alternativa a CardAuto (uso específico no identificado claramente)
- **Contexto visual:** **FONDO CLARO** (fondos claros: #fafafa, #f9fafb, #ffffff)
- **Frecuencia de uso:** Baja (componente alternativo)

**Colores Utilizados:**

#### Fondos
- ❌ `background: #fafafa` - Fondo card (línea 21) - **HARDCODED**
- ❌ `background: #f9fafb` - Placeholder imagen (línea 41) - **HARDCODED**
- ❌ `background: #ffffff` - Body (línea 81) - **HARDCODED**
- ❌ `background: #111827` - Contenedor precio (línea 138) - **HARDCODED** (gris muy oscuro)

#### Textos
- ❌ `color: #111827` - Título (línea 119) - **HARDCODED**
- ❌ `color: #6b7280` - Labels e iconos (líneas 189, 204) - **HARDCODED**
- ❌ `color: #374151` - Valores e iconos hover (líneas 197, 216) - **HARDCODED**
- ❌ `color: #ffffff` - Precio (línea 150) - **HARDCODED**

#### Bordes
- ❌ `border: 1px solid #e5e7eb` - Borde card (línea 24) - **HARDCODED**
- ❌ `border: 0.5px solid #6b7280` - Borde header (línea 90) - **HARDCODED**
- ❌ `border-inline: 1px solid #e5e7eb` - Bordes internos (línea 180) - **HARDCODED**

#### Sombras
- ❌ `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)` - Sombra card (línea 25) - **HARDCODED**
- ❌ `box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15)` - Sombra hover (línea 34) - **HARDCODED**
- ❌ `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)` - Sombra header (línea 93) - **HARDCODED**
- ❌ `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)` - Sombra precio (línea 144) - **HARDCODED**

**Resumen de Uso de Tokens:**
- ❌ **Prácticamente todo hardcoded:** No usa variables CSS
- 📊 **Porcentaje variables:** ~0% (solo usa variables para breakpoints)

**Decisión de Diseño Requerida:**
- Este componente requiere migración completa. Todos los valores tienen equivalentes en el sistema de tokens.

---

### 3. ModelCard

**Archivos:**
- Componente: `src/components/ModelCard/ModelCard.jsx`
- Estilos: `src/components/ModelCard/ModelCard.module.css` (143 líneas)

**Contexto de Uso:**
- **Ubicación:** Página `/0km` (listado de modelos 0km)
- **Contexto visual:** **FONDO CLARO** (fondo blanco)
- **Frecuencia de uso:** Media (usado en sección 0km)

**Colores Utilizados:**

#### Fondos
- ✅ `background: var(--color-white)` - Fondo card (línea 14)
- ⚠️ `background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)` - Placeholder imagen (línea 52) - **HARDCODED** (gradiente)

#### Textos
- ✅ `color: var(--color-text-primary)` - Título (línea 82)

#### Bordes
- ⚠️ `border: 1px solid rgba(0, 0, 0, 0.08)` - Borde card (línea 22) - **HARDCODED**
- ⚠️ `border-color: rgba(0, 0, 0, 0.12)` - Borde hover (línea 38) - **HARDCODED**

#### Sombras
- ⚠️ `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)` - Sombra hover (línea 37) - **HARDCODED**

**Resumen de Uso de Tokens:**
- ✅ **Bien usado:** Fondos principales (white), textos (text-primary)
- ⚠️ **Hardcoded:** Gradiente placeholder, bordes con alpha, sombras
- 📊 **Porcentaje variables:** ~50%

**Decisión de Diseño Requerida:**
- Gradiente placeholder: ¿Crear token o mantener como está (específico del componente)?
- Bordes/sombras: Migrar a tokens de bordes (border, border-subtle)

---

### 4. PostventaServiceCard

**Archivos:**
- Componente: `src/components/PostventaServiceCard/PostventaServiceCard.jsx`
- Estilos: `src/components/PostventaServiceCard/PostventaServiceCard.module.css` (131 líneas)

**Contexto de Uso:**
- **Ubicación:** Página `/postventa` (listado de servicios)
- **Contexto visual:** **FONDO CLARO** (fondo blanco)
- **Frecuencia de uso:** Media (usado en sección postventa)

**Colores Utilizados:**

#### Fondos
- ✅ `background: var(--color-white)` - Fondo card (línea 15)
- ✅ `background: var(--color-neutral-50)` - Placeholder imagen (línea 35)

#### Textos
- ✅ `color: var(--color-text-primary)` - Título (línea 62)
- ✅ `color: var(--color-neutral-700)` - Descripción (línea 73)

#### Bordes
- ✅ No tiene bordes visibles (usa sombras)

#### Sombras
- ✅ `box-shadow: var(--shadow-md)` - Sombra card (línea 18)
- ✅ `box-shadow: var(--shadow-lg)` - Sombra hover (línea 26)

**Resumen de Uso de Tokens:**
- ✅ **Excelente:** Usa tokens semánticos correctamente
- 📊 **Porcentaje variables:** ~100% (todos los colores usan tokens)

**Decisión de Diseño Requerida:**
- ✅ **Ninguna** - Este componente ya está completamente migrado. Es el mejor ejemplo de uso correcto de tokens.

---

### 5. ServiceCard

**Archivos:**
- Componente: `src/components/ServiceCard/ServiceCard.jsx`
- Estilos: `src/components/ServiceCard/ServiceCard.module.css` (389 líneas)

**Contexto de Uso:**
- **Ubicación:** Página `/nosotros` (sección de servicios)
- **Contexto visual:** **FONDO CLARO** (fondo blanco)
- **Frecuencia de uso:** Media (usado en sección nosotros)
- **Estado:** ✅ Ya migrado parcialmente (--color-black → text-primary, neutral-900)

**Colores Utilizados:**

#### Fondos
- ✅ `background: var(--color-white)` - Fondo card (línea 19)

#### Textos
- ✅ `color: var(--color-text-primary)` - Título (línea 75, ya migrado)
- ✅ `color: var(--color-neutral-500)` - Subtítulo (línea 86)
- ✅ `color: var(--color-neutral-600)` - Descripción (línea 97)

#### Bordes
- ⚠️ `border: 1px solid rgba(10, 13, 20, 0.08)` - Borde card (línea 22) - **HARDCODED** (rgba con neutral-900 hardcoded)

#### Sombras
- ⚠️ `box-shadow: 0 2px 6px rgba(10, 13, 20, 0.06), 0 6px 20px rgba(10, 13, 20, 0.04)` - Sombra card (líneas 24-25) - **HARDCODED**
- ⚠️ Múltiples sombras hardcoded en estados hover/desktop

#### Elementos Decorativos
- ✅ `background: var(--color-neutral-900)` - Badge decorativo (línea 67, ya migrado)

#### Dark Mode
- ⚠️ Dark mode hardcoded con valores específicos (líneas 356-389)

**Resumen de Uso de Tokens:**
- ✅ **Bien usado:** Fondos (white), textos (text-primary, neutral-*), badge (neutral-900)
- ⚠️ **Hardcoded:** Bordes con rgba, sombras, dark mode completo
- 📊 **Porcentaje variables:** ~60%

**Decisión de Diseño Requerida:**
- Dark mode: ¿Migrar a sistema de temas o mantener hardcoded por ahora?
- Bordes/sombras: Migrar a tokens

---

## Tabla Comparativa

| Componente | Contexto | Variables (%) | Hardcoded | Complejidad Migración | Prioridad |
|------------|----------|---------------|-----------|----------------------|-----------|
| **CardAuto** | Fondo oscuro | ~70% | Bordes/sombras blancos | Media | ⭐⭐⭐ Alta |
| **CardAutoCompact** | Fondo claro | ~0% | Todo | Alta | ⭐ Baja (alternativo) |
| **ModelCard** | Fondo claro | ~50% | Gradiente, bordes, sombras | Baja | ⭐⭐ Media |
| **PostventaServiceCard** | Fondo claro | ~100% | Ninguno | ✅ Completado | ⭐⭐⭐ Referencia |
| **ServiceCard** | Fondo claro | ~60% | Bordes, sombras, dark mode | Media | ⭐⭐ Media |

---

## Análisis de Partes Ya Migradas

### Componentes con Uso Correcto de Tokens

1. **PostventaServiceCard** ✅
   - Usa `var(--color-white)`, `var(--color-text-primary)`, `var(--color-neutral-*)`
   - Usa `var(--shadow-md)`, `var(--shadow-lg)`
   - **Referencia ideal** para otros componentes

2. **CardAuto** (parcialmente)
   - Fondos: ✅
   - Textos: ✅
   - Bordes divisor: ✅
   - Color marca: ✅
   - Bordes/sombras card: ⚠️

3. **ModelCard** (parcialmente)
   - Fondos principales: ✅
   - Textos: ✅
   - Gradiente/bordes/sombras: ⚠️

4. **ServiceCard** (parcialmente)
   - Fondos: ✅
   - Textos: ✅ (ya migrado)
   - Bordes/sombras: ⚠️

---

## Partes que Podrían Migrarse Directamente

### Valores con Equivalente Directo en Tokens

1. **CardAutoCompact:**
   - `#fafafa` → `var(--color-neutral-50)` o `var(--color-surface-elevated)`
   - `#f9fafb` → `var(--color-neutral-50)`
   - `#ffffff` → `var(--color-white)` o `var(--color-surface)`
   - `#111827` → `var(--color-neutral-800)` (cercano) o crear token
   - `#6b7280` → `var(--color-neutral-500)`
   - `#374151` → `var(--color-neutral-700)`
   - `#e5e7eb` → `var(--color-neutral-200)` o `var(--color-border)`

2. **ModelCard:**
   - `rgba(0, 0, 0, 0.08)` → `var(--color-border)` con opacity o crear border-subtle
   - Gradiente `#fafafa`/`#f5f5f5` → Evaluar si crear token o mantener

3. **ServiceCard:**
   - `rgba(10, 13, 20, 0.08)` → Podría usar `var(--color-neutral-900)` con opacity o border-subtle

4. **CardAuto:**
   - `rgba(255, 255, 255, 0.05)` → Requiere decisión (bordes sobre fondo oscuro)

---

## Partes que Requieren Decisión de Diseño

### Decisiones Pendientes (NO Resolver Aquí)

1. **Bordes/Sombras sobre Fondo Oscuro (CardAuto)**
   - **Problema:** Bordes y sombras blancos con alpha están diseñados específicamente para fondo oscuro
   - **Opciones:**
     - Mantener hardcoded (específico del contexto)
     - Crear tokens `--color-border-on-dark`, `--shadow-on-dark`
     - Usar sistema de temas (futuro)

2. **Gradientes Específicos (ModelCard)**
   - **Problema:** Gradiente placeholder específico del componente
   - **Opciones:**
     - Mantener como está (local al componente)
     - Crear token `--gradient-placeholder-image`

3. **Dark Mode (ServiceCard)**
   - **Problema:** Dark mode completo hardcoded
   - **Opciones:**
     - Mantener hardcoded hasta sistema de temas
     - Migrar a sistema de temas (futuro)

4. **Color #111827 (CardAutoCompact)**
   - **Problema:** No tiene equivalente exacto (entre neutral-800 y neutral-900)
   - **Opciones:**
     - Usar `var(--color-neutral-800)` (#1f2937) - más claro
     - Usar `var(--color-neutral-900)` (#0a0d14) - más oscuro
     - Crear token intermedio

---

## Recomendación: Componente Ideal para Migración

### 🎯 PostventaServiceCard (Ya Completado - Referencia)

**Razones:**
- ✅ Ya está 100% migrado
- ✅ Usa todos los tokens correctamente
- ✅ Sirve como referencia para otros componentes
- ✅ Contexto claro (fondo claro)
- ✅ No requiere decisiones de diseño

**Conclusión:** Este componente NO necesita migración, pero sirve como **referencia ideal** de cómo deberían verse los demás.

---

### 🎯 ModelCard (Recomendado para Primera Migración)

**Razones:**
- ✅ Contexto simple: fondo claro, sin estados complejos
- ✅ Uso moderado de tokens ya (50%)
- ✅ Pocos colores hardcoded (solo gradiente, bordes, sombras)
- ✅ No tiene estados hover complejos
- ✅ No tiene dark mode
- ✅ Decisión de diseño mínima (solo gradiente placeholder)
- ✅ Componente visible pero controlado (no crítico como CardAuto)
- ✅ No está en el flujo principal (no en /vehiculos)

**Migraciones Necesarias:**
1. Gradiente placeholder: Mantener o crear token (decisión simple)
2. Bordes: `rgba(0, 0, 0, 0.08)` → `var(--color-border-subtle)` o equivalente
3. Sombras: Evaluar si usar `var(--shadow-*)` existentes o crear nuevas

**Complejidad:** ⭐⭐ Baja-Media  
**Riesgo:** ⭐ Bajo (componente no crítico)  
**Valor de Aprendizaje:** ⭐⭐⭐ Alto (patrón replicable)

---

### Alternativa: CardAutoCompact (NO Recomendado Inicialmente)

**Razones para NO empezar aquí:**
- ❌ Componente alternativo (baja frecuencia de uso)
- ❌ Requiere migración completa (0% variables)
- ❌ Decisión de diseño: color #111827 sin equivalente exacto
- ⚠️ Puede ser deprecado en el futuro (alternativa a CardAuto)

**Mejor para:** Segunda o tercera migración, después de validar el proceso.

---

## Resumen Ejecutivo

### Componentes Identificados: 5 componentes Card (+ 1 excluido)

1. ✅ **PostventaServiceCard** - Completado (100% tokens) - Referencia
2. 🎯 **ModelCard** - **RECOMENDADO para primera migración**
3. **CardAuto** - Alta prioridad pero complejo (bordes sobre fondo oscuro)
4. **ServiceCard** - Media prioridad (ya parcialmente migrado)
5. **CardAutoCompact** - Baja prioridad (alternativo, 0% tokens)

### Estado del Sistema

- ✅ **Sistema base completo:** Todas las variables necesarias definidas
- ✅ **Migración --color-black:** Completada
- ✅ **Referencia disponible:** PostventaServiceCard muestra el patrón correcto
- ✅ **Componente candidato identificado:** ModelCard

### Próximos Pasos Recomendados

1. **Migrar ModelCard** (componente visible pero controlado)
2. **Validar el proceso** con ModelCard
3. **Documentar patrón** para migraciones siguientes
4. **Continuar con ServiceCard** o **CardAuto** según validación

---

**Fin del Relevamiento**

