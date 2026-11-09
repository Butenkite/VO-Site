/*
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT
 *  This is the only file you need to touch to update the site.
 *  Add, remove or reorder entries in any list below and reload.
 *  Empty lists are fine: each section shows a sensible note
 *  (or hides itself) when it has nothing in it.
 * ─────────────────────────────────────────────────────────────
 */
window.SITE = {
  name: "Your Name",
  tagline: "Voice actor for animation and video games.",

  // A few words casting folks can scan. Shown as little scraps under your name.
  voice: ["Character work", "Creatures & efforts", "Natural, youthful read"],

  // Paragraphs for the "About" page. One string per paragraph.
  about: [
    "I'm a voice actor focused on animation and games, recording from a treated home booth.",
    "I came to VO from software, which means I'm quick with direction, fast with files, and genuinely happy to do one more take.",
  ],

  // Full demo reels. Leave empty until they're ready; the site shows a "coming soon" note.
  // { title: "Animation demo", file: "audio/animation-demo.mp3", note: "1:00" }
  reels: [],

  // Short clips: character voices, raw reads, auditions you're allowed to share.
  // file paths are relative to index.html. MP3 is the safest format for every browser.
  samples: [
    { title: "Example clip (replace me)", file: "audio/example.mp3", note: "Swap this for a real read" },
  ],

  // Booked and released roles, newest first.
  // type: anything short, e.g. "Game", "Animation", "Audio drama"
  // status: "Booked", "In production", "Released" (free text, shown on the tag)
  // link is optional
  roles: [
    { character: "Character name", project: "Project title", studio: "Studio name", type: "Game", status: "Booked", year: "2026", link: "" },
    { character: "Character name", project: "Project title", studio: "Studio name", type: "Animation", status: "Booked", year: "2026", link: "" },
  ],

  // Your setup. Remove any line you don't want shown; empty list hides the card.
  studio: [
    "Treated home booth",
    "Microphone: (your mic)",
    "Interface: (your interface)",
    "Remote sessions: Zoom, Discord, SessionLinkPRO",
    "Clean, edited files within 24–48 hours",
  ],

  contact: {
    email: "you@example.com",
    // Optional. Leave "" to hide.
    agent: "",
    // Any number of links. { label: "Casting Call Club", url: "https://..." }
    links: [
      { label: "Casting Call Club", url: "#" },
      { label: "Instagram", url: "#" },
    ],
  },
};
