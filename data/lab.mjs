/* =========================================================================
   THE LAB. Field guides to new AI tools, written the week they ship, and
   free tools we built ourselves.

   Two kinds of entry, set by `kind`:
     "guide"  a field guide to someone else's product, written from the
              maker's own documentation. The page shows "Last checked <date>".
     "tool"   something we built, tested and published. The page shows
              "Last tested <date>", and the head adds SoftwareApplication.

   One entry per guide or tool. The visible guide body is hand-written in
   lab/<slug>.html; this file holds what the machine layer needs from it:
   the hub listing, the Article dates, and the questions. The visible FAQ
   section on the guide page and its FAQPage schema are BOTH generated from
   `faqs` below, so they cannot drift. Change a question here, run
   `node scripts/build.mjs`, and both move together.

   Add a guide: write lab/<slug>.html (copy an existing guide), add one
   entry here, add one entry to data/pages.mjs with `guide: "<slug>"`, build.

   Honesty rule: a fact goes in a guide only if the maker documents it, and
   a claim goes on a tool page only if its own test files show it.
   `checked` is the date the sources were last read (guide) or the tool was
   last tested (tool), and the page must show it in words through
   provenanceLabel() below (the build fails if it does not).
   ========================================================================= */

export const guides = [
  {
    kind: "tool",
    slug: "claude-plugin-home-service-business",
    file: "lab/claude-plugin-home-service-business.html",
    path: "lab/claude-plugin-home-service-business",
    name: "Home Service Office",
    maker: "To The Max",
    plan: "Free, MIT",
    headline: "Home Service Office: a free Claude plugin for home service businesses",
    dek: "Eleven Claude skills that do the office work of a small home service business from pasted text: estimates, follow-ups, review replies, invoices and weekly numbers.",
    published: "2026-11-21",
    modified: "2026-11-21",
    checked: "2026-11-21",
    /* SoftwareApplication facts. Only what the repository states. No ratings. */
    software: {
      url: "https://github.com/maxfcraft/home-service-office",
      version: "1.0.0",
      category: "BusinessApplication",
      os: "Claude",
      license: "https://github.com/maxfcraft/home-service-office/blob/main/LICENSE",
    },
    sources: [
      ["Home Service Office repository (GitHub)", "https://github.com/maxfcraft/home-service-office"],
      ["Eval results, tests/EVAL-RESULTS.md (GitHub)", "https://github.com/maxfcraft/home-service-office/blob/main/tests/EVAL-RESULTS.md"],
      ["Live test transcripts, tests/transcripts (GitHub)", "https://github.com/maxfcraft/home-service-office/tree/main/tests/transcripts"],
      ["Install and manage plugins (Claude Code docs)", "https://code.claude.com/docs/en/discover-plugins"],
      ["Plugins in claude.ai and Cowork (Claude docs)", "https://claude.com/docs/plugins/overview"],
      ["Use plugins in Claude (Claude Help Center)", "https://support.claude.com/en/articles/13837440-use-plugins-in-claude"],
    ],
    faqs: [
      {
        q: "Is Home Service Office free?",
        a: "Yes. It is free and open source under the MIT license. There is no paid version, no account and no sign-up. You run it inside your own Claude account, so the only cost is the Claude plan you already pay for.",
      },
      {
        q: "Do I need Claude Code, or does the normal Claude app work?",
        a: "Both. The plugin is skills only, and Anthropic's documentation says plugin skills work in chat on claude.ai and the desktop app, in Cowork, and in Claude Code. We tested it in Claude Code. The claude.ai and Cowork install follows Anthropic's documented steps and was not run by us there.",
      },
      {
        q: "Which Claude plan do I need for this plugin?",
        a: "A paid one. Anthropic's help center says plugins are available on all paid plans: Pro, Max, Ultra, Team and Enterprise. On Team and Enterprise, an Owner can limit which marketplaces members are allowed to add. Every test we ran used the Sonnet model.",
      },
      {
        q: "Does the plugin see my customer data?",
        a: "No. The plugin is written instructions and nothing else. It has no server, no scripts, no connectors and no analytics, and it makes no network calls. What you paste is handled by Claude under your own Claude account and Anthropic's terms, like anything else you type into Claude. We never see it.",
      },
      {
        q: "Does it work for my trade?",
        a: "It was written for owner operators with 1 to 10 people in pressure washing, roofing, landscaping, HVAC, plumbing, cleaning, painting and pest control. The estimate writer carries separate rules for each of those eight trades. The test runs used pressure washing, roofing, HVAC, gutter and lawn jobs. Other trades get the same skills without trade specific rules.",
      },
      {
        q: "How is this different from Anthropic's Claude for Small Business plugin?",
        a: "This one is narrower. It is built only for home service trades, and it works from text you paste in, with no connected accounts. For what Anthropic's plugin covers, read Anthropic's own listing.",
      },
      {
        q: "Can I change the skills?",
        a: "Yes. Each skill is one plain text file called SKILL.md, and the MIT license lets you copy and change them. Fork the repository, edit the wording or the rules, and install your copy. On claude.ai you can also upload a zip of the folder with Add, then Upload plugin.",
      },
      {
        q: "How do I report a problem with Home Service Office?",
        a: "Open an issue on the GitHub repository at github.com/maxfcraft/home-service-office/issues. Say which skill you used, what you pasted with customer names and numbers removed, and what came back.",
      },
    ],
  },
  {
    kind: "guide",
    slug: "chatgpt-space",
    file: "lab/chatgpt-space.html",
    path: "lab/chatgpt-space",
    name: "ChatGPT Space",
    maker: "OpenAI",
    plan: "Plus",
    headline: "How to use ChatGPT Space: a field guide for Plus users",
    dek: "What Space is, how to build your first page, why a schedule written into a page does not run, and two free starter templates.",
    published: "2026-11-21",
    modified: "2026-11-21",
    checked: "2026-11-21",
    sources: [
      ["Getting started with Space in ChatGPT (OpenAI Help Center)", "https://help.openai.com/en/articles/20001549-getting-started-with-space-in-chatgpt"],
      ["ChatGPT release notes (OpenAI Help Center)", "https://help.openai.com/en/articles/6825453-chatgpt-release-notes"],
      ["Space: getting started (OpenAI Learn)", "https://learn.chatgpt.com/docs/space/getting-started"],
      ["Space: pages (OpenAI Learn)", "https://learn.chatgpt.com/docs/space/pages"],
      ["Space: agents (OpenAI Learn)", "https://learn.chatgpt.com/docs/space/agents"],
      ["Space feature page (chatgpt.com)", "https://chatgpt.com/features/space/"],
    ],
    faqs: [
      {
        q: "Do I have ChatGPT Space on the Plus plan?",
        a: "It is rolling out now. OpenAI began rolling Space out globally to Plus users aged 18 and over on November 20, 2026. The rollout is gradual, and the help article says it may not be available for your account yet. When it arrives, Space sits in the left sidebar where Library used to be. It costs nothing extra on top of Plus.",
      },
      {
        q: "Is ChatGPT Space the same as Projects?",
        a: "No. They are separate features and both still exist. Space holds pages: documents you write, edit with ChatGPT beside you, and share with other paid users. Projects keep a set of related chats and files together. Space replaced Library, not Projects.",
      },
      {
        q: "Why did the schedule I wrote into my page never run?",
        a: "Because writing a schedule into a page does not create one. OpenAI's agents documentation says that writing a cadence in a page or its instructions does not by itself confirm that a task is scheduled. To make a page update on a schedule, ask ChatGPT in a chat to set up the recurring work, then review the saved schedule, confirm it is enabled, and wait for one real run before you trust it.",
      },
      {
        q: "Is there a Keep updated button in ChatGPT Space?",
        a: "Not at launch, according to OpenAI. The November 20 release note says pages can be set to update automatically from connected apps and tools, but the agents documentation says Keep Updated is not available at launch. OpenAI has not said when it will appear on Plus accounts. Until it does, the documented route is to ask ChatGPT in chat to set up the recurring work.",
      },
      {
        q: "Can a friend on the Free plan open a page I shared?",
        a: "No. Sharing a Space page needs a paid ChatGPT account on both sides, and Free accounts cannot open shared pages. The person you share with also cannot see your private chats or your memory.",
      },
      {
        q: "Can I share a ChatGPT Space page with a public link?",
        a: "No. Public links are not available for pages. You share a page with specific people and set each one to view, comment or edit. Subpages inherit the access of the page above them.",
      },
      {
        q: "Where are Sheets in ChatGPT Space?",
        a: "Not out yet. OpenAI's help article says Sheets are coming soon. Pages are the document type that is live. Slides are rolling out to eligible accounts, and OpenAI has not said whether Plus is one of them.",
      },
      {
        q: "Can I edit ChatGPT Space pages on my phone?",
        a: "Plan on a computer for building. OpenAI documents creating and editing pages on the web and in the desktop app. On mobile, Space is documented for reading, sharing and moving between pages. Whether full editing works on mobile is not clearly documented.",
      },
    ],
  },
];

export const guideBySlug = new Map(guides.map((g) => [g.slug, g]));

/** The dated line a Lab page must print. A guide was checked against its
    maker's documentation; a tool was tested by us. */
export function provenanceLabel(g) {
  return `${g.kind === "tool" ? "Last tested" : "Last checked"} ${humanDate(g.checked)}`;
}

/** 2026-11-21 -> 21 November 2026. The form the visible pages print. */
export function humanDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}
