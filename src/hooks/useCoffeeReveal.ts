import { useEffect } from 'react';

/**
 * Reveals every section heading as it scrolls into view, drawing a short
 * "pour line" underneath it. Headings are tagged from JS rather than in every
 * page so the effect stays in one place — the markup, and therefore what a
 * crawler reads, is untouched.
 */
export function useCoffeeReveal(routeKey: string) {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    let observer: IntersectionObserver | null = null;

    // Wait for the route's DOM to commit before tagging.
    const raf = requestAnimationFrame(() => {
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>('main h2, main [data-reveal]')
      );
      if (!targets.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
      );

      targets.forEach((el) => {
        el.setAttribute('data-coffee-reveal', '');
        observer!.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      document
        .querySelectorAll('[data-coffee-reveal]')
        .forEach((el) => el.removeAttribute('data-coffee-reveal'));
    };
  }, [routeKey]);
}
