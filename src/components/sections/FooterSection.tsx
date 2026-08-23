import React, { useState } from 'react';
import { Mail, MapPin, Phone, Instagram, Linkedin, ArrowUp, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';

interface FooterSectionProps {
  onScrollToTop: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onScrollToTop }) => {
  const { openSampleModal } = useCart();
  const { playClick, playDrip } = useAudio();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playDrip();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      {/* Top Final Emotional Scene Statement */}
      <div className="max-w-4xl mx-auto w-full text-center my-auto pointer-events-auto py-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16100C]/80 border border-[#C6955B]/30 text-[10px] font-mono uppercase tracking-widest text-[#E8D8C0] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6955B]" />
          EPILOGUE
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.18em] text-[#F4EFE8] font-display uppercase leading-tight mb-4">
          EVERY CUP <br />
          <span className="italic font-editorial text-[#C6955B]">HAS AN ORIGIN.</span>
        </h2>

        <p className="text-sm sm:text-base uppercase tracking-[0.35em] text-[#E8D8C0]/70 font-mono mb-8">
          BREMA COFFEE ROASTERY · ISTANBUL
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              playClick();
              onScrollToTop();
            }}
            className="btn-luxury btn-luxury-primary"
            data-cursor="DISCOVER"
          >
            EXPERIENCE THE JOURNEY AGAIN
          </button>

          <button
            onClick={() => {
              playClick();
              openSampleModal();
            }}
            className="btn-luxury"
            data-cursor="SAMPLE"
          >
            CONTACT BREMA ROASTERY
          </button>
        </div>
      </div>

      {/* Bottom Editorial Footer Directory */}
      <div className="max-w-6xl mx-auto w-full pointer-events-auto border-t border-white/10 pt-12 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-3">
            <h3 className="text-2xl font-light tracking-[0.3em] font-display text-[#F4EFE8]">
              BREMA
            </h3>
            <p className="text-xs text-[#E8D8C0]/60 font-sans leading-relaxed">
              Specialty Coffee Roastery established in Istanbul in 2012. Continuous pursuit of origin terroir and cast-iron roasting perfection.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#16100C] border border-white/10 flex items-center justify-center text-[#E8D8C0]/70 hover:text-white hover:border-[#C6955B] transition-colors"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#16100C] border border-white/10 flex items-center justify-center text-[#E8D8C0]/70 hover:text-white hover:border-[#C6955B] transition-colors"
              >
                <Linkedin size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs font-sans text-[#E8D8C0]/70">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#C6955B] font-bold mb-3">
              EXPLORE
            </h4>
            <div>
              <a href="#origins" className="hover:text-white transition-colors">
                Global Terroir & Origins
              </a>
            </div>
            <div>
              <a href="#roastery" className="hover:text-white transition-colors">
                Istanbul Roastery Engine
              </a>
            </div>
            <div>
              <a href="#lab" className="hover:text-white transition-colors">
                Digital Roasting Laboratory
              </a>
            </div>
            <div>
              <a href="#collection" className="hover:text-white transition-colors">
                The Brema Collection
              </a>
            </div>
          </div>

          {/* Roastery Headquarters */}
          <div className="space-y-2 text-xs font-sans text-[#E8D8C0]/70">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#C6955B] font-bold mb-3">
              HEADQUARTERS
            </h4>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-[#C6955B] shrink-0 mt-0.5" />
              <span>Istanbul, Türkiye (41.0082° N, 28.9784° E)</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#C6955B] shrink-0" />
              <span>+90 (212) BREMA-CO</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-[#C6955B] shrink-0" />
              <span>info@brema.com.tr</span>
            </div>
          </div>

          {/* Newsletter / Micro-lot Club */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#C6955B] font-bold mb-2">
              MICRO-LOT DISPATCHES
            </h4>
            <p className="text-xs text-[#E8D8C0]/60 font-sans">
              Subscribe for private invitations to limited seasonal harvest drops.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#1A130F] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F4EFE8] font-mono focus:border-[#C6955B] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#C6955B] text-[#080706] text-xs font-bold rounded-lg font-mono hover:bg-[#E8D8C0] transition-colors"
              >
                {subscribed ? <Check size={14} /> : 'JOIN'}
              </button>
            </form>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6 text-[10px] text-[#E8D8C0]/40 font-mono">
          <div>© 2012 - 2026 BREMA COFFEE ROASTERY. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span>SCA SPECIALTY STANDARD</span>
            <span>NITROGEN SEALED</span>
            <button
              onClick={() => {
                playClick();
                onScrollToTop();
              }}
              className="flex items-center gap-1.5 text-[#C6955B] hover:text-white transition-colors"
            >
              <span>TOP</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
