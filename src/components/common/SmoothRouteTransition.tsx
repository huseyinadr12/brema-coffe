import React, { useEffect, useRef, useState } from 'react';
import { Location, useLocation } from 'react-router-dom';
import { useCoffeeReveal } from '../../hooks/useCoffeeReveal';
import { useScroll3DReveal } from '../../hooks/useScroll3DReveal';

interface SmoothRouteTransitionProps {
  children: (location: Location) => React.ReactNode;
}

type Phase = 'idle' | 'leaving' | 'entering';

/**
 * A CSS-composited perspective transition. It stays visually substantial
 * without competing with the WebGL scenes for the main thread.
 */
export const SmoothRouteTransition: React.FC<SmoothRouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayed, setDisplayed] = useState<Location>(location);
  const [phase, setPhase] = useState<Phase>('idle');
  const activePath = useRef(location.pathname);
  const timers = useRef<number[]>([]);

  useCoffeeReveal(displayed.pathname);
  useScroll3DReveal(displayed.pathname);

  useEffect(() => {
    if (location.pathname === activePath.current) return;

    timers.current.forEach(window.clearTimeout);
    timers.current = [];

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const leaveDuration = reduced ? 0 : 320;
    const enterDuration = reduced ? 0 : 520;

    setPhase('leaving');

    const swapTimer = window.setTimeout(() => {
      activePath.current = location.pathname;
      setDisplayed(location);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      requestAnimationFrame(() => setPhase(reduced ? 'idle' : 'entering'));

      const finishTimer = window.setTimeout(() => setPhase('idle'), enterDuration);
      timers.current.push(finishTimer);
    }, leaveDuration);

    timers.current.push(swapTimer);

    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [location]);

  return (
    <>
      <div className={`route-stage route-stage--${phase}`}>
        {children(displayed)}
      </div>

      <div className={`route-veil route-veil--${phase}`} aria-hidden="true">
        <div className="route-veil__panel route-veil__panel--left" />
        <div className="route-veil__panel route-veil__panel--right" />
        <div className="route-veil__mark">
          <span>BREMA</span>
          <small>ÇEKİRDEKTEN FİNCANA</small>
        </div>
        <div className="route-progress" />
      </div>
    </>
  );
};
