# Instrucciones del Proyecto & Restricciones del Agente (agent.md)

Este archivo contiene restricciones de diseño y desarrollo obligatorias para todos los agentes de IA que trabajen en este repositorio.

## ⚠️ RESTRICCIÓN CRÍTICA: Desacoplamiento Completo de UI Desktop y UI Mobile

1. **Aislamiento de Código de UI**:
   - Las interfaces para escritorio (**Desktop**) y dispositivos móviles (**Mobile**) deben estar **100% desacopladas**.
   - Bajo ninguna circunstancia se debe mezclar lógica móvil, hooks condicionales de tamaño (`useMediaQuery`, etc.) o importaciones de layouts móviles dentro del flujo principal de componentes de escritorio ([Hero.jsx](file:///src/components/Hero.jsx), [Concepts.jsx](file:///src/components/Concepts.jsx), [Navbar.jsx](file:///src/components/Navbar.jsx)).

2. **Ruta de Control**:
   - El punto de decisión de qué interfaz renderizar reside exclusivamente en la raíz de la aplicación ([src/App.jsx](file:///src/App.jsx)).
   - Si se detecta un viewport móvil (`isMobile`), la aplicación redirige el render completo a [MobileLayout.jsx](file:///src/components/MobileLayout.jsx).
   - El resto de los componentes ([Hero.jsx](file:///src/components/Hero.jsx), [Concepts.jsx](file:///src/components/Concepts.jsx)) deben permanecer limpios, sirviendo únicamente como la **UI Desktop original** (sin imports de móviles ni condicionales anidados).

3. **Efectos y Estilos**:
   - Las animaciones pesadas de scroll de tipo timeline (GSAP ScrollTrigger, anclaje/pinning) pertenecen de forma exclusiva al flujo móvil y deben estar encapsuladas en `MobileLayout.jsx`.
   - Los efectos de interacción WebGL (distorsión interactiva por ratón) y spotlight cards se ejecutan en Desktop de forma nativa a través de los componentes principales.
