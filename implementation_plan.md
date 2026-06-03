# Plan de Implementación - Refinamiento Estético y Tipográfico (Bienal Integrador)

Este plan detalla los pasos para realizar ajustes finos sobre la versión Desktop y actualizar la tipografía de la versión Mobile para una presentación disruptiva y original, acorde a la identidad de una Bienal de Diseño.

## Cambios Propuestos

### 1. Refinamiento en Desktop

#### A. Reducción de la Intensidad del Movimiento Pasivo (en un 25-30%)
- **Archivo**: [ImageDistortion.jsx](file:///src/components/ImageDistortion.jsx)
- **Implementación**: Disminuiremos la amplitud de las ondas del fragment shader para lograr un movimiento pasivo aún más sutil y refinado.
  - Valores actuales: `0.0018` en X y `0.0012` en Y.
  - Nuevos valores optimizados: `0.0013` en X y `0.0008` en Y (reducción aproximada del 30%).
  ```glsl
  float waveX = sin(u_time * 1.5 + uv.y * 7.0) * 0.0013 * u_passive_strength;
  float waveY = cos(u_time * 1.2 + uv.x * 7.0) * 0.0008 * u_passive_strength;
  ```

#### B. Mayor Contraste en la Sombra de la Imagen de Conceptos
- **Archivo**: [Concepts.jsx](file:///src/components/Concepts.jsx)
- **Implementación**: Para destacar la tarjeta sobre el fondo oscuro (`#0c0102`), incrementaremos la opacidad y dispersión de la sombra ambiental roja.
  - Anterior: `shadow-[...,_0_20px_50px_-20px_rgba(230,57,70,0.25)]`
  - Nueva Sombra Acentuada:
    `shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95),_0_20px_40px_-10px_rgba(230,57,70,0.55)]`
  - Al duplicar la opacidad del halo rojo (de `0.25` a `0.55`) y ajustar la dispersión, la sombra creará un brillo tipo neon/retroiluminado muy visible.

---

### 2. Actualización de Tipografía y Tarjetas en Mobile y Desktop

#### A. Importación del Nuevo Font "Rubik Glitch" (Local .ttf para Producción)
- **Archivo**: [index.css](file:///src/index.css)
- **Implementación**: 
  - Usaremos los archivos locales `.ttf` (por ejemplo, `src/assets/fonts/RubikGlitch-Regular.ttf` y `src/assets/fonts/Barriecito-Regular.ttf`) mediante `@font-face` en `index.css`.
  - Definiremos las variables tipográficas en el bloque `@theme` de Tailwind:
    ```css
    --font-glitch: 'Rubik Glitch', system-ui;
    --font-barriecito: 'Barriecito', system-ui;
    ```

#### B. Estilizar Tarjetas con Rubik Glitch
- **Archivos**: [MobileLayout.jsx](file:///src/components/MobileLayout.jsx), [Concepts.jsx](file:///src/components/Concepts.jsx)
- **Implementación**:
  - Cambiaremos la tipografía de los títulos y los números indicativos de las tarjetas conceptuales para usar `font-glitch` (tanto en Desktop como en Mobile).
  - Mantendremos el título "Conceptos" con la fuente normal/disruptiva sin aplicar el glitch, para que no interfiera en la legibilidad global.
  - Ejemplo de clase de tarjeta en Mobile:
    ```jsx
    <div className="mobile-card-1 border border-[#3b82f6]/25 bg-[#112240]/45 backdrop-blur-lg p-4 rounded-xl flex items-center gap-4 ...">
      <span className="font-glitch text-2xl text-white/35">01</span>
      <h3 className="font-glitch text-lg text-white tracking-wide">Transformación</h3>
    </div>
    ```
