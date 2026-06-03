import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ImageDistortion = ({ imageSrc, className = "", passiveWaves = true }) => {
  const containerRef = useRef(null);
  
  // Keep track of mouse positions for smooth interpolation (lerp)
  const mouseRef = useRef({ x: -10.0, y: -10.0 });
  const targetMouseRef = useRef({ x: -10.0, y: -10.0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    // Fallback to 1 to prevent division by zero or NaN aspect ratios
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup (Orthographic for 2D plane rendering)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 4. Shaders
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_aspect;
      uniform float u_imageAspect;
      uniform float u_passive_strength;

      void main() {
        vec2 uv = vUv;
        
        // Correct UVs to cover container without stretching (similar to object-fit: cover)
        if (u_aspect > u_imageAspect) {
          float scaleY = u_imageAspect / u_aspect;
          uv.y = (uv.y - 0.5) * scaleY + 0.5;
        } else {
          float scaleX = u_aspect / u_imageAspect;
          uv.x = (uv.x - 0.5) * scaleX + 0.5;
        }

        // Apply distortion using aspect-corrected coordinates
        vec2 uvCorrected = vec2(uv.x * u_aspect, uv.y);
        vec2 mouseCorrected = vec2(u_mouse.x * u_aspect, u_mouse.y);
        
        float dist = distance(uvCorrected, mouseCorrected);
        
        // Distortion parameters
        float radius = 0.15; // Radius of mouse influence
        float strength = 0.06; // Strength of deformation
        
        if (dist < radius) {
          // Smooth falloff factor
          float factor = 1.0 - smoothstep(0.0, radius, dist);
          
          // Liquid animation wave based on time and distance
          float wave = sin(u_time * 6.0 + dist * 35.0) * 0.015 * factor;
          
          // Displacement direction (away from the mouse)
          vec2 diff = uvCorrected - mouseCorrected;
          // Add small epsilon to prevent division by zero
          vec2 dir = diff / (dist + 0.00001);
          
          // Apply displacement to UV coordinates
          uv += dir * (strength * factor + wave);
        } else {
          // Continuous, gentle, and elegant liquid wave animation (reduced further for extreme subtlety)
          float waveX = sin(u_time * 1.5 + uv.y * 7.0) * 0.0013 * u_passive_strength;
          float waveY = cos(u_time * 1.2 + uv.x * 7.0) * 0.0008 * u_passive_strength;
          uv.x += waveX;
          uv.y += waveY;
        }
        
        // Clamp UVs to prevent edge repetition wrapping artifacts
        uv = clamp(uv, 0.001, 0.999);
        
        // Sample texture
        vec4 color = texture2D(u_texture, uv);
        gl_FragColor = color;
      }
    `;

    // 5. Texture Loading
    const textureLoader = new THREE.TextureLoader();
    let material;
    let geometry;
    let mesh;

    textureLoader.load(imageSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      const imageAspect = texture.image.width / texture.image.height;

      // Create shader material
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          u_texture: { value: texture },
          u_mouse: { value: new THREE.Vector2(-10.0, -10.0) },
          u_time: { value: 0.0 },
          u_aspect: { value: width / height },
          u_imageAspect: { value: imageAspect },
          u_passive_strength: { value: passiveWaves ? 1.0 : 0.0 }
        },
        transparent: true
      });

      // Create mesh
      geometry = new THREE.PlaneGeometry(2, 2);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }, undefined, (err) => {
      console.error("Error loading texture:", err);
    });

    // 6. Mouse & Touch Interaction Handlers
    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1.0 - (event.clientY - rect.top) / rect.height; // Invert Y for WebGL
      targetMouseRef.current = { x, y };
    };

    const handleMouseLeave = () => {
      // Smoothly hide distortion by moving target coordinates far away
      targetMouseRef.current = { x: -10.0, y: -10.0 };
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1.0 - (touch.clientY - rect.top) / rect.height; // Invert Y for WebGL
        targetMouseRef.current = { x, y };
      }
    };

    const handleTouchEnd = () => {
      targetMouseRef.current = { x: -10.0, y: -10.0 };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchMove, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (material) {
        material.uniforms.u_aspect.value = w / h;
      }
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop with IntersectionObserver and visibility optimizations
    let animationFrameId;
    let isIntersecting = false; // start as false, observer will trigger it on mount if visible
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isIntersecting) return; // Stop drawing if not intersecting (will resume when observer fires)

      // GSAP changes opacity and visibility styles on the parent container.
      // We check them to skip the expensive renderer.render() call if the element is invisible.
      const parent = container.parentElement;
      const opacity = parent ? parent.style.opacity : container.style.opacity;
      const visibility = parent ? parent.style.visibility : container.style.visibility;
      const isVisible = (opacity === "" || parseFloat(opacity) > 0.01) && visibility !== "hidden";

      if (isVisible) {
        // Lerp mouse positions for smooth organic transition (faster response)
        mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.25;
        mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.25;

        if (material) {
          material.uniforms.u_time.value = clock.getElapsedTime();
          material.uniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);
        }

        renderer.render(scene, camera);
      }

      // Continue the animation loop only if intersecting
      animationFrameId = requestAnimationFrame(animate);
    };

    // 8.5 Setup Intersection Observer to pause drawing when offscreen
    let observer;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        const newIntersecting = entry.isIntersecting;
        
        if (newIntersecting && !isIntersecting) {
          isIntersecting = true;
          animate();
        } else {
          isIntersecting = newIntersecting;
        }
      }, { threshold: 0.01 });
      
      observer.observe(container);
    } else {
      animate(); // Fallback if IntersectionObserver is not supported
    }

    // 9. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchMove);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      
      if (observer) {
        observer.disconnect();
      }
      
      if (renderer) {
        renderer.dispose();
        // Check if domElement is still a child before removing it to prevent DOM exceptions
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();
    };
  }, [imageSrc, passiveWaves]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden w-full h-full cursor-crosshair rounded-2xl shadow-2xl border border-white/5 ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
};

export default ImageDistortion;
