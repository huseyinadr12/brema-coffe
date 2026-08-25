import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, Location } from 'react-router-dom';
import gsap from 'gsap';
import { getRouteMeta } from '../../data/seo';
import { useCoffeeReveal } from '../../hooks/useCoffeeReveal';

interface CoffeeTransitionProps {
  children: (location: Location) => React.ReactNode;
}

const BEAN_COUNT = 9;

/** Single stylised bean used for the falling debris during the pour. */
const Bean: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  style,
}) => (
  <svg viewBox="0 0 60 84" className={className} style={style} aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="beanFill" cx="38%" cy="30%" r="78%">
        <stop offset="0%" stopColor="#8A5733" />
        <stop offset="55%" stopColor="#4A2B18" />
        <stop offset="100%" stopColor="#22130B" />
      </radialGradient>
    </defs>
    <ellipse cx="30" cy="42" rx="25" ry="39" fill="url(#beanFill)" />
    <path
      d="M30 6 C 39 26, 21 58, 30 78"
      stroke="#E4CDAF"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      opacity="0.75"
    />
    <path
      d="M30 6 C 39 26, 21 58, 30 78"
      stroke="#160C06"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
      opacity="0.9"
    />
  </svg>
);

/** Wavy meniscus that rides the leading edge of the poured coffee. */
const Meniscus: React.FC<
  { flip?: boolean; className?: string } & React.SVGProps<SVGSVGElement>
> = ({ flip, className, ...rest }) => (
  <svg
    {...rest}
    className={className}
    viewBox="0 0 1440 90"
    preserveAspectRatio="none"
    aria-hidden="true"
    style={flip ? { transform: 'scaleY(-1)' } : undefined}
  >
    <path
      d="M0,0 L1440,0 L1440,34 C1320,74 1200,10 1080,34 C960,58 840,4 720,30 C600,56 480,8 360,32 C240,56 120,12 0,36 Z"
      fill="#2A180E"
    />
    <path
      d="M0,26 C120,2 240,46 360,22 C480,-2 600,46 720,20 C840,-6 960,48 1080,24 C1200,0 1320,64 1440,24 L1440,40 C1320,80 1200,16 1080,40 C960,64 840,10 720,36 C600,62 480,14 360,38 C240,62 120,18 0,42 Z"
      fill="#C08A46"
      opacity="0.55"
    />
  </svg>
);

/**
 * Route transition curtain: espresso is poured over the outgoing page, the
 * destination's name surfaces on the crema, then the coffee drains away to
 * reveal the new page. The route itself is swapped while the screen is fully
 * covered, so the reader never sees a blank flash or a scroll jump.
 */
export const CoffeeTransition: React.FC<CoffeeTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayed, setDisplayed] = useState<Location>(location);
  const [isBusy, setIsBusy] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const subLabelRef = useRef<HTMLDivElement>(null);
  const beansRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [pendingLabel, setPendingLabel] = useState(getRouteMeta(location.pathname).label);

  useCoffeeReveal(displayed.pathname);

  // Idle drift on the meniscus so the coffee surface never looks frozen.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('[data-meniscus]', {
        xPercent: -6,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, overlayRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (location.pathname === displayed.pathname) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setPendingLabel(getRouteMeta(location.pathname).label);
    setIsBusy(true);

    const swap = () => {
      setDisplayed(location);
      window.scrollTo(0, 0);
    };

    timelineRef.current?.kill();

    if (prefersReduced) {
      swap();
      gsap.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, onComplete: () => setIsBusy(false) }
      );
      return;
    }

    const beans = beansRef.current ? Array.from(beansRef.current.children) : [];
    const fallDistance = window.innerHeight + 320;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => setIsBusy(false),
    });
    timelineRef.current = tl;

    tl
      // — POUR ————————————————————————————————
      .set(overlayRef.current, { autoAlpha: 1 })
      .set(sheetRef.current, { yPercent: -103 })
      .set([labelRef.current, subLabelRef.current, ringRef.current, steamRef.current], {
        autoAlpha: 0,
      })
      .fromTo(
        streamRef.current,
        { scaleY: 0, scaleX: 0.35, autoAlpha: 1 },
        { scaleY: 1, scaleX: 1, duration: 0.34, ease: 'power2.in' },
        0
      )
      .to(sheetRef.current, { yPercent: 0, duration: 0.66 }, 0.08)
      .to(streamRef.current, { autoAlpha: 0, duration: 0.2 }, 0.5)
      .fromTo(
        beans,
        { y: -0.35 * fallDistance, autoAlpha: 0, rotate: -50, scale: 0.8 },
        {
          y: fallDistance,
          autoAlpha: 1,
          rotate: 300,
          scale: 1.1,
          duration: 1.35,
          stagger: { each: 0.06, from: 'random' },
          ease: 'power1.in',
        },
        0.02
      )

      // — SURFACE ——————————————————————————————
      .add(swap, 0.62)
      .fromTo(
        ringRef.current,
        { autoAlpha: 0, scale: 0.4, rotate: -60 },
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.55, ease: 'power2.out' },
        0.5
      )
      .fromTo(
        labelRef.current,
        { autoAlpha: 0, y: 26, letterSpacing: '0.08em' },
        { autoAlpha: 1, y: 0, letterSpacing: '0.34em', duration: 0.5, ease: 'power2.out' },
        0.56
      )
      .fromTo(
        subLabelRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.66
      )
      .fromTo(steamRef.current, { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 0.45 }, 0.6)

      // — DRAIN —————————————————————————————————
      .to([labelRef.current, subLabelRef.current], {
        autoAlpha: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      }, 1.18)
      .to([ringRef.current, steamRef.current], { autoAlpha: 0, duration: 0.28 }, 1.18)
      .to(sheetRef.current, { yPercent: 103, duration: 0.74 }, 1.3)
      .fromTo(
        pageRef.current,
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.66, ease: 'power2.out' },
        1.52
      )
      .set(overlayRef.current, { autoAlpha: 0 });

    return () => {
      tl.kill();
    };
    // `displayed` is intentionally read, not tracked: re-running on swap would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <div ref={pageRef} className="w-full">
        {children(displayed)}
      </div>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9000] overflow-hidden invisible opacity-0"
        style={{ pointerEvents: isBusy ? 'auto' : 'none' }}
        aria-hidden="true"
      >
        {/* Pour stream */}
        <div
          ref={streamRef}
          className="absolute left-1/2 top-0 h-full w-[70px] -translate-x-1/2 origin-top opacity-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(58,32,16,0) 0%, #3A2010 12%, #5A3418 45%, #2A180E 100%)',
            filter: 'blur(1px)',
            borderRadius: '0 0 40% 40%',
          }}
        />

        {/* The coffee itself */}
        <div ref={sheetRef} className="absolute inset-0 will-change-transform">
          <Meniscus
            data-meniscus
            flip
            className="absolute bottom-full left-[-6%] h-[70px] w-[112%]"
          />
          <div className="absolute inset-0 coffee-sheet" />
          <Meniscus data-meniscus className="absolute top-full left-[-6%] h-[90px] w-[112%]" />
        </div>

        {/* Falling beans — after the sheet so they stay visible during the pour */}
        <div ref={beansRef} className="absolute inset-0">
          {Array.from({ length: BEAN_COUNT }).map((_, i) => (
            <Bean
              key={i}
              className="absolute w-7 opacity-0 drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)] sm:w-10"
              style={{
                left: `${8 + (i * 84) / BEAN_COUNT + (i % 2 ? 4 : -4)}%`,
                top: 0,
              }}
            />
          ))}
        </div>


        {/* Destination plate, floating on the crema */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div ref={steamRef} className="absolute -translate-y-40 opacity-0">
            <svg width="150" height="130" viewBox="0 0 150 130" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <path
                  key={i}
                  className="steam-wisp"
                  style={{ animationDelay: `${i * 0.9}s` }}
                  d={`M${45 + i * 30} 126 C ${33 + i * 30} 96, ${57 + i * 30} 78, ${
                    45 + i * 30
                  } 50 C ${36 + i * 30} 26, ${54 + i * 30} 16, ${45 + i * 30} 2`}
                  stroke="#FAF4EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              ))}
            </svg>
          </div>

          <div
            ref={ringRef}
            className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#D49B5B]/60 bg-[#D49B5B]/5 opacity-0 shadow-[0_0_40px_rgba(212,155,91,0.25)]"
          >
            <Bean className="w-8" />
          </div>

          <div
            ref={labelRef}
            className="font-display text-2xl font-light text-[#FAF4EB] opacity-0 sm:text-4xl md:text-5xl"
            style={{ letterSpacing: '0.34em' }}
          >
            {pendingLabel}
          </div>

          <div
            ref={subLabelRef}
            className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#D49B5B] opacity-0 sm:text-xs"
          >
            Brema · Çekirdekten Fincana
          </div>
        </div>
      </div>
    </>
  );
};
