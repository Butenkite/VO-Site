(() => {
  "use strict";
  const S = window.SITE || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Tiny element builder. Text always goes through textContent, so content.js can't inject markup. */
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const c of children.flat()) if (c != null) node.append(c);
    return node;
  }
  const has = (v) => typeof v === "string" ? v.trim() !== "" : Array.isArray(v) && v.length > 0;

  /* ───────── seeded randomness, so every scrap tears the same way on every visit ───────── */
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Ragged polygon for clip-path. Depth is in px so big sheets and small scraps tear alike. */
  function tear(node, i) {
    const r = rng(hash((node.textContent || "").slice(0, 40) + i));
    const w = node.offsetWidth || 200;
    const h = node.offsetHeight || 60;
    const big = w > 420;
    const depth = big ? 5 : 3.5;
    const side = big ? 1.5 : 2.5;
    const nx = Math.max(8, Math.round(w / (big ? 16 : 11)));
    const ny = Math.max(3, Math.round(h / 14));
    const f = (n) => n.toFixed(2);
    const pts = [];
    for (let k = 0; k <= nx; k++) pts.push(`${f((k / nx) * 100)}% ${f(r() * depth)}px`);
    for (let k = 1; k < ny; k++) pts.push(`calc(100% - ${f(r() * side)}px) ${f((k / ny) * 100)}%`);
    for (let k = nx; k >= 0; k--) pts.push(`${f((k / nx) * 100)}% calc(100% - ${f(r() * depth)}px)`);
    for (let k = ny - 1; k > 0; k--) pts.push(`${f(r() * side)}px ${f((k / ny) * 100)}%`);
    node.style.setProperty("--tear", `polygon(${pts.join(",")})`);
  }

  function tilt(node, i, range = 2.4) {
    const r = rng(hash("tilt" + (node.textContent || "").slice(0, 20) + i));
    const a = (r() * 2 - 1) * range;
    const jump = (1.4 + r() * 1.8) * (a > 0 ? -1 : 1);
    node.style.setProperty("--r", a.toFixed(2) + "deg");
    node.style.setProperty("--r2", (a + jump).toFixed(2) + "deg");
  }

  function paperUp() {
    $$(".scrap").forEach((n, i) => { tilt(n, i); tear(n, i); });
    $$(".torn").forEach((n, i) => tear(n, i + 1000));
    $$(".tag").forEach((n, i) => tilt(n, i, 2));
  }

  /* ───────── text bits ───────── */
  const name = S.name || "";
  $$("[data-name]").forEach((n) => (n.textContent = name));
  document.title = name ? `${name} · Voice Actor` : "Voice Actor";
  if (has(S.tagline)) {
    $("[data-tagline]").textContent = S.tagline;
    $('meta[name="description"]').setAttribute("content", S.tagline);
  }
  $("[data-year]").textContent = new Date().getFullYear();

  /* ───────── photos: one at a time, hard cut to the next ───────── */
  const photos = (Array.isArray(S.photos) ? S.photos : S.photo ? [S.photo] : []).filter((p) => p && has(p.file));
  if (photos.length) {
    const many = photos.length > 1;
    const old = $("[data-photo-stage]");
    const stage = el(many ? "button" : "div", {
      class: "cutout-stage",
      type: many ? "button" : null,
      "aria-label": many ? "Show next photo" : null,
    });
    old.replaceWith(stage);
    const tilts = [-2.5, 2, -1, 3, -3.5];
    const imgs = photos.map((p, i) => {
      const img = el("img", { src: p.file, alt: p.alt || (name ? `Photo of ${name}` : "Photo"), decoding: "async" });
      img.style.setProperty("--r", (p.tilt ?? tilts[i % tilts.length]) + "deg");
      stage.append(img);
      return img;
    });
    let at = 0;
    const show = (i) => {
      at = (i + imgs.length) % imgs.length;
      imgs.forEach((img, k) => {
        img.classList.toggle("is-on", k === at);
        img.toggleAttribute("aria-hidden", k !== at);
      });
    };
    show(0);
    $("[data-photo-caption]").textContent = S.photoCaption ?? (S.photo && S.photo.caption) ?? "";
    $("[data-photo-wrap]").hidden = false;

    if (many) {
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const every = Math.max(1, Number(S.photoSeconds) || 3) * 1000;
      let timer = null;
      const start = () => { if (!still && !timer) timer = setInterval(() => !document.hidden && show(at + 1), every); };
      const restart = () => { clearInterval(timer); timer = null; start(); };
      stage.addEventListener("click", () => { show(at + 1); restart(); });
      start();
    }
  } else {
    $(".hero").classList.add("hero--no-photo");
  }

  const voice = $("[data-voice]");
  (S.voice || []).forEach((v) => voice.append(el("li", { text: v })));
  if (!has(S.voice)) voice.hidden = true;

  /* ───────── audio ───────── */
  let current = null; // { audio, row }
  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  function track(item, idx, group) {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = item.file;

    const btn = el("button", { class: "scrap play", type: "button", text: "play", "aria-label": `Play ${item.title}` });
    const scrub = el("input", { class: "scrub", type: "range", min: "0", max: "1000", value: "0", step: "1", "aria-label": `Seek ${item.title}` });
    const time = el("span", { class: "time", text: "0:00" });
    const row = el("li", { class: "track" },
      btn,
      el("p", { class: "track-title", text: item.title || "Untitled" }),
      el("div", { class: "track-meta" }, scrub, time),
      has(item.note) ? el("p", { class: "track-note", text: item.note }) : null,
    );

    const paint = () => {
      const p = audio.duration ? audio.currentTime / audio.duration : 0;
      scrub.value = String(Math.round(p * 1000));
      scrub.style.setProperty("--p", (p * 100).toFixed(1) + "%");
      time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
    };
    const setState = (playing) => {
      row.classList.toggle("is-playing", playing);
      btn.textContent = playing ? "pause" : "play";
      btn.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${item.title}`);
    };

    audio.addEventListener("loadedmetadata", paint);
    audio.addEventListener("timeupdate", paint);
    audio.addEventListener("play", () => setState(true));
    audio.addEventListener("pause", () => setState(false));
    audio.addEventListener("ended", () => { audio.currentTime = 0; paint(); });
    audio.addEventListener("error", () => {
      time.textContent = "file not found";
      btn.disabled = true;
    });

    btn.addEventListener("click", () => {
      if (current && current.audio !== audio) current.audio.pause();
      current = { audio, row };
      audio.paused ? audio.play().catch(() => {}) : audio.pause();
    });
    scrub.addEventListener("input", () => {
      if (audio.duration) audio.currentTime = (scrub.value / 1000) * audio.duration;
      paint();
    });

    row._play = () => btn.click();
    return row;
  }

  const reelsBox = $("[data-reels]");
  const samplesList = $("[data-samples]");
  const reels = S.reels || [];
  const samples = S.samples || [];

  if (reels.length) {
    const list = el("ol", { class: "tracks" });
    reels.forEach((r, i) => list.append(track(r, i, "reel")));
    reelsBox.append(list);
  } else {
    reelsBox.append(
      el("p", { class: "note torn" },
        "Demo reel is in the booth.",
        el("small", { text: samples.length ? "Until then, here are some clips." : "Check back soon." }),
      ),
    );
  }

  samples.forEach((s, i) => samplesList.append(track(s, i, "sample")));
  if (!samples.length) {
    samplesList.hidden = true;
    $("[data-samples-h]").hidden = true;
  } else if (!reels.length) {
    $("[data-samples-h]").hidden = true; // the note already introduces them
  }

  const playLatest = $("[data-play-latest]");
  const firstRow = $(".track");
  if (firstRow) {
    playLatest.addEventListener("click", () => {
      $("#listen").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      firstRow._play();
    });
  } else {
    playLatest.hidden = true;
  }

  /* ───────── roles ───────── */
  const roles = $("[data-roles]");
  (S.roles || []).forEach((r) => {
    const project = has(r.link)
      ? el("a", { href: r.link, target: "_blank", rel: "noopener", text: r.project })
      : r.project;
    const detail = [r.studio, [r.type, r.year].filter(has).join(", ")].filter(has);
    roles.append(
      el("li", { class: "tag torn" },
        has(r.status) ? el("span", { class: "stamp", text: r.status }) : null,
        el("p", { class: "tag-char", text: r.character }),
        el("p", { class: "tag-project" }, project),
        detail.map((d) => el("p", { class: "tag-detail", text: d })),
      ),
    );
  });
  if (!has(S.roles)) {
    roles.replaceWith(el("p", { class: "empty-roles", text: "First roles coming soon." }));
  }

  /* ───────── about + booth ───────── */
  const about = $("[data-about]");
  (S.about || []).forEach((p) => about.append(el("p", { text: p })));
  if (!has(S.about)) $("#about").hidden = true;

  const studio = $("[data-studio]");
  (S.studio || []).forEach((line) => studio.append(el("li", { text: line })));
  if (!has(S.studio)) $("[data-studio-wrap]").hidden = true;

  /* ───────── contact ───────── */
  const c = S.contact || {};
  const email = $("[data-email]");
  if (has(c.email)) {
    email.textContent = c.email;
    email.href = `mailto:${c.email}`;
  } else {
    email.hidden = true;
  }
  if (has(c.agent)) $("[data-agent]").textContent = `Representation: ${c.agent}`;
  const links = $("[data-links]");
  (c.links || []).forEach((l) => {
    if (has(l.url) && has(l.label)) links.append(el("li", {}, el("a", { href: l.url, target: "_blank", rel: "noopener", text: l.label })));
  });

  /* Tear paper after the handwriting font has loaded, so the sizes are right. */
  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  paperUp();
  ready.then(paperUp);
  let t;
  addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => $$(".torn").forEach((n, i) => tear(n, i + 1000)), 200); });
})();
