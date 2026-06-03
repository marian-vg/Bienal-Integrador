# Plan de Optimización de Rendimiento - Bienal Integrador

Este documento detalla las estrategias para optimizar el rendimiento y reducir el consumo de cómputo (CPU y GPU) causado por las animaciones de GSAP y los lienzos interactivos de WebGL (Three.js).

## Diagnóstico de Cuellos de Botella

1. **Renderizado de WebGL Continuo (Gasto Innecesario de GPU)**:
   - El componente `ImageDistortion` inicia un ciclo de renderizado continuo (`requestAnimationFrame`) que dibuja la escena en cada frame.
   - En **Escritorio**, el lienzo de `Concepts` se renderiza constantemente incluso si el usuario está en el Hero (fuera de la vista).
   - En **Móvil**, tanto el lienzo del `Hero` como el de `Concepts` están en el DOM y se renderizan simultáneamente en segundo plano, aunque uno de ellos tenga opacidad `0`.
   
2. **Reflows de Layout (Gasto de CPU en Timeline)**:
   - En `MobileLayout.jsx`, la animación del logo modifica las propiedades `top` y `left` de `"50%"` a `"16px"` y `"24px"`.
   - Modificar propiedades de diseño como `top`, `left`, `width`, `height` fuerza al navegador a recalcular el árbol de diseño (Layout/Reflow) en cada tick del ScrollTrigger. Esto causa tartamudeos (stuttering) especialmente en dispositivos móviles.

3. **Opacidad vs Visibilidad**:
   - Elementos con opacidad `0` siguen siendo procesados por el motor de renderizado del navegador y consumen recursos de composición web.

---

## Plan de Acción

### Paso 1: Optimización de WebGL en `ImageDistortion.jsx`
Implementaremos dos niveles de control de ciclo para pausar el renderizado cuando no sea visible:
1. **IntersectionObserver**: Pausar completamente el bucle de `requestAnimationFrame` cuando el contenedor salga del viewport (ideal para Desktop).
2. **Detección de Visibilidad en el Parent (Inline Styles)**: En el bucle de animación, comprobar si el contenedor o su padre directo tienen `opacity === "0"` o `visibility === "hidden"`. Si es así, saltarse la llamada a `renderer.render()`. Leer estilos inline (`style.opacity`) es inmediato y no provoca reflows de diseño.

### Paso 2: Eliminación de Layout Thrashing en `MobileLayout.jsx`
Reemplazar la animación de layout (`top`/`left`) del logo por transformaciones de matriz (`x`, `y` y `scale` aceleradas por GPU):
1. Posicionar el logo de forma estática en su destino final (`top: 16px`, `left: 24px`) mediante CSS.
2. Al montar el componente (`useEffect`), calcular la distancia matemática (Delta X y Delta Y) desde la posición inicial (esquina superior izquierda) hasta el centro de la pantalla.
3. Usar `gsap.set` para aplicar esa traslación inicial `x` e `y` y `scale: 1.0` (para que aparezca centrado como Hero).
4. En el timeline, animar `x` e `y` a `0` y `scale` a `0.5`. Al usar solo transformaciones 3D/2D, la animación se ejecutará al 100% en la GPU (compositor thread) sin provocar reflows.

### Paso 3: Uso de `autoAlpha` en GSAP
Modificar las animaciones del timeline en `MobileLayout.jsx` para que usen `autoAlpha` en lugar de `opacity`:
- `autoAlpha` es una propiedad especial de GSAP que combina `opacity` y `visibility`. Cuando `autoAlpha` llega a `0`, GSAP aplica automáticamente `visibility: hidden` al elemento, retirándolo del flujo de renderizado activo del navegador.

### Paso 4: Pruebas y Verificación
- Verificar que las animaciones visualmente sigan siendo idénticas y fluidas.
- Confirmar que los renderizadores de Three.js detienen sus ciclos y llamadas a `render` cuando están ocultos u offscreen.
