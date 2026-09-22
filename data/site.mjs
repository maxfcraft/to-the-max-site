/* =========================================================================
   SINGLE SOURCE OF TRUTH for the machine layer.
   Change a value here, run `node scripts/build.mjs`, commit. Nothing else.
   ========================================================================= */

/* The live origin + base path that ACTUALLY serves. Bare apex on purpose:
   GitHub Pages redirects www to the apex, so the apex is the one canonical.
   Domain registered at Namecheap 2026-09-22, DNS points at GitHub Pages. */
export const site = {
  origin: "https://tothemax.marketing",
  base: "",
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
    /* Max studies at Auburn from fall 2026. Huntsville stays the home base
       because the proof business is there; Auburn and Opelika are served too. */
    "Auburn", "Opelika",
  ],
};

export const url = (path = "") => {
  const p = String(path).replace(/^\/+/, "");
  return `${site.origin}${site.base}${p ? "/" + p : "/"}`;
};
