import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Preloader } from './components/common/Preloader';
import { CustomCursor } from './components/common/CustomCursor';
import { Navigation } from './components/common/Navigation';
import { FullscreenMenu } from './components/common/FullscreenMenu';
import { CartDrawer } from './components/common/CartDrawer';
import { SampleModal } from './components/common/SampleModal';
import { Footer } from './components/common/Footer';

import { HomePage } from './pages/HomePage';
import { OriginsPage } from './pages/OriginsPage';
import { RoasteryPage } from './pages/RoasteryPage';
import { RoastingLabPage } from './pages/RoastingLabPage';
import { ProductsPage } from './pages/ProductsPage';
import { HarvestToCupPage } from './pages/HarvestToCupPage';
import { AboutPage } from './pages/AboutPage';
import { FranchisePage } from './pages/FranchisePage';
import { ContactPage } from './pages/ContactPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#1A120E] text-[#FAF4EB] flex flex-col justify-between selection:bg-[#D49B5B]/30 selection:text-[#FAF4EB]">
      {/* 1. Preloader */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* 2. Film Grain Overlay */}
      <div className="grain-overlay" />

      {/* 3. Fluid Trailing Custom Cursor */}
      <CustomCursor />

      {/* 4. Scroll To Top on Route Change */}
      <ScrollToTop />

      {/* 5. Minimal Editorial Navigation */}
      <Navigation
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
      />

      {/* 6. Fullscreen Menu Directory */}
      <FullscreenMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* 7. Global Cart & Wholesale Modals */}
      <CartDrawer />
      <SampleModal />

      {/* 8. Dedicated Page Routes */}
      <main className="flex-1 w-full">
        <Routes>
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
      </main>

      {/* 9. Shared Footer */}
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
