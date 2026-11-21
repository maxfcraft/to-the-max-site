/* =========================================================================
   THE LAB. Field guides to new AI tools, written the week they ship.

   One entry per guide. The visible guide body is hand-written in
   lab/<slug>.html; this file holds what the machine layer needs from it:
   the hub listing, the Article dates, and the questions. The visible FAQ
   section on the guide page and its FAQPage schema are BOTH generated from
   `faqs` below, so they cannot drift. Change a question here, run
   `node scripts/build.mjs`, and both move together.

   Add a guide: write lab/<slug>.html (copy an existing guide), add one
   entry here, add one entry to data/pages.mjs with `guide: "<slug>"`, build.

   Honesty rule: a fact goes in a guide only if the maker documents it.
   `checked` is the date the sources were last read, and the guide page must
   show it in words (the build fails if it does not).
   ========================================================================= */

export const guides = [
  {
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

/** 2026-11-21 -> 21 November 2026. The form the visible pages print. */
export function humanDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}
