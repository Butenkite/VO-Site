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
  name: "Niko Butenko",
  tagline: "Voice actor for animation and video games.",

  // Photos of you, shown as paper cut-outs in the top section.
  // Any shape works: transparent cut-outs get a white border that follows your outline.
  // More than one cycles (and clicking jumps to the next). Empty list hides it.
  photos: [
    { file: "images/me-1.webp", alt: "Me grinning and adjusting my glasses" },
    { file: "images/me-2.webp", alt: "Me on the phone" },
    { file: "images/me-3.webp", alt: "Me mid-step, looking surprised" },
  ],
  photoCaption: "that's me!",   // handwritten under the photo; "" to hide
  photoSeconds: 3,              // how long each photo stays up

  // A few words casting folks can scan. Shown as little scraps under your name.
  voice: ["Character work", "Creatures & efforts", "Weird little guys"],

  // Paragraphs for the "About" page. One string per paragraph.
  about: [
    "I'm a voice actor focused on animation and games, recording from a home studio. It is currently a passion of mine, and appreciate any opportunities to work on projects.",
    "I came to VO from software, which means I'm quick with direction, fast with files, and genuinely happy to do one more take.",
  ],

  // Full demo reels. Leave empty until they're ready; the site shows a "coming soon" note.
  // { title: "Animation demo", file: "audio/animation-demo.mp3", note: "1:00" }
  reels: [],

  // Short clips: character voices, raw reads, auditions you're allowed to share.
  // file paths are relative to index.html. MP3 is the safest format for every browser.
  samples: [
    { title: "Jester", file: "audio/SmallMouse.mp3", note: "With no given direction, I was told to simply be unique!" },
    { title: "Goblin", file: "audio/GoblinWorker.mp3", note: "A unionized worker that is upset at the player." },
  ],

  // Booked and released roles, newest first.
  // size: "lead" (big tag), "supporting" (regular tag, the default) or "minor" (cast list)
  // type: anything short, e.g. "Game", "Animation", "Audio drama"
  // status: "Booked", "In production", "Released" (free text, shown on the tag)
  // link is optional
  roles: [
    { character: "Akito Shinonome", project: "VIVID BAD SQUAD UNIT English Dub", studio: "Studio: Our Stage", type: "Fan Dubbing", status: "Booked", year: "2026", link: "", size: "lead" },
    { character: "King Ateret", project: "Epoch Archives", studio: "Youtube", type: "Animation", status: "Booked", year: "2026", link: "", size: "supporting"},
  ],

  rolesOnBoard: 6,     // max tags shown; older supporting roles past this move to the cast list
  castListShown: 5,    // cast list lines shown before "show all"

  // Your setup. Remove any line you don't want shown; empty list hides the card.
  studio: [
    "Microphone: Blue Yeti",
    "Monitoring: Sennheiser HD 560S",
    "DAW: Audacity",
    "Remote sessions: Zoom, Discord",
    "Clean, edited files within 24–48 hours",
  ],

  contact: {
    email: "Butenkite@gmail.com",
    // Optional. Leave "" to hide.
    agent: "",
    // Any number of links. { label: "Casting Call Club", url: "https://..." }
    links: [
      { label: "Casting Call Club", url: "https://www.castingcall.club/m/alltrex" },
    ],
  },
};
