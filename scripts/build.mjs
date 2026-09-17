#!/usr/bin/env node
/**
 * build.mjs - the machine layer pass, as a script instead of a memory.
 *
 * WHAT IT DOES
 *   1. Validates every niche entry (unique slugs, resolvable related links,
 *      title and description lengths, FAQ shape). Fails loudly.
 *   2. Renders for/<slug> for every niche and for/index.html.
 *   3. Regenerates the <head> of every hand-authored page between the
 *      <!-- ml:start --> and <!-- ml:end --> markers, so titles, canonicals,
 *      OpenGraph and JSON-LD can never drift from data/.
 *   4. Rewrites internal .html links to extensionless.
 *   5. Content-hashes styles/site.css and js/site.js and stamps ?v= on every
 *      reference, which is the cache-bust rule doing itself.
 *   6. Writes sitemap.xml, robots.txt, llms.txt and llms-full.txt.
 *
 * RUN   node scripts/build.mjs
 *       node scripts/build.mjs --check    (fail if anything would change)
 *
 * THE DOMAIN SWAP  Edit origin and base in data/site.mjs, run this, push.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { site, url } from "../data/site.mjs";
import { niches, bySlug } from "../data/niches.mjs";
import { pages, homeFaqs } from "../data/pages.mjs";
import {
  headBlock, businessSchema, webPageSchema, breadcrumbSchema,
  faqSchema, serviceSchema, websiteSchema, esc,
} from "./lib/render.mjs";
import { nichePage, hubPage } from "./lib/templates.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const TODAY = new Date().toISOString().slice(0, 10);

const problems = [];
const written = [];
const fail = (m) => problems.push(m);

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
function write(rel, content) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const before = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
  if (before === content) return false;
  if (CHECK) { fail(`would change: ${rel}`); return true; }
  fs.writeFileSync(abs, content, "utf8");
  written.push(rel);
  return true;
}

/** Last commit date for a file, else today. Never invented, never backdated. */
function lastmod(rel) {
  try {
    const d = execSync(`git log -1 --format=%cs -- "${rel}"`, {
      cwd: ROOT, stdio: ["ignore", "pipe", "ignore"],
    }).toString().trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : TODAY;
  } catch { return TODAY; }
}

/* ------------------------------------------------------------- 1. validate */

const seen = new Set();
for (const n of niches) {
  if (seen.has(n.slug)) fail(`duplicate slug: ${n.slug}`);
  seen.add(n.slug);
  if (n.title.length > 60) fail(`${n.slug}: title ${n.title.length} chars (max 60)`);
  if (n.description.length > 155) fail(`${n.slug}: description ${n.description.length} chars (max 155)`);
  if (!n.h1 || !n.lede) fail(`${n.slug}: missing h1 or lede`);
  if (n.faqs.length < 4) fail(`${n.slug}: only ${n.faqs.length} FAQs (min 4)`);
  if (n.math.rows.length < 4) fail(`${n.slug}: only ${n.math.rows.length} math rows`);
  for (const r of n.related) if (!bySlug.has(r)) fail(`${n.slug}: related "${r}" does not exist`);
  if (/[—–]/.test(JSON.stringify(n))) fail(`${n.slug}: contains an em or en dash`);
}
for (const p of pages) {
  if (p.title.length > 62) fail(`${p.file}: title ${p.title.length} chars`);
  if (p.description && p.description.length > 155) fail(`${p.file}: description ${p.description.length} chars`);
}
if (site.entity.length > 155) fail(`entity sentence is ${site.entity.length} chars, will not fit a meta description`);

if (problems.length) {
  console.error("\nBUILD FAILED\n" + problems.map((p) => "  " + p).join("\n") + "\n");
  process.exit(1);
}

/* --------------------------------------------------- 2. render niche pages */

const nicheMeta = new Map();

for (const n of niches) {
  const rel = `for/${n.slug}.html`;
  const page = {
    file: rel,
    path: `for/${n.slug}`,
    title: n.title,
    description: n.description,
    ogAlt: n.ogAlt,
    index: true,
    modified: lastmod(`data/niches-*.mjs`) || TODAY,
  };
  const canonical = url(page.path);
  page.modified = TODAY;

  const related = n.related.map((s) => bySlug.get(s));
  const graph = [
    businessSchema(),
    websiteSchema(),
    webPageSchema(page, canonical),
    breadcrumbSchema([["Home", ""], ["Industries", "for/"], [n.nav, page.path]]),
    serviceSchema(n, canonical),
    faqSchema(n.faqs),
  ];
  write(rel, nichePage(n, related, headBlock(page, graph)));
  nicheMeta.set(page.path, page);
}

/* ------------------------------------------------------------ 3. hub page */

{
  const p = pages.find((x) => x.file === "for/index.html");
  const page = { ...p, description: p.description, modified: TODAY };
  const canonical = url(p.path);
  const graph = [
    businessSchema(),
    websiteSchema(),
    webPageSchema(page, canonical),
    breadcrumbSchema(p.breadcrumb),
    {
      "@type": "ItemList",
      name: "Industries To The Max builds marketing for",
      numberOfItems: niches.length,
      itemListElement: niches.map((n, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Marketing for ${n.trade}`,
        url: url(`for/${n.slug}`),
      })),
    },
  ];
  write("for/index.html", hubPage(niches, headBlock(page, graph)));
}

/* ------------------------------ 4. re-head the hand-authored pages in place */

for (const p of pages) {
  if (p.type === "hub") continue;
  const rel = p.file;
  let html = read(rel);
  const page = {
    ...p,
    description: p.description ?? site.entity,
    modified: lastmod(rel),
  };
  const canonical = url(p.path);

  const graph = [businessSchema(), websiteSchema(), webPageSchema(page, canonical), breadcrumbSchema(p.breadcrumb)];
  if (p.type === "home") graph.push(faqSchema(homeFaqs));

  const block = `  <!-- ml:start -->\n${headBlock(page, graph)}\n  <!-- ml:end -->`;
  const hasMarkers = html.includes("<!-- ml:start -->");
  html = hasMarkers
    ? html.replace(/  <!-- ml:start -->[\s\S]*?<!-- ml:end -->/, block)
    : html.replace(/<head>[\s\S]*?<\/head>/, `<head>\n${block}\n</head>`);

  /* The visible questions section on the home page is rendered from the same
     array the FAQPage schema is built from, so the two cannot drift apart. */
  if (p.type === "home" && html.includes("<!-- faq:start -->")) {
    const section = `    <!-- faq:start -->
    <section class="section wrap" id="questions">
      <div class="section-head fade-item">
        <span class="num">06 / Questions</span>
        <h2>Questions people ask before they call</h2>
        <p class="section-lede">Straight answers, on the page, where a person and a search engine can both read them. Nothing here is hidden behind a click.</p>
      </div>
      <div class="faq">
${homeFaqs
  .map(
    (f) => `        <div class="faq-item fade-item">
          <h3 class="faq-q">${esc(f.q)}</h3>
          <p class="faq-a">${esc(f.a)}</p>
        </div>`
  )
  .join("\n")}
      </div>
      <p class="math-note fade-item">Working in a specific trade? The <a class="inline-link" href="for/">industry pages</a> have the offer, the campaign structure, and the lead maths for ${niches.length} of them.</p>
    </section>
    <!-- faq:end -->`;
    html = html.replace(/    <!-- faq:start -->[\s\S]*?<!-- faq:end -->/, section);
  }

  write(rel, html);
}

/* ------------------- 5. extensionless internal links + cache stamp, sitewide */

const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith(".html")) htmlFiles.push(path.relative(ROOT, full).split(path.sep).join("/"));
  }
})(ROOT);

const hash = (rel) =>
  crypto.createHash("sha1").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex").slice(0, 8);
const CSS = hash("styles/site.css");
const JS = hash("js/site.js");

for (const rel of htmlFiles) {
  let html = read(rel);
  /* index.html links become the directory itself; other pages lose .html */
  html = html.replace(/(href=")([^"#?]*?)index\.html(["#])/g, (_, a, dir, z) => `${a}${dir || "./"}${z}`);
  html = html.replace(/(href="(?!https?:|\/\/|mailto:|tel:|sms:)[^"]*?)\.html(["#])/g, "$1$2");
  html = html.replace(/(styles\/site\.css\?v=)[^"']*/g, `$1${CSS}`);
  html = html.replace(/(js\/site\.js\?v=)[^"']*/g, `$1${JS}`);
  write(rel, html);
}

/* --------------------------------------------------------- 6. root files */

/* robots.txt. Nothing blocked, one Sitemap line, well under 2KB. The explicit
   AI agent stanzas are permission stated out loud: this is the one file every
   AI crawler documents reading. */
const robots = `# To The Max. Everything is open, to every crawler, on purpose.
User-agent: *
Allow: /

# Answer engines and AI crawlers. Explicitly welcome.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: cohere-ai
Allow: /

Sitemap: ${url("sitemap.xml")}
`;
write("robots.txt", robots);

/* sitemap.xml. Every indexable page, lastmod read from git, trailing-slash
   shape identical to the canonical and to every internal link. */
const entries = [
  ...pages.filter((p) => p.index).map((p) => ({
    loc: url(p.path),
    lastmod: p.type === "hub" ? TODAY : lastmod(p.file),
    priority: p.path === "" ? "1.0" : p.path === "for/" ? "0.9" : "0.8",
  })),
  ...niches.map((n) => ({ loc: url(`for/${n.slug}`), lastmod: TODAY, priority: "0.7" })),
];
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <priority>${e.priority}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`
);

/* llms.txt. The short answer, for an engine deciding what this business is. */
const llms = `# To The Max

> ${site.entity}

Last updated: ${TODAY}

## What the agency does

To The Max acts as a full marketing department for a local business, not a vendor for one channel. The work is Meta advertising (Facebook and Instagram), the landing page the ads point at, the lead capture form, and the follow-up that reaches the lead before it goes cold. It ships as one connected system, because an ad without a converting page and fast follow-up behind it wastes budget.

The defining practice: the founder, ${site.founder}, owns Supreme Clean, a pressure washing company in ${site.city}, ${site.regionName} doing five thousand dollars a month. Strategies are funded with his own money on that business before they are sold. Results, wins and failures alike, are recorded with dates in a public record called the Ledger at ${url("proof")}.

## Packaging and pricing

- Package one: Meta ads plus CRM and lead follow-up.
- Package two: Meta ads plus CRM plus Google.
- A website is included in both packages and is never an itemised line.
- An AI receptionist is sold separately and is never bundled.
- Engagements run month to month. The client owns every ad account, page, asset and lead from day one.

## Who it works with

Local and owner-operated service businesses across ${niches.length} documented industries, including ${niches.slice(0, 8).map((n) => n.nav.toLowerCase()).join(", ")} and others. Full list with the lead economics for each: ${url("for")}

## Industry pages

${niches.map((n) => `- [${n.title}](${url(`for/${n.slug}`)}): ${n.description}`).join("\n")}

## Core pages

- [Home](${url()}): what the agency does, how it works, and the questions people ask.
- [The Ledger](${url("proof")}): dated case studies. The only claimed results anywhere on the site.
- [Industries](${url("for")}): the plan and the lead maths for ${niches.length} trades.
- [What to expect](${url("expect")}): a simulated walkthrough of leads arriving, clearly labelled as simulated.

## Facts

- Founder and sole operator: ${site.founder}
- Location: ${site.city}, ${site.regionName}, United States
- Phone and text: ${site.phone}
- Email: ${site.email}
- Founded: ${site.founded}
- Platforms: Meta (Facebook and Instagram) advertising, Google advertising in package two
- Documented clients to date: Supreme Clean (the founder's own pressure washing company) and Sophi Paints (a commissioned art studio in ${site.city}, full funnel and first Meta lead campaign live 2026-07-16)

## Honesty policy

Every number on this website is either a dated real result in the Ledger, a clearly labelled planning range, or a clearly labelled simulation. There are no invented testimonials, borrowed client logos, star ratings, or aggregate review scores anywhere on the site, and there is no aggregateRating in the structured data, because there is no public review source to point at yet.
`;
write("llms.txt", llms);

/* llms-full.txt. Every question this site answers, with the answer, in one
   plain-text file an engine can ingest without running JavaScript. */
const full = `# To The Max, full reference

> ${site.entity}

Last updated: ${TODAY}
Source: ${url()}

===============================================================================
ABOUT
===============================================================================

${homeFaqs.map((f) => `Q: ${f.q}\nA: ${f.a}\n`).join("\n")}

===============================================================================
INDUSTRIES (${niches.length})
===============================================================================

${niches
  .map(
    (n) => `-------------------------------------------------------------------------------
${n.trade.toUpperCase()}
URL: ${url(`for/${n.slug}`)}

${n.lede}

WHAT GOES WRONG
${n.problem.map((p) => `- ${p}`).join("\n")}

WHAT TO THE MAX BUILDS
${n.system.map((s) => `- ${s}`).join("\n")}

${n.math.label.toUpperCase()} (planning ranges and targets, not claimed results)
${n.math.rows.map(([k, v]) => `- ${k}: ${v}`).join("\n")}
Note: ${n.math.note}

QUESTIONS
${n.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}
`
  )
  .join("\n")}
===============================================================================
CONTACT
===============================================================================

${site.founder}, founder and sole operator, To The Max.
Phone and text: ${site.phone}
Email: ${site.email}
Location: ${site.city}, ${site.regionName}, United States
Website: ${url()}
`;
write("llms-full.txt", full);

/* ------------------------------------------------------------- 7. report */

console.log(`\nbuild  ${url()}`);
console.log(`  niches            ${niches.length}`);
console.log(`  pages rendered    ${htmlFiles.length}`);
console.log(`  css ?v=           ${CSS}`);
console.log(`  js  ?v=           ${JS}`);
console.log(`  sitemap entries   ${entries.length}`);
console.log(`  files written     ${written.length}`);
if (written.length) console.log(written.map((w) => "    " + w).join("\n"));
if (CHECK && problems.length) {
  console.error("\n--check found drift:\n" + problems.map((p) => "  " + p).join("\n") + "\n");
  process.exit(1);
}
console.log();
