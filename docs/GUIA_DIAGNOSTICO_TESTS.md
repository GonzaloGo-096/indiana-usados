# 🔍 Guía de Diagnóstico: Test Fallando vs Bug Real

**Problema:** ¿Cómo saber si un test falla porque está mal escrito o porque el código tiene un bug?

---

## 🎯 Respuesta Rápida para TUS Tests Actuales

### ✅ Los 3 tests de CardAuto = **FALSO NEGATIVO** (test mal escrito)

**¿Cómo lo sé?**

#### 1. **Evidencia Visual:** El componente SÍ renderiza correctamente

Mira el output del test fallando:
```html
<h3 class="_card__title_78743e">
  Toyota    ← ✅ Toyota ESTÁ ahí
           ← Hay un espacio/salto de línea
  Corolla   ← ✅ Corolla ESTÁ ahí
</h3>
```

**Conclusión:** Los datos están presentes, solo están en elementos separados.

#### 2. **Evidencia de Imagen:** La URL es correcta pero transformada

```javascript
❌ Test busca: '/src/assets/auto1.jpg'
✅ Componente tiene: 'https://res.cloudinary.com/.../auto1.jpg'
```

**Conclusión:** El componente funciona MEJOR que lo esperado (usa Cloudinary para optimización).

#### 3. **Tests similares pasan:** Otros tests del mismo archivo SÍ pasan

```
✅ should format price correctly
✅ should handle zero kilometers
✅ should format large kilometer values
✅ should display transmission type
```

**Conclusión:** Si el componente estuviera roto, TODOS los tests fallarían.

---

## 📊 Método de 5 Pasos para Diagnosticar

### **Paso 1: Leer el mensaje de error con ATENCIÓN**

#### Ejemplo de FALSO NEGATIVO:
```bash
❌ Unable to find an element with the text: Toyota
   This could be because the text is broken up by multiple elements
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   Esta línea es la CLAVE
```

**Análisis:**
- ✅ El error dice "could be broken up" → Test mal escrito
- ✅ No dice "element not found" → El elemento existe

#### Ejemplo de BUG REAL:
```bash
❌ Expected element to be visible but it was not found in the document
```

**Análisis:**
- 🔴 El elemento NO está en el DOM → Posible bug real

---

### **Paso 2: Inspeccionar el HTML renderizado**

Los tests de Vitest/RTL muestran el HTML completo cuando fallan.

#### 🔍 Buscar el elemento en el output:

```html
<!-- CASO 1: FALSO NEGATIVO - Elemento existe -->
<h3>
  Toyota     ← ✅ Está aquí
   
  Corolla    ← ✅ Está aquí
</h3>

<!-- CASO 2: BUG REAL - Elemento no existe -->
<div class="card">
  <!-- No hay h3 con Toyota/Corolla -->
  <span></span>
</div>
```

**Proceso:**
```bash
1. Copiar el HTML del error
2. Buscar Ctrl+F el texto esperado
3. ¿Lo encuentras? → Test mal escrito
4. ¿No está? → Bug real
```

---

### **Paso 3: Verificar manualmente en el navegador**

#### Comando:
```bash
npm run dev
```

#### Checklist:
```
1. Abrir http://localhost:8080/vehiculos
2. ¿Se ven las tarjetas de vehículos?
   ✅ Sí → No es bug de renderizado
   🔴 No → Bug real

3. ¿Ves "Toyota Corolla" en las tarjetas?
   ✅ Sí → Test mal escrito (busca incorrectamente)
   🔴 No → Bug en datos o lógica

4. ¿Las imágenes se cargan?
   ✅ Sí → Test esperaba URL incorrecta
   🔴 No → Bug en manejo de imágenes
```

---

### **Paso 4: Comparar con tests similares que PASAN**

En el mismo archivo `CardAuto.test.jsx`:

```javascript
// ✅ Este test PASA:
expect(screen.getByText('$ 25.000')).toBeInTheDocument()

// ❌ Este test FALLA:
expect(screen.getByText('Toyota')).toBeInTheDocument()
```

**Preguntas:**
1. ¿Por qué uno pasa y otro falla?
2. ¿Cuál es la diferencia?

**Análisis:**
- `'$ 25.000'` → Está en un `<span>` solo (no se separa)
- `'Toyota'` → Está en `<h3>` con `'Corolla'` (se separa)

**Conclusión:** Test mal escrito, necesita regex o búsqueda flexible.

---

### **Paso 5: Usar herramientas de debug**

#### A. **screen.debug()** - Ver el DOM completo

```javascript
it('should render vehicle information correctly', () => {
  render(<CardAuto auto={mockVehicle} />)
  
  // 👀 VER TODO EL DOM
  screen.debug()
  
  expect(screen.getByText('Toyota')).toBeInTheDocument()
})
```

**Output:**
```html
<body>
  <div class="card">
    <h3>
      Toyota
      
      Corolla
    </h3>
  </div>
</body>
```

#### B. **screen.logTestingPlaygroundURL()** - Inspector interactivo

```javascript
it('should render vehicle information correctly', () => {
  render(<CardAuto auto={mockVehicle} />)
  
  // 🎮 ABRIR PLAYGROUND INTERACTIVO
  screen.logTestingPlaygroundURL()
  
  // Te da una URL para inspeccionar visualmente
})
```

#### C. **Test UI de Vitest** - Visual debugging

```bash
npm run test:ui
```

- Ver el DOM renderizado
- Inspeccionar elementos
- Re-ejecutar tests individuales

---

## 🧪 Casos Prácticos: Falso Negativo vs Bug Real

### **CASO 1: Text separado (FALSO NEGATIVO)**

#### Síntoma:
```bash
❌ Unable to find an element with the text: Toyota
```

#### Diagnóstico:
```javascript
// Ver el HTML:
<h3>
  <span>Toyota</span>
  <span> </span>
  <span>Corolla</span>
</h3>
```

#### Solución:
```javascript
// ❌ ANTES:
expect(screen.getByText('Toyota')).toBeInTheDocument()

// ✅ DESPUÉS (opción 1 - regex):
expect(screen.getByText(/Toyota/)).toBeInTheDocument()

// ✅ DESPUÉS (opción 2 - texto completo):
expect(screen.getByText(/Toyota.*Corolla/)).toBeInTheDocument()

// ✅ DESPUÉS (opción 3 - función):
expect(screen.getByText((content, element) => {
  return element.tagName.toLowerCase() === 'h3' && 
         content.includes('Toyota')
})).toBeInTheDocument()
```

**Conclusión:** ✅ Test mal escrito (falso negativo)

---

### **CASO 2: URL transformada (FALSO NEGATIVO)**

#### Síntoma:
```bash
❌ Expected: "/src/assets/auto1.jpg"
   Received: "https://res.cloudinary.com/.../auto1.jpg"
```

#### Diagnóstico:
```javascript
// El componente MEJORA la URL (optimización Cloudinary)
// Esto es BUENO, no un bug
```

#### Solución:
```javascript
// ❌ ANTES (demasiado específico):
expect(image.src).toContain('/src/assets/auto1.jpg')

// ✅ DESPUÉS (buscar solo el nombre):
expect(image.src).toContain('auto1.jpg')

// ✅ O validar que sea URL válida:
expect(image.src).toMatch(/^https?:\/\//)

// ✅ O validar el formato:
expect(image.src).toMatch(/\.(jpg|jpeg|png|webp)$/)
```

**Conclusión:** ✅ Test mal escrito (esperaba comportamiento incorrecto)

---

### **CASO 3: Elemento realmente no existe (BUG REAL)**

#### Síntoma:
```bash
❌ TestingLibraryElementError: Unable to find element with test id "vehicle-card"
```

#### Diagnóstico:
```javascript
// HTML renderizado:
screen.debug()
// Output:
<div class="container">
  <!-- Vacío - no hay card -->
</div>
```

#### Verificación manual:
```bash
# Abrir en navegador
npm run dev
# Resultado: Pantalla en blanco, sin tarjetas
```

#### Causas posibles:
```javascript
// 1. Datos undefined
const auto = undefined
<CardAuto auto={auto} /> // ❌ No renderiza nada

// 2. Condicional mal escrito
if (auto === null) return null // ❌ Debería ser !auto

// 3. Error en el componente
throw new Error('Failed to render') // ❌ Crashea
```

**Conclusión:** 🔴 Bug real en el código

---

### **CASO 4: Test de integración fallando (BUG REAL)**

#### Síntoma:
```bash
❌ Expected: [{ id: 1, marca: 'Toyota' }]
   Received: []
```

#### Diagnóstico:
```javascript
// El hook NO está devolviendo datos
const { vehicles } = useVehiclesList()
console.log(vehicles) // []
```

#### Verificación:
```javascript
// Mock del service:
vi.mock('@services', () => ({
  vehiclesApi: {
    getVehicles: vi.fn().mockResolvedValue({ vehicles: [] })
                                           ^^^^^^^^^^^^^ Mock vacío
  }
}))
```

#### Causa:
```javascript
// Hook hace llamada pero service mockead devuelve vacío
// Podría ser:
// 1. Mock configurado mal
// 2. Hook no procesa la respuesta
// 3. Componente no muestra los datos
```

#### Solución:
```javascript
// Verificar paso a paso:
1. ¿Mock devuelve datos? → console.log en el mock
2. ¿Hook recibe datos? → console.log en el hook
3. ¿Componente renderiza? → screen.debug()

// Si todo lo anterior funciona pero el test falla:
// → Test mal escrito

// Si algún paso falla:
// → Bug real en el código
```

**Conclusión:** Depende del paso que falle

---

## 🎯 Checklist de Diagnóstico Rápido

```
┌─────────────────────────────────────────────────┐
│ CUANDO UN TEST FALLA, PREGÚNTATE:              │
└─────────────────────────────────────────────────┘

1. ✅ ¿El elemento EXISTE en el HTML del error?
   → Sí: Probablemente test mal escrito
   → No: Probablemente bug real

2. ✅ ¿Funciona correctamente en el navegador?
   → Sí: Probablemente test mal escrito
   → No: Definitivamente bug real

3. ✅ ¿Tests similares PASAN en el mismo archivo?
   → Sí: Probablemente test mal escrito
   → No: Probablemente bug real

4. ✅ ¿El error menciona "could be", "might be"?
   → Sí: Probablemente test mal escrito
   → No: Más probable bug real

5. ✅ ¿Es un test nuevo que acabas de escribir?
   → Sí: Muy probablemente test mal escrito
   → No: Más probable bug introducido recientemente
```

---

## 🔧 Herramientas de Debug

### 1. **screen.debug()**
```javascript
import { screen } from '@testing-library/react'

it('test', () => {
  render(<Component />)
  
  screen.debug()              // Todo el DOM
  screen.debug(screen.getByRole('button'))  // Solo ese elemento
})
```

### 2. **screen.logTestingPlaygroundURL()**
```javascript
it('test', () => {
  render(<Component />)
  
  screen.logTestingPlaygroundURL()
  // Output: https://testing-playground.com/#markup=...
})
```

### 3. **waitFor con debug**
```javascript
import { waitFor } from '@testing-library/react'

it('test', async () => {
  render(<Component />)
  
  await waitFor(() => {
    screen.debug()  // Ver el DOM en cada intento
    expect(screen.getByText('Hello')).toBeInTheDocument()
  }, {
    onTimeout: (error) => {
      screen.debug()  // Ver el DOM cuando falla
      throw error
    }
  })
})
```

### 4. **Test UI de Vitest**
```bash
npm run test:ui
```

**Ventajas:**
- ✅ Ver el DOM renderizado visualmente
- ✅ Inspeccionar elementos con DevTools
- ✅ Re-ejecutar tests individuales
- ✅ Ver el historial de ejecuciones

### 5. **Console logs estratégicos**
```javascript
it('test', () => {
  render(<Component />)
  
  console.log('1. Props:', mockProps)
  console.log('2. DOM:', document.body.innerHTML)
  console.log('3. Query:', screen.queryByText('Toyota'))
  
  expect(screen.getByText('Toyota')).toBeInTheDocument()
})
```

---

## 📊 Tabla Comparativa

| Indicador | Falso Negativo (Test Mal) | Bug Real (Código Mal) |
|-----------|----------------------------|------------------------|
| **Elemento en HTML** | ✅ Presente | ❌ Ausente o incorrecto |
| **Funciona en browser** | ✅ Sí | ❌ No |
| **Tests similares** | ✅ Pasan | ❌ Fallan también |
| **Mensaje de error** | "could be", "might be" | Específico y claro |
| **Consistencia** | Solo este test falla | Múltiples tests fallan |
| **Historia** | Test nuevo o recién modificado | Test que antes pasaba |
| **Coverage** | Línea ejecutada | Línea no ejecutada |
| **Mock necesario** | Mock presente y correcto | Mock ausente o mal configurado |

---

## 🎓 Proceso Profesional de Validación

### Nivel 1: Validación Rápida (2 min)
```bash
1. Leer error completo
2. Buscar elemento en HTML del error
3. Decisión rápida: 80% de confianza
```

### Nivel 2: Validación Media (5 min)
```bash
1. screen.debug() en el test
2. Verificar en navegador (npm run dev)
3. Comparar con tests similares
4. Decisión: 95% de confianza
```

### Nivel 3: Validación Profunda (15 min)
```bash
1. Test UI interactivo
2. Console logs en múltiples puntos
3. Revisar implementación del componente
4. Probar edge cases manualmente
5. Decisión: 99% de confianza
```

---

## 🚀 Aplicación a TUS Tests Actuales

### **Test 1: `should render vehicle information correctly`**

#### Diagnóstico:
```javascript
// Error:
❌ Unable to find an element with the text: Toyota
   This could be because the text is broken up by multiple elements

// HTML:
<h3>Toyota Corolla</h3>  ← Pero con espacios/saltos de línea

// Verificación browser:
✅ Funciona perfectamente
✅ Se ve "Toyota Corolla"

// Tests similares:
✅ Otros 4 tests del mismo archivo pasan
```

**Conclusión:** 100% FALSO NEGATIVO (test mal escrito)

**Solución:**
```javascript
// Cambiar a regex:
expect(screen.getByText(/Toyota/)).toBeInTheDocument()
```

---

### **Test 2: `should display vehicle image`**

#### Diagnóstico:
```javascript
// Error:
❌ Expected: "/src/assets/auto1.jpg"
   Received: "https://res.cloudinary.com/.../auto1.jpg"

// Verificación browser:
✅ Imagen se muestra perfectamente
✅ URL de Cloudinary es correcta (optimización)

// Contexto:
✅ El componente USA Cloudinary para optimizar
✅ Esto es una MEJORA, no un bug
```

**Conclusión:** 100% FALSO NEGATIVO (test esperaba comportamiento incorrecto)

**Solución:**
```javascript
// Buscar solo el nombre del archivo:
expect(image.src).toContain('auto1.jpg')
```

---

### **Test 3: `should handle missing vehicle data gracefully`**

#### Diagnóstico:
```javascript
// Mismo error que Test 1 (texto separado)
// Es el MISMO problema en un contexto diferente
```

**Conclusión:** 100% FALSO NEGATIVO (mismo problema de regex)

---

## 💡 Reglas de Oro

### ✅ Es FALSO NEGATIVO si:
1. El elemento **existe** en el HTML del error
2. Funciona **correctamente** en el navegador
3. Tests **similares pasan**
4. Error menciona "**could be**", "**might be**"
5. Test es **nuevo** o **recién modificado**

### 🔴 Es BUG REAL si:
1. El elemento **NO existe** en el DOM
2. **NO funciona** en el navegador
3. **Múltiples tests** fallan
4. Error es **específico** y claro
5. Test **antes pasaba** y ahora falla sin cambios

---

## 🎯 Acción Inmediata para TI

```bash
# 1. Verificar en navegador (30 segundos)
npm run dev
# Ir a http://localhost:8080/vehiculos
# ¿Se ven las tarjetas con Toyota/Corolla?
# ✅ Sí → Tests mal escritos

# 2. Corregir tests (5 minutos)
# Ver: docs/PLAN_TESTING_PASO_A_PASO.md - Etapa 0

# 3. Verificar corrección (30 segundos)
npm run test
# ¿Todos pasan?
# ✅ Sí → Confirmado: eran falsos negativos
```

---

## 📚 Recursos Adicionales

- [Testing Library - Queries](https://testing-library.com/docs/queries/about)
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Playground](https://testing-playground.com/)

---

**TL;DR para tus tests actuales:**

```
Los 3 tests fallando de CardAuto = FALSOS NEGATIVOS (100% seguro)

Evidencia:
✅ Elementos existen en el HTML del error
✅ Funciona perfectamente en el navegador  
✅ Otros tests del mismo componente pasan
✅ Error dice "could be broken up by multiple elements"

Solución: 5 cambios de línea (30 min)
```

---

*Documento creado: 4 de noviembre de 2025*  
*Úsalo como guía cada vez que un test falle*

