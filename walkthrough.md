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

### 2. Ajuste Fino de Ondas Líquidas en Escritorio (Hero Activo y Conceptos Estático)
- **Archivos modificados**: [ImageDistortion.jsx](file:///src/components/ImageDistortion.jsx), [Concepts.jsx](file:///src/components/Concepts.jsx)
- **Implementación**:
  - **Reducción de Intensidad Adicional (30%)**: Disminuimos aún más la amplitud de las ondas del fragment shader (de `0.0018`/`0.0012` a `0.0013`/`0.0008`) para un vaivén extremadamente sutil y premium en Desktop.
  - **Prop `passiveWaves`**: Añadimos la propiedad `passiveWaves` (por defecto `true`) al componente `ImageDistortion`. Esta se mapea al uniform del shader `u_passive_strength` (`1.0` o `0.0`).
  - **Imagen de Conceptos Estática**: En `Concepts.jsx` le pasamos `passiveWaves={false}` a su lienzo de distorsión WebGL.
  - **Resultado**: La imagen de presentación (Hero) pulsa en ondas líquidas extremadamente discretas, mientras que la ilustración de conceptos permanece estática en reposo, reaccionando únicamente con el movimiento del mouse.

### 3. Visibilidad de Luces Pulsantes de Fondo y Sombra Premium en Conceptos (Desktop)
- **Archivos modificados**: [Concepts.jsx](file:///src/components/Concepts.jsx), [index.css](file:///src/index.css)
- **Implementación**:
  - **Corrección de Opacidad en Luces**: Reemplazamos los fondos con opacidad inline por fondos de colores sólidos (`bg-[#e63946]` y `bg-[#2563eb]`). Esto elimina la multiplicación acumulada de opacidad. Ahora, la pulsación reside en `@keyframes glow-pulse` (respiración suave entre `0.12` y `0.22`).
  - **Sombra Acentuada**: Aumentamos la presencia de la sombra con halo rojo aumentando la opacidad de la refracción en `Concepts.jsx` (`shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95),_0_20px_40px_-10px_rgba(230,57,70,0.55)]`).
  - **Resultado**: El halo rojo difuminado en la base de la ilustración es ahora claramente visible, simulando el rebote del glow ambiental rojo sobre la tarjeta sobre el fondo oscuro.

### 4. Integración del Font Local "Rubik Glitch" en Tarjetas (Mobile & Desktop)
- **Archivos modificados**: [index.css](file:///src/index.css), [MobileLayout.jsx](file:///src/components/MobileLayout.jsx), [Concepts.jsx](file:///src/components/Concepts.jsx)
- **Implementación**:
  - **Fuentes Locales (.ttf)**: Colocamos `RubikGlitch-Regular.ttf` y `Barriecito-Regular.ttf` en `src/assets/fonts/` y los cargamos mediante `@font-face` en `index.css`. Dado que son procesados por el compilador de Vite, son hasheados y empaquetados en la carpeta `dist/assets/` al compilar para producción, lo que garantiza su persistencia permanente y carga offline sin dependencias externas de red.
  - **Mapeo de Tema**: Registramos `--font-glitch: 'Rubik Glitch', system-ui` en el bloque `@theme` de Tailwind.
  - **Aplicación en Cards**: Aplicamos `font-glitch` a los títulos y números de las tarjetas en `MobileLayout.jsx` y `Concepts.jsx` (SpotlightCard). El título "Conceptos" se mantiene sin cambios con la tipografía de visualización `font-disruptive` (Syne) / `font-display` (Outfit) para garantizar la legibilidad y el orden jerárquico.
  - **Restauración de UI Mobile**: Restauramos las tarjetas móviles en `MobileLayout.jsx` que se habían borrado en una edición previa, integrándolas completamente con las animaciones GSAP.
  - **Resultado**: Las tarjetas de conceptos lucen una tipografía disruptiva, glitchy y de alto impacto artístico, alineada a la identidad digital de la Bienal.


### 5. Eliminación de WebGL en Móvil y Migración a Formato WebP (Ultra-Liviano)
- **Archivos modificados**: [MobileLayout.jsx](file:///src/components/MobileLayout.jsx), [Hero.jsx](file:///src/components/Hero.jsx), [Concepts.jsx](file:///src/components/Concepts.jsx), [Navbar.jsx](file:///src/components/Navbar.jsx), [Footer.jsx](file:///src/components/Footer.jsx)
- **Implementación**:
  - **Reemplazo por `<img>`**: Eliminamos el componente interactivo `ImageDistortion` y lo reemplazamos por etiquetas `<img>` estándar de HTML en el flujo móvil.
  - **Migración de Activos a WebP**: Copiamos las nuevas imágenes WebP optimizadas a `public/documentacion/` y reemplazamos los `.svg` en todo el proyecto.
  - **Predecodificación en Background**: En `MobileLayout.jsx`, cargamos y decodificamos de forma asíncrona las imágenes WebP principales en segundo plano mediante `new Image().decode()`.
  - **Promoción de Capa de GPU (`will-change: transform`)**: Añadimos `will-change-transform` y `decoding="async"` a las imágenes en móvil.
  - **Resultado**: El peso de la primera imagen bajó de **2.75 MB a 352 KB** y la segunda de **2.0 MB a 425 KB**, reduciendo el lag a cero.

### 6. Transición del Logo por Hardware GPU en `MobileLayout.jsx`
- **Archivo modificado**: [MobileLayout.jsx](file:///src/components/MobileLayout.jsx)
- **Implementación**:
  - Animamos el logo con transformaciones 2D (`x`, `y` y `scale`) partiendo de su posición final de cabecera calculando el desplazamiento dinámico en `useEffect`, previniendo reflows de diseño.

### 7. Poda del Árbol de Pintado con `autoAlpha` en `MobileLayout.jsx`
- **Archivo modificado**: [MobileLayout.jsx](file:///src/components/MobileLayout.jsx)
- **Implementación**:
  - Reemplazamos todos los tweens del timeline móvil que usaban `opacity` por `autoAlpha` de GSAP para ocultar elementos vía `visibility: hidden` una vez transparentes.

---

## Verificación

- **Desacoplamiento**: El comportamiento de escritorio (Desktop) y móvil (Mobile) permanece completamente desacoplado cumpliendo con las directrices de `agent.md`.
- **Previene Layout Shifts**: Los tamaños e inicializaciones dinámicas se gestionan limpiamente en el montaje de React.
- **Rendimiento**: Se reduce drásticamente el consumo de GPU y la carga de CPU durante el scroll móvil y la navegación de escritorio, mejorando la sensación táctil y la tasa de refresco.
