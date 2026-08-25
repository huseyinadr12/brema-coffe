import React, { useEffect, useRef, useState } from 'react';

type CursorMode = 'default' | 'interactive' | 'label';

interface CursorView {
  visible: boolean;
  mode: CursorMode;
  text: string;
}

const INITIAL_VIEW: CursorView = { visible: false, mode: 'default', text: '' };

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: -100, y: -100 });
  const trailing = useRef({ x: -100, y: -100 });
  const hasPosition = useRef(false);
  const [view, setView] = useState<CursorView>(INITIAL_VIEW);

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarsePointer || reducedMotion) return;

    let frame = 0;
    document.documentElement.classList.add('custom-cursor-enabled');

    const updateView = (next: CursorView) => {
      setView((current) =>
        current.visible === next.visible &&
        current.mode === next.mode &&
        current.text === next.text
          ? current
          : next
      );
    };

    const handleMouseMove = (event: MouseEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };

      if (!hasPosition.current) {
        trailing.current = { ...pointer.current };
        hasPosition.current = true;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }

      const target = event.target instanceof Element ? event.target : null;
      const nativeControl = target?.closest('input, select, textarea, [contenteditable="true"]');
      if (nativeControl) {
        updateView({ ...INITIAL_VIEW });
        return;
      }

      const cursorHost = target?.closest<HTMLElement>('[data-cursor]');
      const cursorText = cursorHost?.dataset.cursor?.trim() ?? '';
      const interactive = Boolean(target?.closest('a, button, [role="button"]'));

      updateView({
        visible: true,
        mode: cursorText ? 'label' : interactive ? 'interactive' : 'default',
        text: cursorText,
      });
    };

    const handleMouseLeave = () => updateView({ ...INITIAL_VIEW });
    const handleMouseDown = () => layerRef.current?.classList.add('is-pressed');
    const handleMouseUp = () => layerRef.current?.classList.remove('is-pressed');

    const animate = () => {
      trailing.current.x += (pointer.current.x - trailing.current.x) * 0.2;
      trailing.current.y += (pointer.current.y - trailing.current.y) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailing.current.x}px, ${trailing.current.y}px, 0) translate(-50%, -50%)`;
      }

      frame = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    frame = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className={`custom-cursor ${view.visible ? 'is-visible' : ''} is-${view.mode}`}
      aria-hidden="true"
    >
      <span ref={dotRef} className="custom-cursor__dot" />
      <span ref={ringRef} className="custom-cursor__ring">
        {view.mode === 'label' && <span>{view.text}</span>}
      </span>
    </div>
  );
};
