
# Guía de Rollback - Sistema de Imágenes Optimizado

## Convención de Commits
- **Prefijo obligatorio**: `imgops:` para todos los commits relacionados con optimización de imágenes
- **Formato**: `imgops: [descripción del cambio]`

## Ejemplo de commits:
```
imgops: agregar middleware de compresión WebP
imgops: implementar lazy loading para galería
imgops: configurar CDN para assets estáticos
imgops: optimizar tamaños de imagen responsive
```

## Guía de Rollback con git revert

### Pasos para revertir cambios individuales:

1. **Identificar el commit a revertir**:
   ```bash
   git log --oneline --grep="imgops:"
   ```

2. **Revertir un commit específico**:
   ```bash
   git revert <commit-hash>
   ```

3. **Revertir múltiples commits (del más reciente al más antiguo)**:
   ```bash
   git revert <commit-hash-1> <commit-hash-2> <commit-hash-3>
   ```

### Plantilla de Rollback por Commit

#### Commits Futuros (Placeholder):

**Commit 1**: `imgops: [PENDIENTE]`
- Hash: `[PENDIENTE]`
- Comando de revert: `git revert [HASH]`
- Descripción: [Se actualizará con cada commit]

**Commit 2**: `imgops: [PENDIENTE]`
- Hash: `[PENDIENTE]`
- Comando de revert: `git revert [HASH]`
- Descripción: [Se actualizará con cada commit]

**Commit 3**: `imgops: [PENDIENTE]`
- Hash: `[PENDIENTE]`
- Comando de revert: `git revert [HASH]`
- Descripción: [Se actualizará con cada commit]

### Rollback Completo de la Rama

Si necesitas revertir todos los cambios de la rama `img-ops-v1`:

1. **Cambiar a la rama principal**:
   ```bash
   git checkout main
   ```

2. **Eliminar la rama local**:
   ```bash
   git branch -D img-ops-v1
   ```

3. **Si ya se hizo merge, revertir el merge**:
   ```bash
   git revert -m 1 <merge-commit-hash>
   ```

### Notas Importantes

- ⚠️ **Actualizar este archivo**: Después de cada commit con prefijo `imgops:`, actualizar la sección de commits con el hash real
- 🔄 **Orden de revert**: Siempre revertir en orden inverso (del más reciente al más antiguo)
- 📝 **Documentar razón**: Al hacer revert, incluir en el mensaje por qué se revierte
- 🧪 **Probar después del revert**: Verificar que la aplicación funciona correctamente después del rollback

### Comandos de Verificación

```bash
# Ver estado actual de la rama
git status

# Ver historial de commits con filtro imgops
git log --oneline --grep="imgops:"

# Ver diferencias entre ramas
git diff main..img-ops-v1

# Verificar integridad del repositorio
git fsck
```

---
**Última actualización**: ${new Date().toLocaleDateString('es-ES')}
**Rama activa**: img-ops-v1
