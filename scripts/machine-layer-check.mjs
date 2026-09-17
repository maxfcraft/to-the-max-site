#!/usr/bin/env node
/**
 * machine-layer-check.mjs - prove the machine layer, page by page.
 *
 * Runs against the LIVE edge by default, because a browser proves nothing
 * here: it runs the JavaScript for you. This fetches raw HTML, so what it
 * sees is what a crawler and an answer engine see.
 *
 * RUN   node scripts/machine-layer-check.mjs              (live)
 *       node scripts/machine-layer-check.mjs --local      (the folder)
 *       node scripts/machine-layer-check.mjs --verbose    (show passes too)
 *
 * EXIT  0 every page passed. 1 at least one failure.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { site, url } from "../data/site.mjs";
import { niches } from "../data/niches.mjs";
import { pages } from "../data/pages.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOCAL = process.argv.includes("--local");
const VERBOSE = process.argv.includes("--verbose");

const targets = [
  ...pages.map((p) => ({ path: p.path, file: p.file, index: p.index })),
  ...niches.map((n) => ({ path: `for/${n.slug}`, file: `for/${n.slug}.html`, index: true })),
];

const count = (s, re) => (s.match(re) || []).length;
const one = (s, re) => { const m = s.match(re); return m ? m[1] : null; };

async function load(t) {
  if (LOCAL) return fs.readFileSync(path.join(ROOT, t.file), "utf8");
  const res = await fetch(url(t.path), { redirect: "manual" });
  if (res.status >= 300 && res.status < 400) {
    return { redirect: res.headers.get("location"), status: res.status };
  }
  if (!res.ok) return { status: res.status };
  return await res.text();
}

let failures = 0;
const rows = [];

for (const t of targets) {
  const bad = [];
  const html = await load(t);

  if (typeof html !== "string") {
    bad.push(html.redirect ? `HTTP ${html.status} -> ${html.redirect}` : `HTTP ${html.status}`);
    rows.push([t.path || "/", bad]);
    failures++;
    continue;
  }

  const title = one(html, /<title>([^<]*)<\/title>/);
  const desc = one(html, /<meta name="description" content="([^"]*)"/);
  const canon = one(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = one(html, /<meta name="robots" content="([^"]*)"/);
  const ogImg = one(html, /<meta property="og:image" content="([^"]*)"/);
  const ogAlt = one(html, /<meta property="og:image:alt" content="([^"]*)"/);
  const tw = one(html, /<meta name="twitter:card" content="([^"]*)"/);
  const h1s = count(html, /<h1[\s>]/g);
  const h2s = count(html, /<h2[\s>]/g);
  const h3s = count(html, /<h3[\s>]/g);
  const want = url(t.path);

  if (!title) bad.push("no title");
  else if (title.length > 62) bad.push(`title ${title.length} chars`);
  if (!desc) bad.push("no description");
  else if (desc.length > 158) bad.push(`description ${desc.length} chars`);
  if (canon !== want) bad.push(`canonical ${canon} != ${want}`);
  if (h1s !== 1) bad.push(`${h1s} H1s`);
  if (h3s > 0 && h2s === 0) bad.push("H3 with no H2 above it");
  if (!ogImg) bad.push("no og:image");
  if (!ogAlt) bad.push("no og:image:alt");
  if (tw !== "summary_large_image") bad.push(`twitter:card ${tw}`);
  if (t.index && !/^index/.test(robots || "")) bad.push(`robots "${robots}" on an indexable page`);
  if (!t.index && !/noindex/.test(robots || "")) bad.push(`robots "${robots}" on a private page`);

  /* JSON-LD must parse, and must carry the blocks we claim to ship. */
  const ld = one(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) bad.push("no JSON-LD");
  else {
    try {
      const g = JSON.parse(ld)["@graph"] || [];
      const types = g.flatMap((b) => [].concat(b["@type"]));
      for (const need of ["ProfessionalService", "WebSite", "WebPage", "BreadcrumbList"]) {
        if (!types.includes(need)) bad.push(`schema missing ${need}`);
      }
      const biz = g.find((b) => [].concat(b["@type"]).includes("ProfessionalService"));
      if (biz && biz.description !== site.entity) bad.push("schema description is not the entity sentence");
      if (biz && biz.aggregateRating) bad.push("aggregateRating present with no public review source");
      /* FAQPage questions must exist verbatim in the visible HTML. */
      const faq = g.find((b) => b["@type"] === "FAQPage");
      if (faq) {
        for (const q of faq.mainEntity) {
          const needle = q.name.replace(/&/g, "&amp;").replace(/'/g, "&#39;");
          if (!html.includes(q.name) && !html.includes(needle)) {
            bad.push(`FAQ question not visible on page: "${q.name.slice(0, 40)}..."`);
          }
        }
      }
    } catch (e) { bad.push("JSON-LD does not parse: " + e.message); }
  }

  /* The hard bans. */
  if (/-9999px|-10000px|left:\s*-\d{4}/.test(html)) bad.push("offscreen text block");
  if (/class="sr-only"/.test(html)) bad.push("sr-only block on the page");
  if (/[—–]/.test(html)) bad.push("em or en dash in the markup");
  if (/\.html"/.test(html.replace(/https?:\/\/[^"]*/g, ""))) bad.push("internal .html link");

  /* The sales copy has to be in the raw HTML, with no JavaScript run. */
  if (h2s === 0) bad.push("no H2s in the raw HTML (content is JS-gated)");

  if (bad.length) failures++;
  rows.push([t.path || "/", bad, { title: title?.length, desc: desc?.length, h1s, h2s }]);
}

/* ------------------------------------------------------------ root files */

const rootChecks = [];
for (const f of ["robots.txt", "sitemap.xml", "llms.txt", "llms-full.txt"]) {
  const body = LOCAL
    ? fs.readFileSync(path.join(ROOT, f), "utf8")
    : await fetch(url(f)).then((r) => (r.ok ? r.text() : null)).catch(() => null);
  if (!body) { rootChecks.push([f, ["not reachable"]]); failures++; continue; }
  const bad = [];
  if (f === "robots.txt") {
    if (Buffer.byteLength(body) > 2000) bad.push(`${Buffer.byteLength(body)} bytes (over 2KB: a host is injecting a blocklist)`);
    if (count(body, /^Disallow:/gm) > 0) bad.push(`${count(body, /^Disallow:/gm)} Disallow lines`);
    if (!body.includes(`Sitemap: ${url("sitemap.xml")}`)) bad.push("sitemap line missing or wrong");
  }
  if (f === "sitemap.xml") {
    const locs = [...body.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
    const expected = targets.filter((t) => t.index).map((t) => url(t.path));
    for (const e of expected) if (!locs.includes(e)) bad.push(`missing ${e}`);
    for (const l of locs) if (!expected.includes(l)) bad.push(`extra ${l}`);
  }
  if (f.startsWith("llms") && !body.includes(site.entity)) bad.push("entity sentence not present");
  if (bad.length) failures++;
  rootChecks.push([f, bad]);
}

/* --------------------------------------------------------------- report */

console.log(`\nmachine layer  ${LOCAL ? "LOCAL FOLDER" : url()}\n`);
for (const [p, bad, meta] of rows) {
  if (!bad.length && !VERBOSE) continue;
  const mark = bad.length ? "FAIL" : "pass";
  const detail = meta ? `  title ${meta.title} | desc ${meta.desc} | h1 ${meta.h1s} | h2 ${meta.h2s}` : "";
  console.log(`  ${mark}  /${p}${detail}`);
  for (const b of bad) console.log(`          ${b}`);
}
for (const [f, bad] of rootChecks) {
  if (!bad.length && !VERBOSE) continue;
  console.log(`  ${bad.length ? "FAIL" : "pass"}  ${f}`);
  for (const b of bad) console.log(`          ${b}`);
}

console.log(
  `\n  ${rows.length + rootChecks.length} checked, ${failures} failing\n`
);
process.exit(failures ? 1 : 0);
