import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://brema-coffee.pages.dev';
const outputDir = path.resolve('dist');

const pages = [
  {
    path: '/kokenler',
    title: 'Kahve Kökenleri | Brezilya, Kolombiya, Etiyopya, Kenya',
    description:
      'Brezilya, Kolombiya, Etiyopya, Kenya ve diğer seçkin kahve kökenlerinin rakım, işleme yöntemi ve lezzet profillerini Brema kahve atlasında keşfedin.',
  },
  {
    path: '/kavurma-sanati',
    title: 'Kavurma Sanatı | Döküm Tamburda Taze Kahve Kavurma',
    description:
      "Brema'nın İstanbul'daki atölyesinde döküm tamburlarla uyguladığı taze kahve kavurma yaklaşımını, ısı aktarımını ve lezzet dengesini inceleyin.",
  },
  {
    path: '/kavurma-lab',
    title: 'Kavurma Rehberi | Açık, Orta ve Koyu Kavrum Farkları',
    description:
      'Açık, orta ve koyu kavrumda kahvenin rengi, asiditesi, gövdesi ve aroması nasıl değişir? İnteraktif kavurma rehberinde karşılaştırın.',
  },
  {
    path: '/urunler',
    title: 'Kahve Çeşitlerimiz | Espresso, Türk Kahvesi ve Filtre Kahve',
    description:
      'Taze kavrulmuş Brema kahvelerini keşfedin: espresso harmanları, Türk kahvesi ve filtre kahve çekirdekleri.',
  },
  {
    path: '/hasattan-fincana',
    title: 'Hasattan Fincana | Kahvenin Yolculuğu',
    description:
      'Kahve meyvesinin hasattan işlemeye, kavurmadan öğütme ve demlemeye uzanan yolculuğunu adım adım keşfedin.',
  },
  {
    path: '/hikayemiz',
    title: "Hikâyemiz | 2012'den Beri İstanbul'da Kahve Tutkusu",
    description:
      "Brema Coffee Roastery'nin 2012'de İstanbul'da başlayan taze kavrum, kaynak seçimi ve kahve ustalığı hikâyesini okuyun.",
  },
  {
    path: '/franchise',
    title: 'Franchise Fırsatları | Brema Coffee Bayilik',
    description:
      'Brema Coffee franchise modeli, kurulum desteği, barista eğitimi, kahve tedariki ve operasyon danışmanlığı hakkında bilgi alın.',
  },
  {
    path: '/iletisim',
    title: 'İletişim | Brema Coffee Roastery Ataşehir İstanbul',
    description:
      "Brema Coffee Roastery ile ürün, HORECA ve franchise talepleriniz için iletişime geçin. İstanbul Ataşehir'deki atölyemize ulaşın.",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

const shell = await readFile(path.join(outputDir, 'index.html'), 'utf8');

for (const page of pages) {
  const canonical = `${siteUrl}${page.path}`;
  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/i,
      `<meta name="description" content="${escapeHtml(page.description)}" />`
    )
    .replace(
      /<link\s+rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:url"[^>]*>/i,
      `<meta property="og:url" content="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:title"[^>]*>/i,
      `<meta property="og:title" content="${escapeHtml(page.title)}" />`
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/i,
      `<meta property="og:description" content="${escapeHtml(page.description)}" />`
    )
    .replace(
      '</head>',
      `  <script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: canonical,
        name: page.title,
        description: page.description,
        inLanguage: 'tr-TR',
        isPartOf: { '@id': `${siteUrl}/#website` },
      })}</script>\n  </head>`
    );

  const routeDir = path.join(outputDir, page.path.slice(1));
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, 'index.html'), html, 'utf8');
}

console.log(`Generated ${pages.length} route-specific SEO pages.`);
