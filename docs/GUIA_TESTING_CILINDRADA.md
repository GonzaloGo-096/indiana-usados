# 🧪 GUÍA DE TESTING MANUAL - CILINDRADA FORMATO DECIMAL

**Fecha**: 19 de Noviembre, 2025  
**Feature**: Cilindrada en formato X.X (2.0, 3.5, etc.)  
**Tiempo estimado**: 15 minutos

---

## ✅ CHECKLIST DE TESTING

### 🆕 PARTE 1: CREAR VEHÍCULO NUEVO

#### Test 1: Formato correcto básico ✅
```
1. Abrir panel admin: http://localhost:5173/admin
2. Click en "Nuevo Vehículo"
3. Llenar campos básicos (marca, modelo, año, etc.)
4. En cilindrada escribir: "2.0"
5. Salir del campo (blur)
6. ✅ ESPERADO: Se mantiene "2.0", sin errores
7. Llenar resto de campos + fotos
8. Submit
9. ✅ ESPERADO: Vehículo creado exitosamente
```

#### Test 2: Auto-completar "2" → "2.0" ⭐
```
1. Nuevo vehículo
2. En cilindrada escribir solo: "2"
3. Hacer click fuera del campo (blur)
4. ✅ ESPERADO: Auto-completa a "2.0"
5. Submit
6. ✅ ESPERADO: Vehículo creado con cilindrada 2.0
```

#### Test 3: Auto-completar "2." → "2.0"
```
1. Nuevo vehículo
2. En cilindrada escribir: "2."
3. Blur
4. ✅ ESPERADO: Auto-completa a "2.0"
```

#### Test 4: Truncar "2.12" → "2.1"
```
1. Nuevo vehículo
2. En cilindrada escribir: "2.12"
3. Blur
4. ✅ ESPERADO: Trunca a "2.1"
5. Submit debe funcionar
```

#### Test 5: Validación de rango - Muy bajo ❌
```
1. Nuevo vehículo
2. En cilindrada escribir: "0.4"
3. Intentar submit
4. ✅ ESPERADO: Error "Debe estar entre 0.5 y 9.9 litros"
```

#### Test 6: Validación de rango - Límite inferior ✅
```
1. Nuevo vehículo
2. En cilindrada escribir: "0.5"
3. Submit
4. ✅ ESPERADO: Acepta sin errores
```

#### Test 7: Validación de rango - Límite superior ✅
```
1. Nuevo vehículo
2. En cilindrada escribir: "9.9"
3. Submit
4. ✅ ESPERADO: Acepta sin errores
```

#### Test 8: Formato inválido - Dos dígitos enteros ❌
```
1. Nuevo vehículo
2. En cilindrada escribir: "10.0"
3. Intentar submit
4. ✅ ESPERADO: Error "Formato debe ser X.X"
```

#### Test 9: Campo vacío ❌
```
1. Nuevo vehículo
2. Dejar cilindrada vacío
3. Intentar submit
4. ✅ ESPERADO: Error "Cilindrada es requerida"
```

#### Test 10: Valores decimales comunes
```
ESCRIBIR → BLUR → RESULTADO
"1.6"    → blur → "1.6" ✅
"2.0"    → blur → "2.0" ✅
"2.5"    → blur → "2.5" ✅
"3.0"    → blur → "3.0" ✅
"3.5"    → blur → "3.5" ✅
"4.2"    → blur → "4.2" ✅
```

---

### 📝 PARTE 2: EDITAR VEHÍCULO EXISTENTE

#### Test 11: Editar vehículo con cilindrada legacy (number)
```
1. Abrir un vehículo que tenga cilindrada como número (ej: 2)
2. Click en "Editar"
3. ✅ ESPERADO: Campo cilindrada muestra "2.0" (normalizado)
4. No modificar cilindrada
5. Guardar
6. ✅ ESPERADO: Se guarda correctamente
```

#### Test 12: Editar vehículo y cambiar cilindrada
```
1. Editar vehículo existente
2. Ver cilindrada actual (ej: "2.0")
3. Cambiar a "3.5"
4. Guardar
5. Reabrir edición
6. ✅ ESPERADO: Muestra "3.5"
```

#### Test 13: Editar vehículo sin tocar cilindrada
```
1. Editar vehículo
2. Ver cilindrada (ej: "2.5")
3. Cambiar otro campo (ej: precio)
4. Guardar
5. ✅ ESPERADO: Cilindrada se mantiene "2.5"
```

---

### 👁️ PARTE 3: VISUALIZACIÓN EN DETALLE

#### Test 14: Ver detalle de vehículo
```
1. Crear/editar vehículo con cilindrada "2.0"
2. Ir a la página pública de vehículos
3. Abrir detalle del vehículo
4. ✅ ESPERADO: En la card de detalle se ve "2.0" o "2.0 L"
```

#### Test 15: Ver detalle de vehículo legacy
```
1. Si tienes vehículo viejo con cilindrada como número
2. Abrir su detalle
3. ✅ ESPERADO: Se ve normalizado "2.0" o "2.0 L"
```

---

### 🔍 PARTE 4: VERIFICACIÓN TÉCNICA

#### Test 16: Inspeccionar FormData enviado
```
1. Abrir DevTools → Network
2. Crear nuevo vehículo con cilindrada "2.5"
3. Submit
4. En Network, buscar request POST /photos/create
5. Ver FormData → cilindrada
6. ✅ ESPERADO: Se envía como número 2.5 (no string)
```

#### Test 17: Verificar respuesta del backend
```
1. Crear vehículo con cilindrada "3.0"
2. Ver response en Network
3. ✅ ESPERADO: Backend retorna cilindrada: 3 o 3.0
4. Abrir edición del mismo vehículo
5. ✅ ESPERADO: Input muestra "3.0"
```

---

## 🐛 CASOS EDGE A TESTEAR

### Test 18: Caracteres no numéricos
```
ESCRIBIR → RESULTADO
"abc"    → Blur → sin cambio, submit muestra error ❌
"2.a"    → Blur → sin cambio, submit muestra error ❌
"a.5"    → Blur → sin cambio, submit muestra error ❌
```

### Test 19: Espacios
```
ESCRIBIR → BLUR → RESULTADO
" 2.0"   → blur → "2.0" ✅ (trim funciona)
"2.0 "   → blur → "2.0" ✅ (trim funciona)
" 2 "    → blur → "2.0" ✅ (trim + auto-completa)
```

### Test 20: Copy-Paste
```
1. Copiar "2.5" de algún lado
2. Pegar en cilindrada
3. Blur
4. ✅ ESPERADO: Se mantiene "2.5"
```

---

## 📊 RESUMEN DE RESULTADOS

**Completa esta tabla mientras testeas:**

| Test | Descripción | Estado | Notas |
|------|-------------|--------|-------|
| 1 | Formato correcto "2.0" | ⬜ | |
| 2 | Auto-completar "2" → "2.0" | ⬜ | |
| 3 | Auto-completar "2." → "2.0" | ⬜ | |
| 4 | Truncar "2.12" → "2.1" | ⬜ | |
| 5 | Validación mínimo | ⬜ | |
| 6 | Límite inferior 0.5 | ⬜ | |
| 7 | Límite superior 9.9 | ⬜ | |
| 8 | Rechazar 10.0 | ⬜ | |
| 9 | Campo vacío error | ⬜ | |
| 10 | Valores decimales | ⬜ | |
| 11 | Editar legacy | ⬜ | |
| 12 | Cambiar cilindrada | ⬜ | |
| 13 | No tocar cilindrada | ⬜ | |
| 14 | Ver detalle | ⬜ | |
| 15 | Ver detalle legacy | ⬜ | |
| 16 | FormData enviado | ⬜ | |
| 17 | Response backend | ⬜ | |
| 18 | Caracteres inválidos | ⬜ | |
| 19 | Espacios trim | ⬜ | |
| 20 | Copy-paste | ⬜ | |

**Leyenda:**
- ⬜ Pendiente
- ✅ Pasó
- ❌ Falló
- ⚠️ Parcial

---

## 🔧 SI ENCUENTRAS ERRORES

### Error: "logger is not defined"
**Ubicación**: formatters.js línea 128  
**Solución**: Cambiar `logger?.warn` por `console.warn` o importar logger

### Error: El campo no auto-completa
**Verificar**:
- onBlur está correctamente enlazado
- setValue está siendo llamado
- Ver console para errores

### Error: Validación no funciona
**Verificar**:
- Regex está correctamente escrito: `/^[0-9]\.[0-9]$/`
- Pattern está en el register
- Ver mensaje de error en UI

### Error: Backend rechaza el valor
**Verificar**:
- En Network, FormData muestra cilindrada como número
- Backend espera número, no string

---

## ✅ CRITERIO DE ÉXITO

**El testing es exitoso si:**
- ✅ Todos los tests 1-10 (CREATE) pasan
- ✅ Tests 11-13 (EDIT) pasan
- ✅ Tests 14-15 (VISUALIZACIÓN) pasan
- ✅ No hay errores en consola
- ✅ Backend acepta y guarda correctamente

**Puedes proceder al deploy si:**
- Al menos 18/20 tests pasan
- No hay bugs críticos
- La UX se siente natural

---

## 🎯 QUICK TEST (5 minutos)

**Si tienes poco tiempo, solo testa estos:**

1. ✅ Crear vehículo escribiendo "2" → auto-completa a "2.0" → guarda OK
2. ✅ Crear vehículo escribiendo "2.5" → guarda OK
3. ✅ Editar vehículo existente → cilindrada se ve normalizada
4. ✅ Ver detalle público → cilindrada se muestra bien
5. ✅ Intentar submit con "0.4" → muestra error de rango

Si estos 5 pasan, **la implementación está OK** ✅

---

**¡Buena suerte con el testing!** 🚀

