import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Preloader } from './components/common/Preloader';
import { CustomCursor } from './components/common/CustomCursor';
import { Navigation } from './components/common/Navigation';
import { FullscreenMenu } from './components/common/FullscreenMenu';
import { CartDrawer } from './components/common/CartDrawer';
import { SampleModal } from './components/common/SampleModal';
import { Footer } from './components/common/Footer';
import { SmoothRouteTransition } from './components/common/SmoothRouteTransition';
import { useSeo, useSiteJsonLd } from './hooks/useSeo';

import { HomePage } from './pages/HomePage';

// Everything past the landing page is split out: the three.js scenes are the
// heaviest thing on the site, and no first-paint needs them.
const OriginsPage = lazy(() => import('./pages/OriginsPage').then((m) => ({ default: m.OriginsPage })));
const RoasteryPage = lazy(() => import('./pages/RoasteryPage').then((m) => ({ default: m.RoasteryPage })));
const RoastingLabPage = lazy(() => import('./pages/RoastingLabPage').then((m) => ({ default: m.RoastingLabPage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage })));
const HarvestToCupPage = lazy(() => import('./pages/HarvestToCupPage').then((m) => ({ default: m.HarvestToCupPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const FranchisePage = lazy(() => import('./pages/FranchisePage').then((m) => ({ default: m.FranchisePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));

const RouteFallback: React.FC = () => (
  <div className="flex min-h-[60vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D49B5B]/25 border-t-[#D49B5B]" />
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-[#D49B5B]">
        Demleniyor
      </span>
    </div>
  </div>
);

export const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useSiteJsonLd();
  useSeo();

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-[#F4EFE6] text-[#2B1A12] selection:bg-[#D68B5C]/30 selection:text-[#2B1A12]">
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      <div className="grain-overlay" />

      <CustomCursor />

      <Navigation menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} />

      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <CartDrawer />
      <SampleModal />

      <main className="w-full flex-1">
        <SmoothRouteTransition>
          {(displayLocation) => (
            <Suspense fallback={<RouteFallback />}>
              <Routes location={displayLocation}>
                <Route path="/" element={<HomePage />} />
                <Route path="/kokenler" element={<OriginsPage />} />
                <Route path="/kavurma-sanati" element={<RoasteryPage />} />
                <Route path="/kavurmahane" element={<Navigate to="/kavurma-sanati" replace />} />
                <Route path="/kavurma-lab" element={<RoastingLabPage />} />
                <Route path="/urunler" element={<ProductsPage />} />
                <Route path="/hasattan-fincana" element={<HarvestToCupPage />} />
                <Route path="/hikayemiz" element={<AboutPage />} />
                <Route path="/franchise" element={<FranchisePage />} />
                <Route path="/iletisim" element={<ContactPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          )}
        </SmoothRouteTransition>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};
