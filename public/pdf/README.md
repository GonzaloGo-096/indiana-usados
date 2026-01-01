# 📄 Carpeta de PDFs

Esta carpeta contiene los archivos PDF para descarga en la sección 0km.

## 📁 Estructura

Coloca los archivos PDF directamente en esta carpeta:

```
public/
  pdf/
    peugeot-2008-ficha-tecnica.pdf
    peugeot-3008-ficha-tecnica.pdf
    ...
```

## 🔗 Rutas en el código

Cuando agregues un PDF a un modelo, usa la ruta relativa desde `/public`:

```javascript
// En src/data/modelos/peugeot2008.js
pdf: {
  href: '/pdf/peugeot-2008-ficha-tecnica.pdf',  // ← Ruta relativa desde /public
  label: 'Descargar Ficha Técnica',
  fileSize: '1,2 MB'
}
```

## ✅ Buenas prácticas

1. **Nombres descriptivos**: Usa nombres claros como `peugeot-2008-ficha-tecnica.pdf`
2. **Optimización**: Comprime PDFs grandes cuando sea posible
3. **Tamaño**: Incluye el tamaño en `fileSize` para informar al usuario

## 📝 Nota

Los archivos en esta carpeta NO se incluyen en el bundle de JavaScript. Se sirven como archivos estáticos, optimizando el rendimiento inicial de la aplicación.

