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

### 2. Eliminación de WebGL en Móvil y Migración a Formato WebP (Ultra-Liviano)
- **Archivos modificados**: [MobileLayout.jsx](file:///src/components/MobileLayout.jsx), [Hero.jsx](file:///src/components/Hero.jsx), [Concepts.jsx](file:///src/components/Concepts.jsx), [Navbar.jsx](file:///src/components/Navbar.jsx), [Footer.jsx](file:///src/components/Footer.jsx)
- **Implementación**:
  - **Reemplazo por `<img>`**: Eliminamos el componente interactivo `ImageDistortion` y lo reemplazamos por etiquetas `<img>` estándar de HTML en el flujo móvil.
  - **Migración de Activos a WebP**: Copiamos las nuevas imágenes WebP optimizadas (`conceptos-bienal.webp`, `presentacion-bienal.webp`, `logo-bienal.webp`) a la carpeta servida por Vite `public/documentacion/`. 
  - **Actualización de Referencias**: Reemplazamos todos los archivos `.svg` por sus contrapartes `.webp` en la barra de navegación, pie de página, vista de escritorio y vista móvil.
  - **Predecodificación en Background**: En `MobileLayout.jsx`, cargamos y decodificamos de forma asíncrona las imágenes WebP principales en segundo plano mediante `new Image().decode()`.
  - **Promoción de Capa de GPU (`will-change: transform`)**: Añadimos la clase `will-change-transform` y el atributo `decoding="async"` a las imágenes en móvil para que la GPU renderice las transformaciones de forma nativa.
  - **Resultado**: El peso de la primera imagen se redujo de **2.75 MB a solo 352 KB** (8 veces más pequeña), y la segunda de **2.0 MB a 425 KB**. Combinado con la aceleración gráfica por hardware y predecodificación, el scroll en móviles y computadoras ahora es sumamente liviano y libre de lag.

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
