import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const customAction = target.closest('[data-cursor]')?.getAttribute('data-cursor');
        const isInteractive = target.closest('button, a, input, select, [role="button"]');

        if (customAction) {
          setCursorText(customAction);
          setIsHovered(true);
        } else if (isInteractive) {
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  useEffect(() => {
    const followCursor = () => {
      setTrailing((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18,
      }));
      requestRef.current = requestAnimationFrame(followCursor);
    };
    requestRef.current = requestAnimationFrame(followCursor);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
      {/* Precision Center Dot */}
      <div
        className="fixed w-2 h-2 rounded-full bg-[#FAF4EB] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 shadow-[0_0_10px_#D49B5B]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isHovered && cursorText ? 0 : 1,
        }}
      />

      {/* Outer Trailing Ring / Pill */}
      <div
        className={`fixed flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out ${
          cursorText
            ? 'px-4 py-1.5 bg-[#FAF4EB] text-[#140C08] text-[10px] font-mono font-bold tracking-[0.25em] shadow-[0_0_25px_rgba(212,155,91,0.5)] border border-[#D49B5B]'
            : isHovered
            ? 'w-12 h-12 border border-[#D49B5B] bg-[#D49B5B]/15 backdrop-blur-[1px]'
            : 'w-8 h-8 border border-[#FAF4EB]/30'
        }`}
        style={{
          left: `${trailing.x}px`,
          top: `${trailing.y}px`,
        }}
      >
        {cursorText && <span>{cursorText}</span>}
      </div>
    </div>
  );
};
