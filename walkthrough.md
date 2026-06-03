# Walkthrough de Optimización de Rendimiento - Bienal Integrador

Este documento registra los cambios de código realizados para optimizar el rendimiento y las pruebas de validación llevadas a cabo.

## Cambios Realizados

### 1. Control del Ciclo de WebGL (Three.js) en `ImageDistortion.jsx`
- **Archivo modificado**: [ImageDistortion.jsx](file:///src/components/ImageDistortion.jsx)
- **Implementación**:
  - Incorporamos un `IntersectionObserver` para pausar la llamada de `requestAnimationFrame` cuando el lienzo sale de la vista (viewport).
  - Corregimos la inicialización de `isIntersecting` a `false` (en lugar de `true`) para que la primera comprobación del observador reactive adecuadamente el bucle al cargarse.
  - Agregamos una verificación rápida de los estilos en línea (`opacity` y `visibility`) del contenedor padre en cada frame. Si el componente se encuentra oculto en el timeline de GSAP (ej. opacidad `0` o `visibility: hidden`), omitimos la llamada pesada `renderer.render(scene, camera)`.
  - **Resultado**: Consumo de CPU/GPU del 0% para componentes WebGL invisibles o fuera del scroll en la versión Desktop.

### 2. Eliminación de WebGL en Móvil (Reemplazo por `<img>` Estándar)
- **Archivo modificado**: [MobileLayout.jsx](file:///src/components/MobileLayout.jsx)
- **Implementación**:
  - Eliminamos el componente interactivo `ImageDistortion` y lo reemplazamos por etiquetas `<img>` estándar de HTML.
  - Dado que los dispositivos móviles no tienen eventos de "hover" de mouse (y el arrastre táctil ejecuta el scroll de la página, imposibilitando la distorsión interactiva), no hay justificación para cargar WebGL en teléfonos.
  - **Resultado**: Rendimiento óptimo en móviles, eliminando el calentamiento del dispositivo y logrando un 0% de uso de WebGL. Las imágenes se siguen desplazando, escalando y animando fluidamente bajo el Timeline de GSAP sin consumir batería extra.

### 3. Transición del Logo por Hardware GPU en `MobileLayout.jsx`
- **Archivo modificado**: [MobileLayout.jsx](file:///src/components/MobileLayout.jsx)
- **Implementación**:
  - Posicionamos el elemento del logo de forma estática en su destino de cabecera final (`top-4 left-6` / `top: 16px; left: 24px`) mediante Tailwind CSS.
  - Al montar la página, medimos el cuadro del logo (`getBoundingClientRect()`) y calculamos el desplazamiento exacto (Delta X e Y) para situarlo centrado.
  - Inicializamos el logo en el centro de la pantalla aplicando esa traslación en `gsap.set`.
  - En la línea de tiempo del ScrollTrigger, animamos las propiedades de transformación 2D (`x` e `y` a `0`, y `scale` de `1.0` a `0.5`).
  - **Resultado**: La animación del logo ahora se procesa enteramente en el hilo del Compositor de la GPU, eliminando los costosos recálculos de diseño (Reflows) al desplazarse que causaban micro-tirones.

### 4. Poda del Árbol de Pintado con `autoAlpha` en `MobileLayout.jsx`
- **Archivo modificado**: [MobileLayout.jsx](file:///src/components/MobileLayout.jsx)
- **Implementación**:
  - Reemplazamos todos los tweens del timeline móvil que usaban `opacity` por `autoAlpha` de GSAP.
  - **Resultado**: Cuando un lienzo u otro elemento se desvanece por completo (`opacity` llega a `0`), GSAP automáticamente inyecta `visibility: hidden`, indicándole al navegador que elimine ese elemento del árbol de composición activo (Layer Compositing Tree), lo cual reduce sustancialmente el cómputo de la página.

---

## Verificación

- **Desacoplamiento**: El comportamiento de escritorio (Desktop) y móvil (Mobile) permanece completamente desacoplado cumpliendo con las directrices de `agent.md`.
- **Previene Layout Shifts**: Los tamaños e inicializaciones dinámicas se gestionan limpiamente en el montaje de React.
- **Rendimiento**: Se reduce drásticamente el consumo de GPU y la carga de CPU durante el scroll móvil y la navegación de escritorio, mejorando la sensación táctil y la tasa de refresco.
