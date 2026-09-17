/* =========================================================================
   render.mjs - every machine-readable thing this site emits.
   Titles, descriptions, canonicals, OpenGraph, JSON-LD, breadcrumbs.
   Nothing here touches visible copy.
   ========================================================================= */

import { site, url } from "../../data/site.mjs";

export const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** How many ../ a page at this path needs to reach the site root. */
export const upTo = (path) => (path.includes("/") || path === "for" ? "../" : "");

/* ---------------------------------------------------------------- schema */

/** The business block. Goes on EVERY page, identical, so nothing can drift. */
export function businessSchema() {
  const b = {
    "@type": ["ProfessionalService", "Organization"],
    "@id": url() + "#organization",
    name: site.name,
    description: site.entity,
    url: url(),
    telephone: site.phone,
    email: site.email,
    foundingDate: site.founded,
    founder: { "@type": "Person", name: site.founder, jobTitle: "Founder" },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: [
      ...site.towns.map((name) => ({ "@type": "City", name })),
      { "@type": "Country", name: "United States" },
    ],
    knowsAbout: [
      "Meta advertising",
      "Facebook advertising",
      "Instagram advertising",
      "Local lead generation",
      "Landing page design",
      "Marketing automation and lead follow-up",
      "Conversion tracking",
    ],
  };
  /* sameAs only when profiles actually exist. An empty array is a wasted line. */
  if (site.sameAs.length) b.sameAs = site.sameAs;
  return b;
}

export function webPageSchema(page, canonical) {
  return {
    "@type": "WebPage",
    "@id": canonical + "#webpage",
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: "en-US",
    datePublished: page.published || "2026-08-07",
    dateModified: page.modified,
    isPartOf: { "@id": url() + "#website" },
    about: { "@id": url() + "#organization" },
    author: { "@id": url() + "#organization" },
    publisher: { "@id": url() + "#organization" },
  };
}

export function breadcrumbSchema(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: url(path),
    })),
  };
}

export function faqSchema(faqs) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(niche, canonical) {
  return {
    "@type": "Service",
    "@id": canonical + "#service",
    name: `Marketing for ${niche.trade}`,
    serviceType: "Local business marketing and paid advertising management",
    description: niche.description,
    provider: { "@id": url() + "#organization" },
    areaServed: { "@type": "Country", name: "United States" },
    audience: { "@type": "BusinessAudience", name: niche.trade },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": url() + "#website",
    url: url(),
    name: site.name,
    description: site.entity,
    inLanguage: "en-US",
    publisher: { "@id": url() + "#organization" },
  };
}

/* ------------------------------------------------------------ head block */

/**
 * Everything a machine reads, as one block. Injected between
 * <!-- ml:start --> and <!-- ml:end --> in every page.
 */
export function headBlock(page, graph) {
  const canonical = url(page.path);
  const up = upTo(page.path);
  const robots = page.index
    ? "index, follow, max-image-preview:large, max-snippet:-1"
    : "noindex, follow";

  const lines = [
    `<meta charset="UTF-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    ``,
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<meta name="robots" content="${robots}">`,
    `<meta name="theme-color" content="${site.themeColor}">`,
    `<meta name="author" content="${esc(site.founder)}">`,
    ``,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(site.name)}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${url("img/og-to-the-max.png")}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(page.ogAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(page.title)}">`,
    `<meta name="twitter:description" content="${esc(page.description)}">`,
    `<meta name="twitter:image" content="${url("img/og-to-the-max.png")}">`,
    `<meta name="twitter:image:alt" content="${esc(page.ogAlt)}">`,
    ``,
    `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 fill=%27%23141412%27/%3E%3Ctext x=%2732%27 y=%2745%27 font-family=%27Georgia,serif%27 font-size=%2740%27 fill=%27%23faf9f6%27 text-anchor=%27middle%27%3EM%3C/text%3E%3C/svg%3E">`,
    `<script>document.documentElement.classList.add("js");</script>`,
    ``,
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;0,600;1,400&family=Hanken+Grotesk:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">`,
    `<link rel="stylesheet" href="${up}styles/site.css?v=DEV">`,
    ``,
    `<script type="application/ld+json">`,
    JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2),
    `</script>`,
  ];

  return lines.map((l) => (l ? "  " + l : "")).join("\n");
}
