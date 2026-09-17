/* =========================================================================
   SINGLE SOURCE OF TRUTH for the machine layer.
   Change a value here, run `node scripts/build.mjs`, commit. Nothing else.
   ========================================================================= */

/* The live origin + base path that ACTUALLY serves today.
   When the real domain lands: set origin to "https://www.tothemax.agency",
   set base to "", run `node scripts/build.mjs`, push. That is the whole swap. */
export const site = {
  origin: "https://maxfcraft.github.io",
  base: "/to-the-max-site",
  name: "To The Max",
  legalName: "To The Max",
  founder: "Maximus Fayrweather",
  phone: "+1-281-908-4874",
  phoneDisplay: "281-908-4874",
  email: "maxfcraft@gmail.com",
  city: "Huntsville",
  region: "AL",
  regionName: "Alabama",
  country: "US",
  themeColor: "#141412",
  founded: "2026-06",

  /* THE ENTITY SENTENCE. 149 characters. Byte-identical in: the home page meta
     description, every schema `description`, llms.txt, and the visible About
     answer on the home page. Machines reconcile every source they find; three
     different sentences read as uncertainty. Do not paraphrase it anywhere. */
  entity:
    "To The Max is a one-operator marketing agency in Huntsville, Alabama running Meta ads, landing pages, and lead follow-up for local service businesses.",

  /* sameAs: ONLY profiles that exist and resolve. An empty array ships no
     sameAs at all, which is correct. Add the URL the day the profile is live. */
  sameAs: [
    // "https://www.instagram.com/<handle>",
    // "https://www.linkedin.com/company/<slug>",
    // "https://www.linkedin.com/in/<slug>",
    // "https://www.facebook.com/<handle>",
  ],

  /* aggregateRating is deliberately absent. It ships only when a real, public,
     readable review source exists. Invented ratings get quoted back at you. */

  towns: [
    "Huntsville", "Madison", "Athens", "Decatur", "Meridianville",
    "Harvest", "Hazel Green", "Owens Cross Roads", "New Market", "Gurley",
  ],
};

export const url = (path = "") => {
  const p = String(path).replace(/^\/+/, "");
  return `${site.origin}${site.base}${p ? "/" + p : "/"}`;
};
