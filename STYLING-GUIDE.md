# Guía de Estilos - toToList App

## 📋 Resumen

Este documento explica cómo usar el sistema de variables CSS y estilos globales implementado en la aplicación toToList para mantener consistencia visual.

## 🎨 Variables CSS Disponibles

### Colores Principales
```css
--primary-color: #3880ff
--primary-light: #5598ff
--primary-dark: #2968cc
--secondary-color: #3dc2ff
--secondary-light: #70d4ff
--secondary-dark: #2aa1cc
```

### Colores de Estado
```css
--success-color: #2dd36f
--warning-color: #ffc409
--danger-color: #eb445a
--info-color: #3dc2ff
```

### Colores de Texto
```css
--text-primary: #222428
--text-secondary: #515560
--text-tertiary: #73747a
--text-light: #ffffff
```

### Colores de Fondo
```css
--background-primary: #ffffff
--background-secondary: #f7f7f7
--background-tertiary: #f1f3f4
--background-card: #ffffff
```

### Espaciado
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-xxl: 48px
```

### Tipografía
```css
--font-size-xs: 12px
--font-size-sm: 14px
--font-size-md: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-xxl: 24px
```

## 🛠 Clases Utilitarias

### Espaciado (Márgenes)
```html
<div class="m-xs">Margen extra pequeño</div>
<div class="m-sm">Margen pequeño</div>
<div class="m-md">Margen mediano</div>
<div class="mt-lg">Margen superior grande</div>
<div class="mb-xl">Margen inferior extra grande</div>
```

### Espaciado (Padding)
```html
<div class="p-md">Padding mediano</div>
<div class="pt-sm">Padding superior pequeño</div>
<div class="pb-lg">Padding inferior grande</div>
```

### Tipografía
```html
<h1 class="text-xl font-bold">Título principal</h1>
<p class="text-md text-secondary">Texto secundario</p>
<span class="text-sm text-tertiary">Texto terciario</span>
```

### Colores de Texto
```html
<p class="text-success">Texto de éxito</p>
<p class="text-warning">Texto de advertencia</p>
<p class="text-danger">Texto de peligro</p>
```

### Fondos
```html
<div class="bg-card p-md">Contenido con fondo de tarjeta</div>
<div class="bg-secondary p-lg">Contenido con fondo secundario</div>
```

### Bordes y Sombras
```html
<div class="border-radius-md shadow-sm">Tarjeta con bordes redondeados</div>
<div class="border-radius-lg shadow-md">Tarjeta con más sombra</div>
```

## 🧩 Componentes Reutilizables

### Tarjeta Personalizada
```html
<div class="custom-card">
  <h3>Título de la tarjeta</h3>
  <p>Contenido de la tarjeta</p>
</div>
```

### Botones Personalizados
```html
<button class="custom-button primary">Botón Primario</button>
<button class="custom-button secondary">Botón Secundario</button>
<button class="custom-button outline">Botón Outline</button>
```

### Input Personalizado
```html
<input class="custom-input" type="text" placeholder="Escribe aquí...">
```

### Lista de Tareas
```html
<div class="task-list">
  <div class="task-item">
    <div class="task-title">Título de la tarea</div>
    <div class="task-category">Categoría</div>
  </div>
  <div class="task-item completed">
    <div class="task-title">Tarea completada</div>
    <div class="task-category">Categoría</div>
  </div>
</div>
```

## 💡 Ejemplos de Uso en Componentes

### En archivos SCSS de componentes:
```scss
.mi-componente {
  background-color: var(--background-card);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  
  .titulo {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
  }
  
  .descripcion {
    font-size: var(--font-size-md);
    color: var(--text-secondary);
    line-height: var(--line-height-normal);
  }
}
```

### En templates HTML:
```html
<!-- Usando clases utilitarias -->
<ion-card class="bg-card border-radius-lg shadow-md">
  <ion-card-content class="p-md">
    <h2 class="text-lg font-semibold text-primary mb-sm">Mi Tarjeta</h2>
    <p class="text-md text-secondary">Descripción de la tarjeta</p>
  </ion-card-content>
</ion-card>

<!-- Combinando con componentes de Ionic -->
<ion-item class="bg-card mb-sm">
  <ion-label>
    <h3 class="font-medium text-primary">Elemento de lista</h3>
    <p class="text-sm text-secondary">Subtítulo del elemento</p>
  </ion-label>
</ion-item>
```

## 🌙 Tema Oscuro

El sistema incluye soporte automático para tema oscuro que se activa según las preferencias del sistema:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #ffffff;
    --background-primary: #1a1a1a;
    /* Los colores se ajustan automáticamente */
  }
}
```

## ✅ Mejores Prácticas

1. **Usa siempre las variables CSS** en lugar de valores hardcodeados
2. **Aprovecha las clases utilitarias** para espaciado y tipografía básica
3. **Mantén consistencia** usando el mismo espaciado y colores en toda la app
4. **Combina variables con clases** para crear componentes reutilizables
5. **Testea en tema claro y oscuro** para asegurar buena legibilidad

## 🔧 Personalización

Para cambiar los colores de la aplicación, solo modifica las variables en `src/theme/variables.scss`:

```scss
:root {
  --primary-color: #tu-nuevo-color;
  --secondary-color: #otro-color;
  // Los cambios se aplicarán automáticamente en toda la app
}
```

---

**¡Con este sistema tendrás una aplicación visualmente consistente y fácil de mantener!** 🎉
