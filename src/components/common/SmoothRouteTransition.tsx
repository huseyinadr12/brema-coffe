import React, { useEffect, useRef, useState } from 'react';
import { Location, useLocation } from 'react-router-dom';
import { useCoffeeReveal } from '../../hooks/useCoffeeReveal';

interface SmoothRouteTransitionProps {
  children: (location: Location) => React.ReactNode;
}

type Phase = 'idle' | 'leaving' | 'entering';

/**
 * A deliberately light route transition.
 *
 * The previous full-screen coffee pour animated several SVGs while the next
 * WebGL scene compiled. This transition only animates opacity and transform,
 * leaving the compositor free to keep navigation responsive.
 */
export const SmoothRouteTransition: React.FC<SmoothRouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayed, setDisplayed] = useState<Location>(location);
  const [phase, setPhase] = useState<Phase>('idle');
  const activePath = useRef(location.pathname);
  const timers = useRef<number[]>([]);

  useCoffeeReveal(displayed.pathname);

  useEffect(() => {
    if (location.pathname === activePath.current) return;

    timers.current.forEach(window.clearTimeout);
    timers.current = [];

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const leaveDuration = reduced ? 0 : 120;
    const enterDuration = reduced ? 0 : 300;

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
    <div className={`route-stage route-stage--${phase}`}>
      <div className="route-progress" aria-hidden="true" />
      {children(displayed)}
    </div>
  );
};
