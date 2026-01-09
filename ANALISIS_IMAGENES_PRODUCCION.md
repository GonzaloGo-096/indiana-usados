# Análisis: Imágenes No Visibles en Producción (Vercel)

## 🔍 Problema Identificado

Las imágenes no se renderizan en **Preview/Producción (Vercel)** en:
- ❌ Componentes **CARD** (`CardAuto`)
- ❌ Carruseles de **planes** (imagen del modelo con fondo blanco)

Pero **SÍ funcionan** en:
- ✅ **AutoDetalle** (vista de detalle del auto)

## 🎯 Causa Raíz

### Problema en `CloudinaryImage.module.css`

El contenedor `.imageContainer` tiene una configuración que causa colapso de altura en producción:

```css
.imageContainer {
  position: relative;
  display: block;
  overflow: hidden;
  /* ❌ FALTA: height y width para heredar del padre */
}
```

Dentro de `.imageContainer`, tanto `.image` como `.placeholder` usan:
```css
.image, .placeholder {
  position: absolute;
  width: 100%;
  height: 100%;  /* ❌ 100% de QUÉ? El padre no tiene altura definida */
}
```

### ¿Por qué colapsa en producción?

1. **CardAuto**: El contenedor padre `.card__image-container` tiene `aspect-ratio: 16 / 10` pero **NO tiene `height` explícita**.
   - En producción, cuando `CloudinaryImage` crea su `.imageContainer`, este no hereda correctamente la altura calculada del `aspect-ratio` del padre.
   - Los hijos con `position: absolute` y `height: 100%` no tienen referencia y colapsan a **0px**.

2. **Planes carrusel**: Similar problema - `.modeloImageCard` tiene `height: auto`, y cuando `CloudinaryImage` crea `.imageContainer`, no hay altura de referencia.

3. **AutoDetalle (funciona)**: El contenedor `.mainImageContainer` tiene `height: 400px` **fijo**, por lo que `.imageContainer` hereda esa altura y funciona correctamente.

### Diferencia entre Local y Producción

- **Local**: Puede funcionar por timing de renderizado diferente, cache del navegador, o diferencias en el orden de carga de CSS.
- **Producción**: CSS minificado, orden de carga diferente, y el navegador calcula el layout de forma más estricta, exponiendo el problema del contenedor sin altura.

## ✅ Solución Mínima

Agregar `height: 100%` y `width: 100%` al `.imageContainer` para que herede las dimensiones del contenedor padre:

```css
.imageContainer {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;    /* ✅ NUEVO: Heredar ancho del padre */
  height: 100%;   /* ✅ NUEVO: Heredar altura del padre */
}
```

### ¿Por qué esta solución funciona?

1. **CardAuto**: `.card__image-container` tiene `aspect-ratio: 16 / 10`. Con `height: 100%`, `.imageContainer` heredará la altura calculada del aspect-ratio.

2. **Planes**: `.modeloImageCard` tiene `height: auto` basado en contenido. Con `height: 100%`, `.imageContainer` se ajustará al contenido de la imagen.

3. **AutoDetalle**: Sigue funcionando porque el padre tiene altura fija, y ahora `.imageContainer` la hereda explícitamente.

### Impacto

- ✅ **Mínimo**: Solo agrega 2 propiedades CSS
- ✅ **Sin cambios visuales**: No altera el diseño ni el comportamiento
- ✅ **Compatible**: Funciona en todos los casos (CardAuto, Planes, AutoDetalle)
- ✅ **Sin breaking changes**: No afecta otros componentes

## 📋 Archivo a Modificar

- `src/components/ui/CloudinaryImage/CloudinaryImage.module.css`

## 🔧 Cambio Específico

```css
/* ANTES */
.imageContainer {
  position: relative;
  display: block;
  overflow: hidden;
}

/* DESPUÉS */
.imageContainer {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
```

