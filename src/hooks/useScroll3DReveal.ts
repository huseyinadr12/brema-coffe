import { useEffect } from 'react';

type RevealVariant = 'section' | 'card' | 'scene';

/**
 * Adds compositor-only perspective reveals to page sections and feature cards.
 * The page markup remains readable without JavaScript and the observer stops
 * watching an element as soon as its entrance has completed.
 */
export function useScroll3DReveal(routeKey: string) {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const tagged = new Set<HTMLElement>();

    const raf = requestAnimationFrame(() => {
      const root = document.querySelector<HTMLElement>('.route-stage .theme-page');
      if (!root) return;

      const candidates = new Map<HTMLElement, RevealVariant>();

      Array.from(root.children).forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        const position = window.getComputedStyle(node).position;
        if (position === 'absolute' || position === 'fixed') return;
        candidates.set(node, node.classList.contains('scene-card') ? 'scene' : 'section');
      });

      root.querySelectorAll<HTMLElement>('.luxury-glass').forEach((node) => {
        candidates.set(node, 'card');
      });
      root.querySelectorAll<HTMLElement>('.scene-card').forEach((node) => {
        candidates.set(node, 'scene');
      });
      root.querySelectorAll<HTMLElement>('.taste-card, .choice-card').forEach((node) => {
        candidates.set(node, 'card');
      });

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      candidates.forEach((variant, node) => {
        tagged.add(node);
        node.dataset.scroll3d = variant;
        node.dataset.scroll3dAuto = '';

        const index = tagged.size - 1;
        node.style.setProperty('--scroll-3d-delay', `${(index % 4) * 55}ms`);
        node.style.setProperty('--scroll-3d-rotate', index % 2 === 0 ? '-3.5deg' : '3.5deg');
      });

      if (reduced || typeof IntersectionObserver === 'undefined') {
        tagged.forEach((node) => node.classList.add('is-scroll-visible'));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-scroll-visible');
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
      );

      tagged.forEach((node) => observer?.observe(node));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      tagged.forEach((node) => {
        if (!node.hasAttribute('data-scroll-3d-auto')) return;
        node.classList.remove('is-scroll-visible');
        delete node.dataset.scroll3d;
        delete node.dataset.scroll3dAuto;
        node.style.removeProperty('--scroll-3d-delay');
        node.style.removeProperty('--scroll-3d-rotate');
      });
    };
  }, [routeKey]);
}
