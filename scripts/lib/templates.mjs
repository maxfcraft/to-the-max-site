/* =========================================================================
   templates.mjs - the visible HTML for generated pages.
   Same design DNA as the hand-authored pages: warm paper, hairlines, mono
   eyebrows, Bodoni headings, zero radius, no em dashes.
   ========================================================================= */

import { site, url } from "../../data/site.mjs";
import { esc } from "./render.mjs";

const SMS = `sms:+12819084874`;
const TEL = `tel:+12819084874`;

export function masthead(up, current) {
  const link = (href, label, extra = "") =>
    `<a class="nav-link${extra}" href="${up}${href}">${label}</a>`;
  return `  <header class="masthead">
    <div class="wrap masthead-inner">
      <a class="wordmark" href="${up || "./"}">To The Max</a>
      <nav aria-label="Main">
        ${link("proof", "Proof")}
        ${link("for/", "Industries")}
        ${link("expect", "Expect", " nav-hide-mobile")}
        <a class="nav-cta" href="${up}#contact">Book a call</a>
      </nav>
    </div>
  </header>`;
}

export function breadcrumbNav(trail, up) {
  const parts = trail.map(([name, path], i) =>
    i === trail.length - 1
      ? `<span aria-current="page">${esc(name)}</span>`
      : `<a href="${up}${path}">${esc(name)}</a>`
  );
  return `      <nav class="crumbs" aria-label="Breadcrumb">${parts.join(
    `<span aria-hidden="true">/</span>`
  )}</nav>`;
}

export function footer(up) {
  return `  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <p class="footer-note">To The Max is a one-operator marketing agency founded by ${site.founder}. Local business marketing, proven on my own local business.</p>
        <div class="footer-links">
          <a href="${up}proof">Proof</a>
          <a href="${up}for/">Industries</a>
          <a href="${up}expect">Expect</a>
          <a href="${up}#contact">Contact</a>
        </div>
        <div class="footer-links">
          <a href="${up}privacy">Privacy</a>
          <a href="${up}terms">Terms</a>
        </div>
      </div>
      <p class="footer-towns">Working with local businesses in ${site.towns.join(
        ", "
      )}, and remotely across the United States.</p>
      <div class="footer-legal">
        <span>&copy; 2026 To The Max &middot; ${site.city}, ${site.region}</span>
        <span>Marketing, with receipts.</span>
      </div>
    </div>
  </footer>`;
}

export function closingCta(up, line) {
  return `    <section class="section on-ink closing" id="contact">
      <div class="wrap">
        <span class="eyebrow fade-item">Contact</span>
        <h2 class="fade-item">${esc(line)}</h2>
        <div class="closing-contact fade-item">
          <a class="btn btn-solid" href="${SMS}">Text ${site.phoneDisplay}</a>
          <a class="btn btn-ghost" href="${TEL}">Call instead</a>
        </div>
        <div class="closing-lines fade-item">
          <span>Email &middot; <a href="mailto:${site.email}">${site.email}</a></span>
          <span>Fifteen minutes, no pitch. If it is not a fit you get told on the call.</span>
        </div>
      </div>
    </section>`;
}

/* ------------------------------------------------------------ niche page */

export function nichePage(n, related, head) {
  const up = "../";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ml:start -->
${head}
  <!-- ml:end -->
</head>
<body>

${masthead(up, n.slug)}

  <main>

    <section class="hero hero-sub wrap">
${breadcrumbNav([["Home", ""], ["Industries", "for/"], [n.nav, "for/" + n.slug]], up)}
      <div class="hero-eyebrow-row">
        <span class="eyebrow">For ${esc(n.trade)}</span>
        <span class="eyebrow">Huntsville, Alabama &middot; working anywhere</span>
      </div>
      <h1>${esc(n.h1)}</h1>
      <p class="hero-sub-solo">${esc(n.lede)}</p>
      <div class="hero-actions">
        <a class="btn btn-solid" href="#contact">Book a 15-minute call</a>
        <a class="btn btn-ghost" href="${up}proof">See the ledger</a>
      </div>
    </section>

    <section class="section wrap">
      <div class="section-head fade-item">
        <span class="num">01 / The problem</span>
        <h2>What goes wrong when ${esc(n.trade)} advertise</h2>
      </div>
      <div class="prose fade-item">
${n.problem.map((p) => `        <p>${esc(p)}</p>`).join("\n")}
      </div>
    </section>

    <section class="section on-ink">
      <div class="wrap">
        <div class="section-head fade-item">
          <span class="num">02 / The build</span>
          <h2>What To The Max builds for ${esc(n.trade)}</h2>
        </div>
        <ol class="steps steps-ink">
${n.system
  .map(
    (s) => `          <li class="step fade-item"><div><p>${esc(s)}</p></div></li>`
  )
  .join("\n")}
        </ol>
      </div>
    </section>

    <section class="section wrap">
      <div class="section-head fade-item">
        <span class="num">03 / The maths</span>
        <h2>${esc(n.math.label)}</h2>
        <p class="section-lede">Every number below is a planning range or a target, not a claimed result. The only claimed results on this website are dated in <a class="inline-link" href="${up}proof">the Ledger</a>.</p>
      </div>
      <dl class="mathrows fade-item">
${n.math.rows
  .map(
    ([k, v]) =>
      `        <div class="mathrow"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`
  )
  .join("\n")}
      </dl>
      <p class="math-note fade-item">${esc(n.math.note)}</p>
    </section>

    <section class="section wrap" id="questions">
      <div class="section-head fade-item">
        <span class="num">04 / Questions</span>
        <h2>Questions ${esc(n.trade)} ask</h2>
      </div>
      <div class="faq">
${n.faqs
  .map(
    (f) => `        <div class="faq-item fade-item">
          <h3 class="faq-q">${esc(f.q)}</h3>
          <p class="faq-a">${esc(f.a)}</p>
        </div>`
  )
  .join("\n")}
      </div>
    </section>

    <section class="section wrap">
      <div class="section-head fade-item">
        <span class="num">05 / Proof</span>
        <h2>The receipts behind this</h2>
      </div>
      <div class="prose fade-item">
        <p>To The Max is a one-operator agency run by ${site.founder} in ${site.city}, ${site.regionName}. The founder owns Supreme Clean, a pressure washing company doing five thousand dollars a month, and every strategy is funded with his own money on that business before it is sold to anyone. Wins and failures are both recorded with dates in <a class="inline-link" href="${up}proof">the Ledger</a>.</p>
        <p>If you want to see what the leads actually look like when they arrive, there is a <a class="inline-link" href="${up}expect">walkthrough of the lead feed</a>. If your trade is not this one, the <a class="inline-link" href="${up}for/">full list of industries</a> has the plan for it.</p>
      </div>
    </section>

    <section class="section wrap">
      <div class="section-head fade-item">
        <span class="num">06 / Nearby trades</span>
        <h2>Other industries with the same problem</h2>
      </div>
      <ul class="niche-grid fade-item">
${related
  .map(
    (r) => `        <li class="niche-card">
          <a href="${up}for/${r.slug}">
            <span class="niche-card-name">${esc(r.nav)}</span>
            <span class="niche-card-desc">${esc(r.title)}</span>
          </a>
        </li>`
  )
  .join("\n")}
      </ul>
    </section>

${closingCta(up, `Put your ${esc(n.nav.toLowerCase())} business in the ledger.`)}

  </main>

${footer(up)}

  <script src="${up}js/site.js?v=DEV"></script>
</body>
</html>
`;
}

/* -------------------------------------------------------------- hub page */

export function hubPage(niches, head) {
  const up = "../";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ml:start -->
${head}
  <!-- ml:end -->
</head>
<body>

${masthead(up, "for")}

  <main>

    <section class="hero hero-sub wrap">
${breadcrumbNav([["Home", ""], ["Industries", "for"]], up)}
      <div class="hero-eyebrow-row">
        <span class="eyebrow">${niches.length} industries</span>
        <span class="eyebrow">Lead maths, not theory</span>
      </div>
      <h1>How marketing actually works in your trade</h1>
      <p class="hero-sub-solo">A roofing lead and a lawn care lead are not the same thing, and an agency that treats them the same is guessing with your money. Every page below has the offer, the campaign structure, and the lead maths for one specific industry, written out before anybody spends a dollar.</p>
      <div class="hero-actions">
        <a class="btn btn-solid" href="#list">See the industries</a>
        <a class="btn btn-ghost" href="${up}proof">See the ledger</a>
      </div>
    </section>

    <section class="section wrap" id="list">
      <div class="section-head fade-item">
        <span class="num">01 / Industries</span>
        <h2>Pick your trade</h2>
        <p class="section-lede">If yours is not here, it does not mean the answer is no. It means nobody has written the page yet. Text ${site.phoneDisplay} and ask.</p>
      </div>
      <ul class="niche-grid niche-grid-wide fade-item">
${niches
  .map(
    (n) => `        <li class="niche-card">
          <a href="${up}for/${n.slug}">
            <span class="niche-card-name">${esc(n.nav)}</span>
            <span class="niche-card-desc">${esc(n.lede.split(". ")[0])}.</span>
          </a>
        </li>`
  )
  .join("\n")}
      </ul>
    </section>

    <section class="section on-ink">
      <div class="wrap">
        <div class="section-head fade-item">
          <span class="num">02 / The common thread</span>
          <h2>What is the same in every trade</h2>
        </div>
        <div class="prose prose-ink fade-item">
          <p>The offer changes, the season changes, and the number a lead can cost changes enormously between a lawn care plan and a full arch dental case. Four things never change.</p>
          <p><strong>Speed beats quality of ad.</strong> Across every industry on this site, the business that contacts the lead first wins a disproportionate share of the work, and it is not close.</p>
          <p><strong>Cost per lead is the wrong number.</strong> The right one is cost per booked job, or cost per retained customer. A cheap lead that never converts is the most expensive thing in the account.</p>
          <p><strong>Recurring beats one-off.</strong> Every trade here has a version of the offer that repeats, and it is almost always the one that makes the advertising affordable.</p>
          <p><strong>The list you already have is free money.</strong> Past customers, dormant patients, old quotes. In most businesses, reactivating them books work before a single new ad has run.</p>
        </div>
      </div>
    </section>

${closingCta(up, "Fifteen minutes, and you will know your numbers.")}

  </main>

${footer(up)}

  <script src="${up}js/site.js?v=DEV"></script>
</body>
</html>
`;
}
