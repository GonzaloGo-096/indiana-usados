# Manual QA Checklist

- `npm run build` y `npm run preview` para revisar la versión final.
- Verificar Home: hero, CTA, carruseles.
- Verificar `/vehiculos`: carga inicial, filtros (abrir, aplicar, limpiar), paginación.
- Revisar detalle de vehículo: galería, datos técnicos, CTA de contacto.
- Revisar `/nosotros` y `/postventa` para contenido estático y enlaces.
- Ejecutar `node scripts/test-sitemap.js` para validar `robots.txt` y sitemap dinámico.
- Chequear consola del navegador por errores, y logs de red (404/500).
- Confirmar metadatos principales (`<title>`, `<meta description>`).
- Revisar responsivo básico: desktop (≥1280px) y mobile (~375px).

Notas:

- No hay suites automáticas; cualquier cambio debe verificarse manualmente.
- Documentar hallazgos relevantes en las notas de release.

