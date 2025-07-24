# Sistema de Diseño UI y Componentes - Indiana Usados

## Descripción
Guía rápida para el uso y extensión de los componentes UI y variables de diseño en Indiana Usados.

---

## 1. Design Tokens (Variables CSS)
- **Colores:** `--primary-color`, `--secondary-color`, `--success-color`, etc.
- **Espaciado:** `--spacing-xs`, `--spacing-sm`, `--spacing-md`, etc.
- **Tipografía:** `--font-family`, `--font-size-base`, `--line-height`

---

## 2. Componentes UI Principales

### Button
```jsx
<Button variant="primary">Principal</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="outline">Outline</Button>
<Button size="small">Pequeño</Button>
<Button size="medium">Mediano</Button>
<Button size="large">Grande</Button>
```

### FormInput
```jsx
<FormInput label="Email" name="email" type="email" required placeholder="tu@email.com" size="medium" />
```

---

## 3. Guías de Uso
- **Primary:** Acciones principales (guardar, enviar)
- **Secondary:** Acciones secundarias (cancelar, volver)
- **Outline:** Acciones menos importantes (ver más)
- **Small:** Tablas/listas compactas
- **Medium:** Uso general
- **Large:** Call-to-actions importantes

---

## 4. Mantenimiento y Extensión
- Agrega nuevos colores en `src/styles/variables.css` y documenta aquí.
- Crea nuevos componentes en `src/components/ui/` y documenta aquí con ejemplos.

---

*Este sistema de diseño asegura coherencia visual y facilidad de mantenimiento en toda la app.* 