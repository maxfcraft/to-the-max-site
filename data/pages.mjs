/* =========================================================================
   The hand-authored pages. Title, description and machine-layer facts only.
   The visible copy lives in the .html files. This file never touches it.
   ========================================================================= */

export const pages = [
  {
    file: "index.html",
    path: "",
    title: "To The Max | Marketing for Local Businesses in Huntsville",
    /* the entity sentence, verbatim, is the home description. Set in build.mjs. */
    description: null,
    ogAlt: "To The Max, a marketing agency in Huntsville, Alabama",
    breadcrumb: [["Home", ""]],
    index: true,
    type: "home",
  },
  {
    file: "proof.html",
    path: "proof",
    title: "The Ledger | Dated Client Results, Wins and Failures",
    description: "Every campaign To The Max has run, dated, with the numbers attached. No borrowed logos and no invented star ratings. Read the record.",
    ogAlt: "The To The Max Ledger of dated client results",
    breadcrumb: [["Home", ""], ["Proof", "proof"]],
    index: true,
    type: "page",
  },
  {
    file: "expect.html",
    path: "expect",
    title: "What a Lead Feed Looks Like | To The Max",
    description: "A simulated walkthrough of what leads landing in your phone actually looks like, and what happens in the first sixty seconds after one arrives.",
    ogAlt: "A simulated lead feed from a To The Max campaign",
    breadcrumb: [["Home", ""], ["Expect", "expect"]],
    index: true,
    type: "page",
  },
  {
    file: "for/index.html",
    path: "for/",
    title: "Marketing by Industry | 32 Local Business Niches",
    description: "How paid ads, landing pages, and follow-up actually work in your trade, with the lead maths for each. Pick your industry and read the plan.",
    ogAlt: "To The Max marketing plans by industry",
    breadcrumb: [["Home", ""], ["Industries", "for/"]],
    index: true,
    type: "hub",
  },
  {
    file: "privacy.html",
    path: "privacy",
    title: "Privacy Policy | To The Max",
    description: "How To The Max collects, uses, and stores information submitted through this website and through client advertising campaigns.",
    ogAlt: "To The Max privacy policy",
    breadcrumb: [["Home", ""], ["Privacy", "privacy"]],
    index: false,
    type: "legal",
  },
  {
    file: "terms.html",
    path: "terms",
    title: "Terms of Service | To The Max",
    description: "The terms that apply to this website and to marketing services provided by To The Max to its clients.",
    ogAlt: "To The Max terms of service",
    breadcrumb: [["Home", ""], ["Terms", "terms"]],
    index: false,
    type: "legal",
  },
];

/* The visible questions on the home page, in the order they appear in the
   markup. FAQPage schema is generated from this list and must match the
   rendered H3s word for word. Change one, change both, same commit. */
export const homeFaqs = [
  {
    q: "What does To The Max do?",
    a: "To The Max builds and runs the whole lead system for a local business: the Meta ads, the landing page the ads point at, the form that captures the lead, and the follow-up that reaches them before the lead goes cold. It ships as one connected system, because an ad without a converting page and fast follow-up behind it is money on fire.",
  },
  {
    q: "Who runs the agency?",
    a: "Maximus Fayrweather, and only Maximus Fayrweather. It is a one-operator agency by design. You text the founder and the founder answers, usually the same day. There is no account manager between you and the person running your campaigns.",
  },
  {
    q: "Where is To The Max based and who does it work with?",
    a: "Huntsville, Alabama. Clients are local and owner-operated service businesses: home services, trades, shops, studios, and practices that win work in their own city. The work is done remotely, so the client does not have to be in Huntsville, but the marketing is always built for a business that sells in a specific place.",
  },
  {
    q: "Why would you trust a young agency?",
    a: "Because the founder is his own first client. Maximus owns Supreme Clean, a pressure washing company in Huntsville doing five thousand dollars a month, and every ad dollar behind it is his own. Strategies are paid for and tested there before they are ever sold. When one fails, he pays for that lesson instead of a client.",
  },
  {
    q: "What does it cost?",
    a: "Services are packaged, not itemised. Package one is Meta ads plus the CRM and follow-up system. Package two adds Google. A website is included in both and is never a separate line item. An AI receptionist is sold separately because it solves a different problem. You see the exact number, and the expected cost per lead, in writing before you spend anything.",
  },
  {
    q: "Who owns the ad account and the leads?",
    a: "You do, from day one. Every ad account, page, creative asset, and lead belongs to the client. If the relationship ends, nothing has to be handed back because it was never taken. Agencies that hold the account are holding a hostage, and that is not how this one works.",
  },
  {
    q: "How long is the commitment?",
    a: "Month to month. There is no six or twelve month contract. The work has to be worth renewing every month, which is a harder standard for the agency and a safer one for the client.",
  },
  {
    q: "What results can you actually show?",
    a: "Whatever is in the Ledger on the proof page, and nothing else. Every entry is dated and the numbers are real. There are no borrowed client logos, no invented star ratings, and no testimonials from people who do not exist. The record is short because the agency is young, and it grows every week.",
  },
  {
    q: "How do I start?",
    a: "Text or call 281-908-4874 for a fifteen minute conversation with no pitch in it. If the business is not a fit, you get told so on the call and pointed somewhere better. If it is, you get the plan in writing, including the budget and what a lead should cost you, before a dollar is spent.",
  },
];
