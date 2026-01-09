# Solución: Problema de Especificidad CSS en Preview

## 🔍 Problema Identificado

El diagnóstico muestra que:
- Las imágenes SÍ tienen altura (225px) ✅
- Las imágenes se cargan correctamente ✅
- Pero el contenedor puede no tener `aspect-ratio: 16/9` aplicado ❌
- Y puede no tener `contain: layout style paint` aplicado ❌

## 🎯 Posible Causa: Especificidad CSS

En producción, el orden de las reglas CSS puede cambiar con minificación, causando que algunas reglas se sobrescriban.

## ✅ Solución: Hacer el Selector Más Específico

Si el diagnóstico confirma que los estilos no se aplican, podemos hacer el selector más específico:

```css
/* Opción 1: Selector más específico */
.card.card__image-container {
    /* Esto tiene mayor especificidad */
}

/* Opción 2: Usar :where() para aumentar especificidad sin !important */
.card:where(.card__image-container) {
    /* Esto tiene mayor especificidad */
}

/* Opción 3: Selector anidado más específico */
.card > .card__image-container {
    /* Esto es más específico */
}
```

Pero primero necesitamos confirmar que el contenedor de imagen NO tiene estos estilos aplicados.

