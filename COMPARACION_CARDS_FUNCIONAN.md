# Comparación: Cards que SÍ funcionan vs CardAuto

## ✅ CardAutoCompact (FUNCIONA)
```css
.card__image-container {
    height: 200px; /* ✅ ALTURA FIJA */
    contain: layout style paint;
}
```

## ✅ CardSimilar (FUNCIONA)
```css
.card__image-container {
    aspect-ratio: 16 / 9;
    contain: layout style paint; /* ✅ CONTAIN COMPLETO */
}
```

## ❌ CardAuto (NO FUNCIONA)
```css
.card__image-container {
    aspect-ratio: 16 / 10;
    contain: style paint; /* ❌ SIN LAYOUT */
    min-height: 0;
}
```

## 🎯 DIFERENCIA CLAVE

**CardSimilar usa `contain: layout style paint` (COMPLETO)**
**CardAuto usa `contain: style paint` (SIN layout)**

El problema: Sin `layout` en `contain`, el cálculo de altura del contenedor interno puede fallar.

