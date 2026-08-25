export const SITE_URL = 'https://brema-coffee.pages.dev';
export const SITE_NAME = 'Brema Coffee Roastery';
export const BRAND_TAGLINE = 'Çekirdekten Fincana';
export const FOUNDED_YEAR = '2012';

export const CONTACT = {
  street: 'Ferhatpaşa Mah. Anadolu Cad. No:22',
  district: 'Ataşehir',
  city: 'İstanbul',
  postalCode: '34762',
  country: 'TR',
  phone: '+908503032342',
  phoneDisplay: '+90 850 303 23 42',
  email: 'iletisim@brema.com.tr',
  hours: 'Pazartesi – Cuma 09:00 – 18:00',
};

export interface RouteMeta {
  path: string;
  /** Short label used by the page-transition curtain */
  label: string;
  /** <title> without the brand suffix */
  title: string;
  description: string;
  keywords: string[];
  /** Breadcrumb name */
  crumb: string;
  /** Include in sitemap.xml */
  priority: number;
}

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    label: 'ÇEKİRDEKTEN FİNCANA',
    title: 'Brema Coffee Roastery | Çekirdekten Fincana Nitelikli Kahve',
    description:
      "2012'den beri İstanbul Ataşehir'deki atölyemizde döküm tamburlarda kavurduğumuz nitelikli espresso, Türk kahvesi ve filtre kahve çekirdekleri. Taze kavrum, nitrojen mühürlü paketleme.",
    keywords: [
      'brema coffee',
      'kahve kavurma atölyesi',
      'nitelikli kahve',
      'espresso çekirdeği',
      'türk kahvesi',
      'filtre kahve',
      'istanbul kahve roastery',
    ],
    crumb: 'Ana Sayfa',
    priority: 1.0,
  },
  {
    path: '/kokenler',
    label: 'KÖKENLER',
    title: 'Kahve Kökenleri | Brezilya, Kolombiya, Etiyopya, Kenya',
    description:
      'Brezilya, Kolombiya, Etiyopya, Kenya, Guatemala ve Kosta Rika kahvelerinin rakım, işleme yöntemi ve lezzet profillerini interaktif 3B dünya küresi üzerinde keşfedin.',
    keywords: [
      'kahve kökenleri',
      'single origin kahve',
      'brezilya kahvesi',
      'etiyopya kahvesi',
      'kolombiya kahvesi',
      'kenya kahvesi',
      'kahve kuşağı',
    ],
    crumb: 'Kökenler',
    priority: 0.8,
  },
  {
    path: '/kavurma-sanati',
    label: 'KAVURMA SANATI',
    title: 'Kavurma Sanatı | Döküm Tamburda Taze Kahve Kavurma',
    description:
      "İstanbul'daki Brema atölyesinde döküm tamburlarda ağır ateşte uygulanan kavurma yöntemimiz: ısı aktarımı, gelişim süresi ve lezzet dengesi.",
    keywords: [
      'kahve kavurma',
      'döküm tambur kavurma',
      'kavurma atölyesi istanbul',
      'taze kavrulmuş kahve',
    ],
    crumb: 'Kavurma Sanatı',
    priority: 0.8,
  },
  {
    path: '/kavurma-lab',
    label: 'KAVURMA LABORATUVARI',
    title: 'Kavurma Rehberi | Açık, Orta ve Koyu Kavrum Farkları',
    description:
      'Açık, orta ve koyu kavrumda kahvenin rengi, asiditesi, gövdesi ve aroması nasıl değişir? İnteraktif 3B çekirdek üzerinde kavurma aşamalarını karşılaştırın.',
    keywords: [
      'kavurma seviyeleri',
      'açık kavrum',
      'orta kavrum',
      'koyu kavrum',
      'kahve asiditesi',
      'kahve gövdesi',
    ],
    crumb: 'Kavurma Laboratuvarı',
    priority: 0.7,
  },
  {
    path: '/urunler',
    label: 'ÜRÜNLERİMİZ',
    title: 'Kahve Çeşitlerimiz | Espresso, Türk Kahvesi ve Filtre Kahve',
    description:
      'Taze kavrulmuş Brema kahve çeşitleri: espresso harmanları, geleneksel Türk kahvesi ve filtre kahve çekirdekleri. 250 g, 500 g ve 1 kg nitrojen mühürlü paketlerde.',
    keywords: [
      'kahve satın al',
      'espresso harmanı',
      'türk kahvesi',
      'filtre kahve',
      'çekirdek kahve',
      'öğütülmüş kahve',
    ],
    crumb: 'Ürünler',
    priority: 0.9,
  },
  {
    path: '/hasattan-fincana',
    label: 'HASATTAN FİNCANA',
    title: 'Hasattan Fincana | Kahvenin Yolculuğu',
    description:
      'Kahve meyvesinin dalından toplanışından öğütme ve demlemeye kadar uzanan yolculuğun her aşaması: hasat, işleme, kavurma, öğütme ve ekstraksiyon.',
    keywords: [
      'kahve yolculuğu',
      'kahve hasadı',
      'kahve işleme yöntemleri',
      'ekstraksiyon',
      'kahve öğütme',
    ],
    crumb: 'Hasattan Fincana',
    priority: 0.7,
  },
  {
    path: '/hikayemiz',
    label: 'HİKÂYEMİZ',
    title: "Hikâyemiz | 2012'den Beri İstanbul'da Kahve Tutkusu",
    description:
      "Brema Coffee Roastery'nin 2012'de İstanbul'da başlayan hikâyesi: kaynaktan tedarik, kendi kavurma tekniklerimiz ve kahveye dair anlayışımız.",
    keywords: ['brema hakkında', 'kahve markası hikayesi', 'istanbul kahve roastery'],
    crumb: 'Hikâyemiz',
    priority: 0.6,
  },
  {
    path: '/franchise',
    label: 'FRANCHISE',
    title: 'Franchise Fırsatları | Brema Coffee Bayilik',
    description:
      'Brema Coffee franchise modeli: kurulum desteği, barista eğitimi, sürekli kahve tedariki ve operasyon danışmanlığı. Bayilik başvuru koşulları.',
    keywords: ['kahve franchise', 'kahve bayilik', 'brema franchise', 'kafe açmak'],
    crumb: 'Franchise',
    priority: 0.7,
  },
  {
    path: '/iletisim',
    label: 'İLETİŞİM',
    title: 'İletişim | Brema Coffee Roastery Ataşehir İstanbul',
    description: `Brema Coffee Roastery — ${CONTACT.street}, ${CONTACT.district} / ${CONTACT.city}. Telefon ${CONTACT.phoneDisplay}, e-posta ${CONTACT.email}. ${CONTACT.hours}.`,
    keywords: ['brema iletişim', 'kahve toptan satış', 'ataşehir kahve', 'horeca kahve tedarik'],
    crumb: 'İletişim',
    priority: 0.6,
  },
];

export const DEFAULT_META = ROUTES[0];

export function getRouteMeta(pathname: string): RouteMeta {
  return ROUTES.find((r) => r.path === pathname) ?? DEFAULT_META;
}
