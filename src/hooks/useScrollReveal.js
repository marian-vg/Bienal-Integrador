import { useEffect, useRef } from 'react';

const useScrollReveal = (options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Disconnect observer if triggerOnce is enabled (default)
          if (options.triggerOnce !== false) {
            observer.unobserve(entry.target);
          }
        } else if (options.triggerOnce === false) {
          entry.target.classList.remove('reveal-visible');
        }
      },
      {
        threshold: options.threshold || 0.15,
        rootMargin: options.rootMargin || '0px -10px -50px -10px',
        ...options
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      currentEl.classList.add('reveal-hidden');
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [options]);

  return elementRef;
};

export default useScrollReveal;
