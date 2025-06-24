# Sistema de Diseño - Indiana Usados

## 🎨 Variables CSS (Design Tokens)

### Colores
- `--primary-color`: #007bff (Azul principal)
- `--primary-hover`: #0056b3 (Azul hover)
- `--secondary-color`: #6c757d (Gris secundario)
- `--success-color`: #28a745 (Verde éxito)
- `--danger-color`: #dc3545 (Rojo error)
- `--warning-color`: #ffc107 (Amarillo advertencia)

### Espaciado
- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)

### Tipografía
- `--font-family`: Arial, sans-serif
- `--font-size-base`: 1rem (16px)
- `--line-height`: 1.6

## 🧩 Componentes UI

### Button
```jsx
import { Button } from '../ui/Button'

// Variantes
<Button variant="primary">Botón Principal</Button>
<Button variant="secondary">Botón Secundario</Button>
<Button variant="outline">Botón Outline</Button>

// Tamaños
<Button size="small">Pequeño</Button>
<Button size="medium">Mediano</Button>
<Button size="large">Grande</Button>
```

### FormInput
```jsx
import { FormInput } from '../ui/FormInput'

<FormInput
    label="Email"
    name="email"
    type="email"
    required
    placeholder="tu@email.com"
    size="medium"
/>
```

## 📋 Guías de Uso

### Cuándo usar cada variante de botón:
- **Primary**: Acciones principales (Guardar, Enviar, Comprar)
- **Secondary**: Acciones secundarias (Cancelar, Volver)
- **Outline**: Acciones menos importantes (Ver más, Detalles)

### Cuándo usar cada tamaño:
- **Small**: En tablas, listas compactas
- **Medium**: Uso general
- **Large**: Call-to-actions importantes

## 🔧 Mantenimiento

### Agregar nuevos colores:
1. Agregar en `src/styles/variables.css`
2. Usar en componentes
3. Documentar aquí

### Agregar nuevos componentes:
1. Crear en `src/components/ui/`
2. Usar variables CSS
3. Documentar aquí
4. Agregar ejemplos de uso 