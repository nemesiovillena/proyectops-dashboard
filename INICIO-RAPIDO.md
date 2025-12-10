# 🚀 Inicio Rápido - ProjectOps Dashboard

## Instalación y Ejecución

```bash
# 1. Instalar dependencias con pnpm
pnpm install

# 2. Iniciar el servidor de desarrollo
pnpm start
```

La aplicación se abrirá automáticamente en [http://localhost:4200](http://localhost:4200)

## 📱 Vistas Disponibles

### Dashboard Principal
**URL**: `/dashboard` o `/`

Muestra un resumen general con:
- Estadísticas rápidas de proyectos activos
- Tareas abiertas
- Miembros del equipo
- Actividad reciente

### Projects Board
**URL**: `/projects`

Vista tipo Kanban con:
- 5 proyectos de ejemplo
- Estados visuales (Planning, In Progress, On Hold, Completed)
- Barra de progreso por proyecto
- Presupuestos y fechas

**Proyectos Mock**:
- E-Commerce Platform Redesign (65% completado)
- Mobile App Development (40% completado)
- Cloud Infrastructure Migration (15% completado)
- Customer Portal Enhancement (100% completado)
- API Gateway Implementation (30% completado, en pausa)

### Tasks List
**URL**: `/tasks`

Lista de tareas con:
- 8 tareas distribuidas en diferentes proyectos
- Prioridades visuales (Low, Medium, High, Critical)
- Estados (Todo, In Progress, Review, Completed)
- Asignaciones a miembros del equipo
- Fechas de vencimiento

### Team Overview
**URL**: `/team`

Vista del equipo con:
- 5 miembros del equipo
- Roles y especialidades
- Estado de disponibilidad (Available, Busy, Away)
- Proyectos asignados

**Miembros Mock**:
- John Doe - Frontend Developer
- Jane Smith - Backend Developer
- Mike Johnson - UI/UX Designer
- Sarah Williams - Project Manager
- David Brown - DevOps Engineer

### Metrics Dashboard
**URL**: `/metrics`

Dashboard de métricas con:
- Total de proyectos
- Proyectos activos
- Tareas completadas
- Tamaño del equipo
- Tasas de finalización calculadas automáticamente

## 🎯 Características del Scaffold

### ✅ Angular 20 Moderno
- **Standalone Components**: Sin NgModules
- **Signals**: Estado reactivo en todos los servicios
- **Zoneless**: Mejor rendimiento sin Zone.js
- **Nueva sintaxis**: `@if`, `@for`, `@empty`

### ✅ Datos MOCK Completos
- **Sin necesidad de backend** para probar
- Datos realistas pre-cargados
- Simulación de latencia de API (500ms)
- Ready para reemplazar con API real

### ✅ Arquitectura Profesional
```
src/app/
├── core/          # Servicios, modelos, stores
├── shared/        # Componentes reutilizables
├── features/      # Módulos de funcionalidad
├── layout/        # Layouts de la aplicación
└── app.routes.ts  # Rutas con lazy loading
```

### ✅ Estilos SCSS
- Variables globales en `_variables.scss`
- Sistema de colores consistente
- Componentes estilizados
- Layout responsive

## 🔄 Navegación Rápida

El proyecto incluye:
- **Header** superior con navegación principal
- **Sidebar** lateral con menú
- **Rutas** con lazy loading para mejor performance
- **Loading states** con spinners
- **Error handling** con mensajes y retry

## 📝 Próximos Pasos

1. **Explorar el código**:
   - Revisa los servicios en `src/app/core/services/`
   - Mira los componentes en `src/app/features/`
   - Estudia los datos mock en `mock-data.service.ts`

2. **Personalizar**:
   - Modifica colores en `src/assets/styles/_variables.scss`
   - Ajusta datos mock según tus necesidades
   - Agrega nuevos componentes o features

3. **Integrar API real**:
   - Cambia `MockDataService` por llamadas HTTP reales
   - Los servicios ya están preparados para esto
   - Mantén la misma estructura de signals

4. **Agregar funcionalidad**:
   - Implementa formularios completos (ya están los placeholders)
   - Agrega autenticación real
   - Conecta gráficos (Chart.js, etc.)
   - Implementa búsqueda y filtros avanzados

## 🛠️ Comandos Útiles

```bash
# Desarrollo
pnpm start              # Servidor de desarrollo

# Build
pnpm build              # Build de producción
pnpm build:prod         # Build optimizado

# Watch mode
pnpm watch              # Build con watch mode

# Linting (cuando esté configurado)
pnpm lint               # Verificar código
```

## 📚 Documentación

- [README.md](README.md) - Documentación general del proyecto
- [VERIFICACION.md](VERIFICACION.md) - Verificación técnica completa
- [package.json](package.json) - Dependencias y scripts

## ✨ Tips

- **Hot Reload**: Los cambios se reflejan automáticamente
- **DevTools**: Usa Angular DevTools para inspeccionar signals
- **Path Aliases**: Usa `@core/`, `@shared/`, `@features/` en imports
- **Signals**: Los datos son reactivos, se actualizan automáticamente

## 🎨 Personalización Rápida

### Cambiar colores principales:
Edita `src/assets/styles/_variables.scss`:
```scss
$primary-color: #3b82f6;  // Azul por defecto
$secondary-color: #64748b; // Gris por defecto
```

### Modificar datos mock:
Edita `src/app/core/services/mock-data.service.ts`:
- Agrega más proyectos, tareas o miembros
- Cambia nombres, fechas, estados
- Ajusta métricas

### Agregar nueva feature:
```bash
# Crea la estructura en src/app/features/tu-feature/
# Sigue el patrón de las features existentes
# Agrega la ruta en app.routes.ts
```

## 🐛 Solución de Problemas

### Puerto 4200 ocupado:
```bash
pnpm start --port 4201
```

### Cache de pnpm:
```bash
pnpm store prune
pnpm install
```

### Reinstalar dependencias:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

**¡Listo para empezar!** 🎉

Ejecuta `pnpm install && pnpm start` y comienza a desarrollar.
