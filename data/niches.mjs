/* =========================================================================
   NICHE PAGE INDEX. Aggregates the hand-written groups.
   Add a niche: append it to the newest group file, run `node scripts/build.mjs`.
   ========================================================================= */

import { group1 } from "./niches-1.mjs";
import { group2 } from "./niches-2.mjs";
import { group3 } from "./niches-3.mjs";
import { group4 } from "./niches-4.mjs";
import { group5 } from "./niches-5.mjs";

export const niches = [...group1, ...group2, ...group3, ...group4, ...group5]
  .sort((a, b) => a.nav.localeCompare(b.nav));

export const bySlug = new Map(niches.map((n) => [n.slug, n]));
