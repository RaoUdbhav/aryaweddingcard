/* ============================================================
   SHAADIPATH TEMPLATE 09 — MASTER INTERACTIVE & HYDRATION ENGINE
   ============================================================ */

const MAP_URL = "https://maps.app.goo.gl/QTLVJYt5qhXf88mW8";

function safeMapUrl(url) {
  var t = String(url == null ? "" : url).trim();
  if (!t) return "";
  var n = "", a = t.match(/https?:\/\/[^\s"'<>]+/);
  if (a) n = a[0];
  else {
    var r = t.split(/\s+/);
    for (var s = 0; s < r.length && !n; s++) {
      if (/^(www\.)?(maps\.)?(google\.[a-z.]{2,}|app\.goo\.gl|goo\.gl|share\.google|g\.co|openstreetmap\.org|apple\.com)([\/?#]|$)/i.test(r[s])) n = "https://" + r[s];
    }
  }
  return n ? n.replace(/[.,;]+$/, "") : "";
}

function safeMapAttr(url) {
  return safeMapUrl(url).replace(/&/g, "&amp;").replace(/"/g, "%22").replace(/</g, "%3C").replace(/>/g, "%3E");
}

var FARMAN_NAME_NON_LATIN = new RegExp("[^\\u0000-\\u024F\\u2018-\\u201F\\u2013\\u2014\\u2026\\s]");
var FARMAN_NAME_DEVANAGARI = new RegExp("[\\u0900-\\u097F]");

function farmanNameFallbackClass(e) {
  if (!e || !FARMAN_NAME_NON_LATIN.test(e)) return "";
  var t = " farman-name--fallback";
  if (FARMAN_NAME_DEVANAGARI.test(e)) t += " farman-name--deva";
  return t;
}

const EVENTS = [
  { id: "mehendi", icon: "assets/event/pn-evt-ico-mehendi-x-v01.webp", name: "Mehendi", date: "13th January 2027", time: "4:00 PM Onwards", venue: "Shree Jee Vilas, Sonipat", note: "A splash of henna and vibrant colors", map: MAP_URL },
  { id: "sangeet", icon: "assets/event/pn-evt-ico-sangeet-x-v01.webp", name: "Sangeet", date: "14th January 2027", time: "7:00 PM Onwards", venue: "Shree Jee Vilas, Sonipat", note: "An evening of music, dance & melody", map: MAP_URL },
  { id: "baraat", icon: "assets/event/pn-evt-ico-sangeet-x-v01.webp", name: "Baraat", date: "15th January 2027", time: "5:00 PM Onwards", venue: "Shree Jee Vilas, Sonipat", note: "The grand royal procession", map: MAP_URL },
  { id: "shaadi", icon: "assets/event/pn-evt-ico-shaadi-x-v01.webp", name: "Wedding", date: "15th January 2027", time: "8:00 PM Onwards", venue: "Shree Jee Vilas, Sonipat", note: "The sacred Pheras & union of souls", map: MAP_URL }
];

const A = {
  darkBg: "assets/hero/pn-hro-bg-courtyard-dark-m-v03.webp",
  litBg: "assets/hero/pn-hro-bg-courtyard-lit-m-v03.webp",
  darkBgDesktop: "assets/hero/pn-hro-bg-courtyard-dark-D-v03.webp",
  litBgDesktop: "assets/hero/pn-hro-bg-courtyard-lit-d-v03.webp",
  rope: "assets/hero/pn-hro-el-rope-hemp-pull-x-v01.webp",
  lotusClosed: "assets/hero/pn-rvl-btn-lotus-closed-x-v01.webp",
  lotusOpen: "assets/hero/pn-rvl-btn-lotus-open-x-v01.webp",
  lotusGlow: "assets/hero/pn-fx-ovl-lotus-glow-burst-x-v01.webp",
  jhoomer: "assets/shared/pn-shr-mot-jhoomer-hanging-x-v01.webp",
  floralBush: "assets/hero/pn-shr-mot-floral-bush-cluster-x-v01.webp",
  diya: "assets/hero/pn-shr-mot-diya-glow-x-v01.webp"
};

const PULL_THRESHOLD = Math.min(112, Math.max(84, Math.round(window.innerHeight * 0.11)));

function getHeroBackgrounds() {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  return { dark: isDesktop ? A.darkBgDesktop : A.darkBg, lit: isDesktop ? A.litBgDesktop : A.litBg };
}

/* Sound Synthesizer */
const Sound = {
  _ctx: null,
  get ctx() {
    if (!this._ctx) {
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    return this._ctx;
  },
  _play(fn) {
    if (rmq) return;
    try {
      const c = this.ctx;
      if (!c) return;
      if (c.state === "suspended") {
        c.resume().then(fn).catch(() => {});
      } else {
        fn();
      }
    } catch (e) {}
  },
  bell() {
    this._play(() => {
      const c = this.ctx;
      const t = c.currentTime;
      [[528, 0.3, 2], [1056, 0.14, 1.4], [792, 0.1, 1.7]].forEach(([freq, gain, dur]) => {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.connect(g);
        g.connect(c.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gain, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      });
    });
  },
  ambient() {
    this._play(() => {
      const c = this.ctx;
      const t = c.currentTime;
      [[220, 0.055, 4], [330, 0.04, 3.5], [440, 0.048, 4.8], [660, 0.028, 3.2]].forEach(([freq, gain, dur], i) => {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.connect(g);
        g.connect(c.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = t + i * 0.18;
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(gain, start + 0.55);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.start(start);
        osc.stop(start + dur + 0.1);
      });
    });
  },
  lotus() {
    this._play(() => {
      const c = this.ctx;
      const t = c.currentTime;
      [[396, 0.2, 1.6], [528, 0.15, 1.4], [792, 0.09, 1.1]].forEach(([freq, gain, dur], i) => {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.connect(g);
        g.connect(c.destination);
        osc.type = "sine";
        const start = t + i * 0.1;
        osc.frequency.setValueAtTime(freq * 0.88, start);
        osc.frequency.exponentialRampToValueAtTime(freq, start + 0.28);
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(gain, start + 0.18);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.start(start);
        osc.stop(start + dur + 0.1);
      });
    });
  },
  init() {}
};

const introEl = document.getElementById("intro");
const ropeButton = document.getElementById("ropeButton");
const ropeImg = document.getElementById("ropeImg");
const ropeHalo = ropeButton ? ropeButton.querySelector(".rope-halo") : null;
const pullFeedback = document.getElementById("pullFeedback");
const lotusButton = document.getElementById("lotusButton");
const lotusIconImg = document.getElementById("lotusIconImg");
const lotusGlow = document.getElementById("lotusGlowBurst");
const floatingMenu = document.getElementById("floatingMenu");
const menuToggle = document.getElementById("menuToggle");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const rmq = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setBgMusicState(isPlaying) {
  if (!musicToggle) return;
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
}

function syncBgMusicState() {
  if (bgMusic) setBgMusicState(!bgMusic.paused && !bgMusic.ended);
}

function playBgMusic() {
  if (!bgMusic) return Promise.resolve();
  bgMusic.muted = false;
  bgMusic.volume = 1;
  return bgMusic.play().then(syncBgMusicState);
}

function pauseBgMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  syncBgMusicState();
}

let _musicUnlocked = false;
function _unlockMusic() {
  if (_musicUnlocked || !bgMusic) return;
  bgMusic.volume = 0;
  bgMusic.play().then(() => {
    _musicUnlocked = true;
    if (triggered) {
      bgMusic.volume = 1;
      syncBgMusicState();
    } else {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.volume = 1;
      syncBgMusicState();
    }
  }).catch(() => { bgMusic.volume = 1; });
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", e => {
    e.stopPropagation();
    if (bgMusic.paused) {
      playBgMusic().catch(syncBgMusicState);
    } else {
      pauseBgMusic();
    }
  });
  ["play", "playing", "pause", "ended", "emptied", "error"].forEach(evt => {
    bgMusic.addEventListener(evt, syncBgMusicState);
  });
}

function buildDust() {
  const container = document.getElementById("introDust");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 32; i++) {
    const p = document.createElement("div");
    p.className = "dust-particle";
    const size = 1 + Math.random() * 2.8;
    const left = 22 + Math.random() * 56;
    const bottom = 8 + Math.random() * 60;
    const dur = 7 + Math.random() * 10;
    const delay = Math.random() * 8;
    p.style.cssText = `width:${size}px;height:${size}px;left:${left}%;bottom:${bottom}%;animation-duration:${dur}s;animation-delay:${delay}s`;
    container.appendChild(p);
  }
}

function buildPetals() {
  const container = document.getElementById("introPetals");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    const left = 6 + Math.random() * 88;
    const bottom = Math.random() * 18;
    const dur = 10 + Math.random() * 14;
    const delay = Math.random() * 10;
    const w = 5 + Math.random() * 7;
    p.style.cssText = `left:${left}%;bottom:${bottom}%;width:${w}px;height:${w * 0.62}px;animation-duration:${dur}s;animation-delay:${delay}s`;
    container.appendChild(p);
  }
}

function resist(dy) {
  const t1 = PULL_THRESHOLD * 0.38;
  const t2 = PULL_THRESHOLD * 0.82;
  if (dy <= t1) return dy * 0.92;
  if (dy <= t2) return t1 * 0.92 + (dy - t1) * 0.58;
  return t1 * 0.92 + (t2 - t1) * 0.58 + (dy - t2) * 0.3;
}

let pxFrame = 0;
function setParallax(x, y) {
  if (!introEl) return;
  introEl.style.setProperty("--px-bg-x", `${(-x * 13).toFixed(2)}px`);
  introEl.style.setProperty("--px-bg-y", `${(-y * 8).toFixed(2)}px`);
  introEl.style.setProperty("--px-jhm-x", `${(x * 22).toFixed(2)}px`);
  introEl.style.setProperty("--px-jhm-y", `${(y * 14).toFixed(2)}px`);
  introEl.style.setProperty("--px-flr-x", `${(x * 52).toFixed(2)}px`);
  introEl.style.setProperty("--px-flr-y", `${(y * 34).toFixed(2)}px`);
  introEl.style.setProperty("--px-dya-x", `${(x * 30).toFixed(2)}px`);
  introEl.style.setProperty("--px-dya-y", `${(y * 19).toFixed(2)}px`);
}

function queueParallax(x, y) {
  if (rmq || !introEl || introEl.classList.contains("is-complete")) return;
  if (pxFrame) cancelAnimationFrame(pxFrame);
  pxFrame = requestAnimationFrame(() => {
    setParallax(x, y);
    pxFrame = 0;
  });
}

function hydrate() {
  const bg = getHeroBackgrounds();
  const darkBgEl = document.getElementById("introBgDark");
  const litBgEl = document.getElementById("introBgLit");
  if (darkBgEl) darkBgEl.src = bg.dark;
  if (litBgEl) litBgEl.src = bg.lit;

  const jhoomerEl = document.getElementById("introJhoomer");
  if (jhoomerEl) jhoomerEl.src = A.jhoomer;

  const flLeft = document.getElementById("introFloralLeft");
  const flRight = document.getElementById("introFloralRight");
  if (flLeft) flLeft.src = A.floralBush;
  if (flRight) flRight.src = A.floralBush;

  const diyaLeft = document.getElementById("introDiyaLeft");
  const diyaRight = document.getElementById("introDiyaRight");
  if (diyaLeft) diyaLeft.src = A.diya;
  if (diyaRight) diyaRight.src = A.diya;

  if (ropeImg) ropeImg.src = A.rope;
  if (lotusIconImg) lotusIconImg.src = A.lotusClosed;
  if (lotusGlow) lotusGlow.src = A.lotusGlow;

  const lotusOpenEl = document.getElementById("lotusOpenImg");
  if (lotusOpenEl) lotusOpenEl.src = A.lotusOpen;

  buildDust();
  buildPetals();
  applyGrandparentsMode();
  renderEvents();
  renderStars();
  renderBirds();
  initEvtParallax();

  setTimeout(() => {
    if (!triggered && introEl) introEl.classList.add("is-waiting");
  }, 1100);
  setTimeout(() => {
    if (!triggered && ropeButton) ropeButton.classList.add("rope-ready", "rope-idle");
  }, 1900);
}

const farmanObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    farmanObserver.unobserve(target);
    target.classList.add("is-entering");
    setTimeout(() => target.classList.add("is-unrolling"), 620);
    setTimeout(() => target.classList.add("is-open"), 1400);
  });
}, { threshold: 0.12 });

function renderEvents() {
  const container = document.getElementById("evtStops");
  if (!container) return;
  container.innerHTML = "";

  EVENTS.forEach((evt, idx) => {
    const isEven = idx % 2 === 0;
    const article = document.createElement("article");
    article.className = `farman-stop ${isEven ? "farman-left" : "farman-right"}`;
    article.setAttribute("role", "listitem");
    article.setAttribute("data-event", evt.id);

    article.innerHTML = `
      <div class="farman-rolled-wrap" aria-hidden="true">
        <img class="farman-rolled-img" src="assets/event/pn-evt-farman-rolled-x-v01.webp" alt="" draggable="false" decoding="async">
      </div>
      <div class="farman-open-wrap">
        <img class="farman-parchment-img" src="assets/event/pn-evt-farman-open-x-v01.webp" alt="" aria-hidden="true" draggable="false" decoding="async">
        <div class="farman-dust-layer" aria-hidden="true"></div>
        <div class="farman-content" aria-label="${evt.name} ceremony details">
          <img class="farman-motif" src="${evt.icon}" alt="${evt.name} motif" decoding="async">
          <h3 class="farman-name">${evt.name}</h3>
          <div class="farman-rule" aria-hidden="true"></div>
          <p class="farman-datetime">${evt.date} &middot; ${evt.time}</p>
          <p class="farman-venue">${evt.venue}</p>
          ${evt.note ? `<p class="farman-note">${evt.note}</p>` : ""}
          <a class="farman-map" href="${evt.map}" target="_blank" rel="noopener noreferrer">📍 Open in Maps</a>
        </div>
      </div>
    `.trim();

    container.appendChild(article);
    farmanObserver.observe(article);
  });
}

function initEvtParallax() {
  const section = document.getElementById("events");
  const peacock = document.getElementById("evtPeacock");
  const elephant = document.getElementById("evtElephant");
  if (!section || !peacock || !elephant || rmq) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect();
      const h = section.offsetHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / h));
      const shift = (progress * 18).toFixed(1);
      peacock.style.transform = `translateY(-${shift}px)`;
      elephant.style.transform = `scaleX(-1) translateY(-${shift}px)`;
      ticking = false;
    });
  }, { passive: true });
}

function renderStars() {
  const canvas = document.getElementById("evtStars");
  const section = document.getElementById("events");
  if (!canvas || !section) return;
  const ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const numStars = window.innerWidth < 768 ? 40 : 120;
  const stars = Array.from({ length: numStars }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.5 + Math.random() * 1.5,
    base: 0.2 + Math.random() * 0.6,
    spd: 0.2 + Math.random() * 0.6,
    phase: Math.random() * 6.28,
    warm: Math.random() > 0.5
  }));

  let animId = null;
  function draw(time) {
    const t = time * 0.001;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const alpha = s.base * (0.3 + 0.7 * (Math.sin(t * s.spd + s.phase) * 0.5 + 0.5));
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, 6.28);
      ctx.fillStyle = s.warm ? `rgba(255,238,205,${alpha})` : `rgba(215,228,255,${alpha})`;
      ctx.fill();
    }
    animId = requestAnimationFrame(draw);
  }
  animId = requestAnimationFrame(draw);
}

function renderBirds() {
  const container = document.getElementById("evtBirds");
  if (!container || rmq) return;
  container.innerHTML = "";
  const birds = [
    { top: 7, w: 24, dur: 30, del: 0 },
    { top: 13, w: 16, dur: 38, del: -11 },
    { top: 19, w: 28, dur: 24, del: -20 },
    { top: 25, w: 20, dur: 28, del: -33 }
  ];
  birds.forEach(b => {
    const el = document.createElement("span");
    el.className = "evt-bird";
    el.style.setProperty("--bird-top", `${b.top}%`);
    el.style.setProperty("--bird-w", `${b.w}px`);
    el.style.setProperty("--bird-dur", `${b.dur}s`);
    el.style.setProperty("--bird-del", `${b.del}s`);
    container.appendChild(el);
  });
}

let HAS_GRANDPARENTS = true;
function applyGrandparentsMode() {
  const gpWrap = document.querySelector(".inv-blessing");
  if (gpWrap) gpWrap.style.display = HAS_GRANDPARENTS ? "block" : "none";
}

function revealSite() {
  if (introEl) introEl.classList.add("is-complete");
  document.body.classList.remove("intro-active");
  if (floatingMenu) floatingMenu.classList.add("is-visible");
  const inviteSection = document.getElementById("invite");
  if (inviteSection) {
    setTimeout(() => inviteSection.classList.add("invite-active"), 180);
  }
}

let triggered = false;
function triggerIntro() {
  if (triggered) return;
  triggered = true;
  Sound.bell();
  playBgMusic().catch(() => { syncBgMusicState(); });

  if (ropeFrame) {
    cancelAnimationFrame(ropeFrame);
    ropeFrame = 0;
  }
  if (pullFeedback) pullFeedback.classList.remove("is-visible");
  if (introEl) {
    introEl.classList.remove("is-waiting");
    introEl.classList.add("is-lit");
    Sound.ambient();
    setTimeout(() => introEl.classList.add("show-names"), 1000);
    setTimeout(() => introEl.classList.add("show-lotus"), 1800);
  }
}

/* Hemp Pull Rope Physics */
let isDragging = false, dragStartY = 0;
let ropeTargetY = 0, ropeVisualY = 0, ropeVelocityY = 0, ropeFrame = 0, ropePeakRaw = 0;

function applyRopePhysicsFrame() {
  const friction = isDragging ? 0.7 : 0.6;
  const k = isDragging ? 0.26 : 0.18;
  ropeVelocityY = (ropeVelocityY + (ropeTargetY - ropeVisualY) * k) * friction;
  ropeVisualY += ropeVelocityY;

  const scaleY = 1 + Math.min(ropeVisualY / (PULL_THRESHOLD * 1.4), 0.6);
  if (ropeImg) ropeImg.style.transform = `scaleY(${scaleY.toFixed(3)})`;

  if (!isDragging && ropeTargetY === 0 && Math.abs(ropeVisualY) < 0.45) {
    ropeVisualY = 0;
    ropeVelocityY = 0;
    if (ropeImg) ropeImg.style.transform = "";
    ropeFrame = 0;
    return;
  }
  ropeFrame = requestAnimationFrame(applyRopePhysicsFrame);
}

function startRopePhysics() {
  if (!ropeFrame) ropeFrame = requestAnimationFrame(applyRopePhysicsFrame);
}

if (ropeButton) {
  ropeButton.addEventListener("pointerdown", e => {
    if (triggered) return;
    _unlockMusic();
    e.preventDefault();
    isDragging = true;
    dragStartY = e.clientY;
    ropePeakRaw = 0;
    ropeButton.classList.add("rope-ready");
    ropeButton.classList.remove("rope-idle");
    ropeButton.classList.add("is-pulling");
    ropeTargetY = ropeVisualY;
    startRopePhysics();
    ropeButton.setPointerCapture(e.pointerId);
  });

  ropeButton.addEventListener("pointermove", e => {
    if (!isDragging || triggered) return;
    e.preventDefault();
    const rawDy = Math.max(0, e.clientY - dragStartY);
    const dy = resist(rawDy);
    ropeTargetY = dy;
    ropePeakRaw = Math.max(ropePeakRaw, rawDy);
    startRopePhysics();
    if (rawDy >= PULL_THRESHOLD) {
      isDragging = false;
      triggerIntro();
    }
  });

  ropeButton.addEventListener("pointerup", e => {
    if (ropeButton.hasPointerCapture(e.pointerId)) ropeButton.releasePointerCapture(e.pointerId);
    isDragging = false;
    if (!triggered) {
      ropeTargetY = 0;
      startRopePhysics();
    }
  });

  ropeButton.addEventListener("click", () => {
    if (!triggered) triggerIntro();
  });
}

if (lotusButton) {
  lotusButton.addEventListener("click", () => {
    if (lotusButton.classList.contains("is-animating")) return;
    lotusButton.classList.add("is-animating");
    Sound.lotus();
    lotusButton.classList.add("is-open");
    setTimeout(revealSite, 1000);
  });
}

if (menuToggle && floatingMenu) {
  menuToggle.addEventListener("click", e => {
    e.stopPropagation();
    const open = floatingMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".menu-link").forEach(link => {
    link.addEventListener("click", e => {
      if (link.id === "menuHome") {
        e.preventDefault();
        triggered = false;
        if (floatingMenu) floatingMenu.classList.remove("is-visible", "is-open");
        if (introEl) {
          introEl.classList.remove("is-complete");
          introEl.classList.add("is-lit", "show-names", "show-date", "show-venue", "show-lotus");
        }
        document.body.classList.add("intro-active");
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        floatingMenu.classList.remove("is-open");
      }
    });
  });
}

/* Custom Scratch Card Engine */
function initScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const wrapper = canvas.parentElement;

  function setCanvasSize() {
    const rect = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Champagne / Gold Metallic Foil Coating
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#D8A957');
    gradient.addColorStop(0.3, '#FFF3CC');
    gradient.addColorStop(0.5, '#C59338');
    gradient.addColorStop(0.8, '#E8C580');
    gradient.addColorStop(1, '#996F1D');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle grain texture
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Call-to-action text overlay
    ctx.fillStyle = '#291804';
    ctx.font = 'bold 13px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH HERE ✨', rect.width / 2, rect.height / 2);
  }

  let isScratching = false, lastX = 0, lastY = 0;

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function scratchLine(x1, y1, x2, y2) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 36;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function startScratch(e) {
    isScratching = true;
    const pos = getCoords(e);
    lastX = pos.x; lastY = pos.y;
    scratchLine(lastX, lastY, lastX, lastY);
  }

  function moveScratch(e) {
    if (!isScratching) return;
    const pos = getCoords(e);
    scratchLine(lastX, lastY, pos.x, pos.y);
    lastX = pos.x; lastY = pos.y;
  }

  function endScratch() { isScratching = false; }

  canvas.addEventListener('mousedown', startScratch);
  canvas.addEventListener('mousemove', moveScratch);
  window.addEventListener('mouseup', endScratch);

  canvas.addEventListener('touchstart', startScratch, { passive: true });
  canvas.addEventListener('touchmove', moveScratch, { passive: true });
  window.addEventListener('touchend', endScratch);

  setCanvasSize();
}

document.addEventListener("DOMContentLoaded", () => {
  hydrate();
  Sound.init();
  initScratchCard();
});
