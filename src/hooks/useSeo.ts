import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CONTACT, SITE_NAME, SITE_URL, getRouteMeta } from '../data/seo';

/** Managed head tags carry this attribute so we only ever touch our own. */
const OWNED = 'data-seo-managed';

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(OWNED, 'true');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    el.setAttribute(OWNED, 'true');
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: unknown) {
  let el = document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${id}"]`);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-jsonld', id);
    el.setAttribute(OWNED, 'true');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Keeps the document head in sync with the active route.
 *
 * The site is a client-rendered SPA, so nothing here exists in the HTML that
 * leaves the server — crawlers that execute JS (Google, Bing) read these tags
 * after hydration, and the static `index.html` carries the sensible defaults
 * plus the Organization graph for everyone else.
 */
export function useSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(pathname);
    const { title, description } = meta;
    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
    const image = `${SITE_URL}/images/hero_coffee_beans.jpg`;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: meta.keywords.join(', ') });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    });

    upsertLink('canonical', canonical);

    // Open Graph
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'tr_TR' });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: `${SITE_NAME} — ${meta.crumb}`,
    });

    // Twitter / X
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

    // Per-page graph: WebPage + breadcrumb trail
    const graph: unknown[] = [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: 'tr-TR',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        primaryImageOfPage: image,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement:
          pathname === '/'
            ? [{ '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` }]
            : [
                { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: `${SITE_URL}/` },
                { '@type': 'ListItem', position: 2, name: meta.crumb, item: canonical },
              ],
      },
    ];

    upsertJsonLd('page', { '@context': 'https://schema.org', '@graph': graph });
  }, [pathname]);
}

/**
 * Adds a route-specific JSON-LD node (a product feed, a contact page, an FAQ)
 * on its own script tag.
 *
 * It deliberately does NOT share a tag with `useSeo`: child effects commit
 * before their parent's, so folding page data into the app-level graph meant
 * the parent's write landed last and erased it.
 */
export function usePageJsonLd(id: string, data: unknown) {
  const serialised = JSON.stringify(data);

  useEffect(() => {
    upsertJsonLd(id, { '@context': 'https://schema.org', ...JSON.parse(serialised) });

    return () => {
      document.head.querySelector(`script[data-jsonld="${id}"]`)?.remove();
    };
  }, [id, serialised]);
}

/** Organization + WebSite graph — stable for the whole session. */
export function useSiteJsonLd() {
  useEffect(() => {
    upsertJsonLd('site', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'CafeOrCoffeeShop'],
          '@id': `${SITE_URL}/#organization`,
          name: SITE_NAME,
          alternateName: 'Brema Kahve Kavurma Atölyesi',
          url: SITE_URL,
          logo: `${SITE_URL}/images/hero_coffee_beans.jpg`,
          image: `${SITE_URL}/images/roasting_workshop.jpg`,
          description:
            "2012'den beri İstanbul'da faaliyet gösteren, dünyanın seçkin bölgelerinden tedarik ettiği çekirdekleri döküm tamburlarda kavuran nitelikli kahve atölyesi.",
          foundingDate: '2012',
          slogan: 'Çekirdekten Fincana',
          email: CONTACT.email,
          telephone: CONTACT.phone,
          priceRange: '₺₺',
          address: {
            '@type': 'PostalAddress',
            streetAddress: CONTACT.street,
            addressLocality: CONTACT.district,
            addressRegion: CONTACT.city,
            postalCode: CONTACT.postalCode,
            addressCountry: CONTACT.country,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '18:00',
            },
          ],
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: CONTACT.phone,
              contactType: 'customer service',
              areaServed: 'TR',
              availableLanguage: ['Turkish', 'English'],
            },
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_NAME,
          inLanguage: 'tr-TR',
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
      ],
    });
  }, []);
}
