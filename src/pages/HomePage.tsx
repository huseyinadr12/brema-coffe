import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  Flame,
  Globe2,
  Leaf,
  MousePointer2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { Stage3D } from '../components/canvas/Stage3D';
import { CoffeeBean3D } from '../components/canvas/CoffeeBean3D';
import { useAudio } from '../context/AudioContext';

const qualitySteps = [
  {
    icon: Globe2,
    number: '01',
    title: 'Kökeni seçiyoruz',
    text: 'Yalnızca karakteri belirgin, izlenebilir ve fincanda temiz sonuç veren seçkin çekirdekler.',
    link: '/kokenler',
    linkText: 'Kökenleri tanı',
  },
  {
    icon: Flame,
    number: '02',
    title: 'Profilini kavuruyoruz',
    text: 'Her çekirdeği tek bir koyulukta değil, aromasını en iyi gösterecek profilde kavuruyoruz.',
    link: '/kavurma-sanati',
    linkText: 'Kavurma yaklaşımı',
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: 'Tazeliği koruyoruz',
    text: 'Küçük parti kavrum ve tek yönlü valfli paket, aromayı ilk fincandan son fincana taşır.',
    link: '/hasattan-fincana',
    linkText: 'Yolculuğu gör',
  },
];

const tasteProfiles = [
  {
    eyebrow: 'CANLI & MEYVEMSİ',
    title: 'Yeni tatlar arıyorum',
    text: 'Parlak asidite, çiçeksi kokular ve meyve notaları sevenler için.',
    accent: 'taste-card--bright',
  },
  {
    eyebrow: 'DENGELİ & YUMUŞAK',
    title: 'Her gün keyifle içerim',
    text: 'Karamel, sütlü çikolata ve yuvarlak gövde arayanlar için.',
    accent: 'taste-card--balanced',
  },
  {
    eyebrow: 'YOĞUN & GÜÇLÜ',
    title: 'Kahvem belirgin olsun',
    text: 'Koyu kakao, baharat ve uzun bitiş sevenler için.',
    accent: 'taste-card--bold',
  },
];

export const HomePage: React.FC = () => {
  const { playClick, playDrip } = useAudio();

  return (
    <div className="theme-page home-page relative min-h-screen w-full overflow-hidden px-5 pb-20 pt-24 sm:px-10 lg:px-16">
      <div className="home-ambient home-ambient--one" aria-hidden="true" />
      <div className="home-ambient home-ambient--two" aria-hidden="true" />

      <section className="home-hero relative z-10 mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 py-8 lg:grid-cols-12 lg:gap-14">
        <div className="home-hero__copy relative min-w-0 lg:col-span-6">
          <div className="home-eyebrow mb-6">
            <Sparkles size={14} />
            <span>İSTANBUL'DA TAZE KAVRUM · 2012'DEN BERİ</span>
          </div>

          <h1 className="home-title max-w-3xl">
            Taze kavrulmuş kahve,
            <span>tam sevdiğiniz gibi.</span>
          </h1>

          <p className="home-lead mt-6 max-w-xl">
            Kökeni belli çekirdekleri, lezzetini örten değil ortaya çıkaran profillerle
            kavuruyoruz. Siz yalnızca nasıl bir fincan sevdiğinizi seçin.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/urunler"
              onClick={playDrip}
              className="btn-luxury btn-luxury-primary home-primary-cta"
              data-cursor="KAHVENİ SEÇ"
            >
              <ShoppingBag size={17} />
              <span>KAHVENİ SEÇ</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/kavurma-sanati"
              onClick={playClick}
              className="home-text-link"
              data-cursor="NASIL?"
            >
              Nasıl kavuruyoruz?
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="home-proof mt-10" aria-label="Brema kalite özeti">
            <div><strong>2012</strong><span>İstanbul'dan beri</span></div>
            <div><strong>8</strong><span>Seçkin köken</span></div>
            <div><strong>Taze</strong><span>Küçük parti kavrum</span></div>
          </div>
        </div>

        <div className="relative min-w-0 lg:col-span-6">
          <div className="scene-card home-hero-scene relative overflow-hidden rounded-[2rem]">
            <div className="scene-label">
              <span className="scene-label__pulse" />
              GERÇEK ZAMANLI 3B ÇEKİRDEK
            </div>
            <Stage3D
              eager
              cameraPosition={[0, 0.1, 4.8]}
              shadowY={-1.45}
              shadowScale={5.2}
              shadowOpacity={0.34}
              mood="studio"
              exposure={1.02}
              label="Brema Arabica kahve çekirdeğinin interaktif 3B görünümü"
            >
              <CoffeeBean3D
                scale={1.28}
                position={[0, -0.04, 0]}
                roastColor="#693719"
                roughness={0.78}
                metalness={0}
                oiliness={0.16}
                interactive
                floating
              />
            </Stage3D>
            <div className="scene-instruction">
              <MousePointer2 size={15} />
              <span>Çekirdeği tutup döndürün</span>
            </div>
            <div className="flavour-note flavour-note--one"><small>AROMA</small><b>Kakao</b></div>
            <div className="flavour-note flavour-note--two"><small>DOKU</small><b>Kadifemsi</b></div>
          </div>
        </div>

        <a href="#neden-brema" className="home-scroll-cue" aria-label="Brema farkını keşfet">
          <span>KEŞFET</span>
          <ArrowDown size={15} />
        </a>
      </section>

      <section id="neden-brema" className="marketing-section mx-auto max-w-7xl py-20 sm:py-28">
        <div className="section-heading-grid">
          <div>
            <span className="section-kicker">BREMA FARKI</span>
            <h2>İyi kahve için<br />üç net karar.</h2>
          </div>
          <p>
            Karmaşık terimler yerine fincanda hissedeceğiniz sonucu anlatıyoruz.
            Nereden geldiğini, nasıl kavrulduğunu ve nasıl taze kaldığını bilirsiniz.
          </p>
        </div>

        <div className="quality-grid mt-12">
          {qualitySteps.map(({ icon: Icon, number, title, text, link, linkText }) => (
            <article key={number} className="luxury-glass depth-card">
              <div className="depth-card__top">
                <span>{number}</span>
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link to={link} onClick={playClick}>
                {linkText}<ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="taste-finder mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-5 py-14 sm:px-10 lg:px-14 lg:py-20">
        <div className="taste-finder__intro">
          <span className="section-kicker section-kicker--light">KARAR VERMEYİ KOLAYLAŞTIRDIK</span>
          <h2>Damak zevkiniz<br />hangisine yakın?</h2>
          <p>Teknik isimleri bilmeniz gerekmiyor. Sevdiğiniz hissi seçin, size uygun kahveleri görün.</p>
        </div>

        <div className="taste-grid mt-10">
          {tasteProfiles.map((profile, index) => (
            <Link
              key={profile.eyebrow}
              to="/urunler"
              onClick={playDrip}
              className={`taste-card ${profile.accent}`}
              data-cursor="KEŞFET"
            >
              <span className="taste-card__number">0{index + 1}</span>
              <div>
                <small>{profile.eyebrow}</small>
                <h3>{profile.title}</h3>
                <p>{profile.text}</p>
              </div>
              <span className="taste-card__action">Kahveleri gör <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="freshness-story mx-auto my-20 grid max-w-7xl items-center gap-10 overflow-hidden rounded-[2rem] lg:grid-cols-12 lg:gap-14">
        <div className="scene-card freshness-system relative min-h-[430px] lg:col-span-5 lg:min-h-[560px]">
          <div className="freshness-system__header">
            <span>BREMA COFFEE · ÜRETİM STANDARDI</span>
            <b>STD. 01—03</b>
          </div>

          <div className="freshness-system__stack">
            <div className="freshness-system__step">
              <span>01</span>
              <div><small>KAVRUM</small><b>Küçük partilerde kontrollü profil</b></div>
            </div>
            <div className="freshness-system__step">
              <span>02</span>
              <div><small>KONTROL</small><b>Dinlendirme ve kalite onayı</b></div>
            </div>
            <div className="freshness-system__step">
              <span>03</span>
              <div><small>PAKETLEME</small><b>Tek yönlü valfle koruma</b></div>
            </div>
          </div>

          <div className="freshness-system__footer">
            <small>İSTANBUL · 2012'DEN BERİ</small>
            <strong>Kontrollü süreç. Tutarlı kalite.</strong>
          </div>
        </div>

        <div className="freshness-copy px-1 py-4 lg:col-span-7 lg:px-10">
          <span className="section-kicker">ÜRETİM VE TAZELİK STANDARDI</span>
          <h2>Her partide aynı<br />kalite disiplini.</h2>
          <p>
            Kavrum, dinlendirme, kalite kontrol ve paketleme adımlarını tek bir üretim
            standardı içinde yönetiyor; her partiyi aynı dikkatle hazırlıyoruz.
          </p>
          <ul>
            <li><Check size={16} /> Küçük partiler halinde kontrollü kavrum</li>
            <li><Check size={16} /> Çekirdeğe özel sıcaklık ve zaman profili</li>
            <li><Check size={16} /> Tek yönlü valfle korunan tazelik</li>
          </ul>
          <Link to="/hasattan-fincana" onClick={playClick} className="home-text-link mt-7">
            Sürecin tamamını gör <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="choice-section mx-auto max-w-7xl py-12 sm:py-20">
        <div className="section-heading-grid">
          <div>
            <span className="section-kicker">SİZE UYGUN YOL</span>
            <h2>Bir fincanla başlayın.<br />Bir markaya dönüşün.</h2>
          </div>
          <p>Evde iyi kahve arayanlara da Brema deneyimini büyütmek isteyen girişimcilere de net bir başlangıç sunuyoruz.</p>
        </div>

        <div className="choice-grid mt-10">
          <Link to="/urunler" onClick={playDrip} className="choice-card choice-card--coffee">
            <Leaf size={25} />
            <span>EV & OFİS İÇİN</span>
            <h3>Kendinize uygun kahveyi bulun.</h3>
            <p>Köken, kavrum ve damak profiline göre Brema koleksiyonunu keşfedin.</p>
            <b>Kahveleri incele <ArrowRight size={16} /></b>
          </Link>
          <Link to="/franchise" onClick={playClick} className="choice-card choice-card--business">
            <Building2 size={25} />
            <span>YATIRIM & İŞ ORTAKLIĞI</span>
            <h3>Brema deneyimini şehrinize taşıyın.</h3>
            <p>Marka standardı, ürün tedariği ve operasyon yaklaşımıyla franchise modelini inceleyin.</p>
            <b>Franchise bilgisi <ArrowRight size={16} /></b>
          </Link>
        </div>
      </section>

      <section className="final-conversion mx-auto mt-12 max-w-7xl rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20">
        <span className="section-kicker section-kicker--light">İLK FİNCANINIZI SEÇİN</span>
        <h2>İyi kahve, doğru seçimle başlar.</h2>
        <p>Brema koleksiyonunda damak zevkinize uygun profili birkaç dakika içinde bulun.</p>
        <Link to="/urunler" onClick={playDrip} className="btn-luxury btn-luxury-primary mt-7">
          <ShoppingBag size={17} /> Kahveleri keşfet <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
};
