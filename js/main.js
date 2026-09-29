/* ============================================================
   Abdallah Abas — core engine: chrome injection, i18n, nav,
   reveal animations, counters, hero canvas, dialogs, toast.
   NOTE: innerHTML is used ONLY with trusted static templates
   and esc()-escaped data — never with user input.
   ============================================================ */
"use strict";

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g,
  c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- shared namespace ------------------------------------- */
window.AA = {
  LANG: "en", renderers: [],
  t(key) {
    const get = l => key.split(".").reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, I18N[l]);
    const v = get(this.LANG);
    return typeof v === "string" ? v : (typeof get("en") === "string" ? get("en") : key);
  },
  L : o => o ? (typeof o === "string" ? o : (o[this.LANG] ?? o.en ?? "")) : "",
  LL: o => Array.isArray(o) ? o : (o ? (o[this.LANG] ?? o.en ?? []) : []),
  onRender(fn) { this.renderers.push(fn); },
  openRequest: null
};

const { t, L, LL, esc: E } = window.AA;

/* ---- icon sprite (single source of truth for all glyphs) --- */
const STROKE = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
const FILL   = 'fill="currentColor" stroke="none"';
const ICONS = {
  code:      `<path d="M8 7l-5 5 5 5M16 7l5 5-5 5" ${STROKE}/>`,
  search:    `<circle cx="11" cy="11" r="6.5" ${STROKE}/><path d="M20.5 20.5l-4.3-4.3" ${STROKE}/>`,
  shield:    `<path d="M12 3l7 2.8v5.4c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V5.8z" ${STROKE}/><path d="M9.2 12l2 2 3.8-4" ${STROKE}/>`,
  layout:    `<rect x="3" y="4" width="18" height="16" rx="2" ${STROKE}/><path d="M3 9h18M7.5 13.5h9" ${STROKE}/>`,
  pen:       `<path d="M12 20.5h9" ${STROKE}/><path d="M16.6 3.6a2.05 2.05 0 013 3L7 19l-4 1 1-4z" ${STROKE}/>`,
  gauge:     `<path d="M4.5 15.5a8 8 0 1115 0" ${STROKE}/><path d="M12 15.5l4-4.5" ${STROKE}/><circle cx="12" cy="15.5" r="1.3" ${STROKE}/>`,
  terminal:  `<rect x="3" y="4" width="18" height="16" rx="2" ${STROKE}/><path d="M7 9l3.2 3L7 15M13 15.5h4" ${STROKE}/>`,
  audit:     `<rect x="5" y="4" width="14" height="17" rx="2" ${STROKE}/><path d="M9 4V2.8h6V4" ${STROKE}/><path d="M9 13.5l2 2 4-4" ${STROKE}/>`,
  compass:   `<circle cx="12" cy="12" r="9" ${STROKE}/><path d="M15.2 8.8l-1.7 4.7-4.7 1.7 1.7-4.7z" ${STROKE}/>`,
  check:     `<path d="M4.5 12.5l5 5 10-11" ${STROKE}/>`,
  chevron:   `<path d="M6 9.5l6 6 6-6" ${STROKE}/>`,
  arrow:     `<path d="M4 12h15M13.5 5.5l6.5 6.5-6.5 6.5" ${STROKE}/>`,
  external:  `<path d="M14 4h6v6M20 4L10.5 13.5M18 13.5V20H4.5V6.5H11" ${STROKE}/>`,
  download:  `<path d="M12 3.5v11M7 9.5l5 5 5-5M4.5 20.5h15" ${STROKE}/>`,
  menu:      `<path d="M4 7h16M4 12h16M4 17h16" ${STROKE}/>`,
  close:     `<path d="M6 6l12 12M18 6L6 18" ${STROKE}/>`,
  mail:      `<rect x="3" y="5" width="18" height="14" rx="2" ${STROKE}/><path d="M3.5 7.5l8.5 5.5 8.5-5.5" ${STROKE}/>`,
  clock:     `<circle cx="12" cy="12" r="8.5" ${STROKE}/><path d="M12 7.5V12l3 2" ${STROKE}/>`,
  award:     `<circle cx="12" cy="9" r="5" ${STROKE}/><path d="M9.5 13.2L8 21l4-2.4L16 21l-1.5-7.8" ${STROKE}/>`,
  send:      `<path d="M21 3.5L10.8 13.7M21 3.5l-6.6 17-3.6-7.3L3.5 9.6z" ${STROKE}/>`,
  copy:      `<rect x="9" y="9" width="12" height="12" rx="2" ${STROKE}/><path d="M5 15V5a2 2 0 012-2h10" ${STROKE}/>`,
  whatsapp:  `<path ${FILL} d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1112 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.7 6.7 0 01-2-1.2 7.4 7.4 0 01-1.4-1.7c-.1-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4a.4.4 0 000-.3c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 00-.7.3A2.9 2.9 0 006.7 10a5 5 0 001 2.7 11.4 11.4 0 004.4 3.9 5 5 0 003.1.7 2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.2-1.3c-.1-.1-.3-.2-.6-.3z"/>`,
  facebook:  `<path ${FILL} d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9a18 18 0 00-2-.1c-2 0-3.4 1.2-3.4 3.5V11H8.5v3H11v7z"/>`,
  linkedin:  `<rect x="3" y="3" width="18" height="18" rx="2.5" ${STROKE}/><path d="M8 10.5V17M8 7.2v.1M12 17v-3.8a2.2 2.2 0 014.4 0V17" ${STROKE}/>`,
  instagram: `<rect x="3" y="3" width="18" height="18" rx="5" ${STROKE}/><circle cx="12" cy="12" r="4" ${STROKE}/><path d="M17.2 6.8v.1" ${STROKE}/>`,
  telegram:  `<path ${FILL} d="M21.5 4.2 18.6 19a1 1 0 01-1.6.6l-3.9-2.9-2 1.9a1 1 0 01-1.6-.4l-1.3-4.2-4-1.3a1 1 0 010-1.9L19.9 3a1 1 0 011.6 1.2zM17 7.5l-8 5.4 1 3 .4-2.8z"/>`,
  github:    `<path ${FILL} d="M12 .5A11.5 11.5 0 00.5 12a11.5 11.5 0 007.9 10.9c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7a4.5 4.5 0 011.2-3.1 4.2 4.2 0 01.1-3s1-.3 3.3 1.2a11 11 0 015.8 0c2.3-1.5 3.3-1.2 3.3-1.2a4.2 4.2 0 01.1 3 4.5 4.5 0 011.2 3.1c0 4.5-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0023.5 12 11.5 11.5 0 0012 .5z"/>`
};
function buildSprite() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("style", "display:none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = Object.entries(ICONS).map(([n, body]) =>
    `<symbol id="i-${n}" viewBox="0 0 24 24">${body}</symbol>`).join("");
  document.body.prepend(svg);
}
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

/* ---- logo -------------------------------------------------- */
const LOGO_SVG = `<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
  <rect width="32" height="32" rx="6" fill="#FF6600"/>
  <path d="M9.5 23 16 8.5 22.5 23h-3.6L16 16.4 13.1 23z" fill="#0a0a0b"/></svg>`;

function brandHTML() {
  const mark = SITE_CONFIG.logo.src
    ? `<img src="${esc(SITE_CONFIG.logo.src)}" alt="${esc(t("a11y.home") + " — " + SITE_CONFIG.brandName)}" width="34" height="34">`
    : LOGO_SVG;
  return `${mark}<span class="brand-word">ABDALLAH&nbsp;ABAS</span><span class="brand-dot" aria-hidden="true"></span>`;
}

/* ---- chrome: header / mobile panel / footer / request dialog */
const NAV_ITEMS = [
  ["index.html", "nav.home"], ["about.html", "nav.about"], ["services.html", "nav.services"],
  ["portfolio.html", "nav.portfolio"], ["achievements.html", "nav.achievements"],
  ["certificates.html", "nav.certificates"], ["articles.html", "nav.articles"],
  ["faq.html", "nav.faq"], ["contact.html", "nav.contact"]
];
const langToggleHTML = () => `
  <div class="lang-switch" role="group" aria-label="${t("a11y.langSwitch")}">
    <button type="button" class="lang-btn" data-lang="ar" aria-pressed="false">AR</button>
    <span class="lang-sep" aria-hidden="true"></span>
    <button type="button" class="lang-btn" data-lang="en" aria-pressed="false">EN</button>
  </div>`;

function navLinks(cls) {
  const cur = location.pathname.split("/").pop() || "index.html";
  return `<ul class="${cls}">` + NAV_ITEMS.map(([href, key]) => {
    const active = cur === href;
    return `<li><a href="${href}" ${active ? 'aria-current="page"' : ""} data-i18n="${key}">${t(key)}</a></li>`;
  }).join("") + "</ul>";
}

function renderChrome() {
  const header = document.createElement("header");
  header.className = "site-header"; header.id = "siteHeader";
  header.innerHTML = `<div class="container header-in">
    <a class="brand" href="index.html">${brandHTML()}</a>
    <nav class="main-nav" aria-label="${t("a11y.mainNav")}">${navLinks("nav-list")}</nav>
    <div class="header-actions">
      ${langToggleHTML()}
      <button type="button" class="btn btn-solid btn-s header-cta" data-request>${esc(t("cta.request"))}</button>
      <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false"
        aria-controls="mobilePanel" aria-label="${t("a11y.openMenu")}">${icon("menu", "i-menu")}${icon("close", "i-close")}</button>
    </div></div>`;
  document.body.prepend(header);

  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop"; backdrop.id = "navBackdrop";
  document.body.appendChild(backdrop);

  const panel = document.createElement("nav");
  panel.className = "mobile-panel"; panel.id = "mobilePanel";
  panel.setAttribute("aria-label", t("a11y.mobileNav"));
  panel.innerHTML = navLinks("mobile-list") + `<div class="mobile-foot">${langToggleHTML()}
    <button type="button" class="btn btn-solid btn-block" data-request>${esc(t("cta.request"))}</button></div>`;
  document.body.appendChild(panel);

  document.body.appendChild(renderFooter());

  const dlg = document.createElement("div");
  dlg.className = "overlay"; dlg.id = "dialogRoot";
  document.body.appendChild(dlg);

  const toast = document.createElement("div");
  toast.className = "toast"; toast.id = "toast"; toast.setAttribute("role", "status");
  document.body.appendChild(toast);
}

function renderFooter() {
  const f = document.createElement("footer");
  f.className = "site-footer";
  f.innerHTML = `<div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand" href="index.html">${brandHTML()}</a>
      <p data-i18n="footer.tagline">${t("footer.tagline")}</p>
      <div class="social-row" id="footerSocial"></div>
    </div>
    <nav aria-label="${t("footer.navT")}"><h3 data-i18n="footer.navT">${t("footer.navT")}</h3>
      ${navLinks("footer-list")}</nav>
    <div><h3 data-i18n="footer.servT">${t("footer.servT")}</h3>
      <ul class="footer-list">${SITE_CONFIG.services.slice(0, 5).map(s =>
        `<li><a href="services.html">${esc(L(s.name))}</a></li>`).join("")}</ul></div>
    <div><h3 data-i18n="footer.contactT">${t("footer.contactT")}</h3>
      <ul class="footer-list" id="footerContact"></ul></div>
  </div>
  <div class="container footer-bar">
    <p>© <span id="year" class="num">2025</span> ${esc(SITE_CONFIG.brandName)}. <span data-i18n="footer.rights">${t("footer.rights")}</span></p>
    <ul class="footer-legal">
      <li><a href="privacy.html" data-i18n="legal.privacy.title">Privacy Policy</a></li>
      <li><a href="terms.html" data-i18n="legal.terms.title">Terms</a></li>
      <li><a href="disclaimer.html" data-i18n="legal.disclaimer.title">Disclaimer</a></li>
    </ul>
  </div>`;
  return f;
}

/* ---- i18n --------------------------------------------------- */
let LANG_INIT = false;
function detectLang() {
  const url = new URLSearchParams(location.search).get("lang");
  const saved = localStorage.getItem("aa_lang");
  if (url === "ar" || url === "en") return url;
  if (saved === "ar" || saved === "en") return saved;
  const nav = (navigator.languages || [navigator.language || "en"]).some(l => l && l.toLowerCase().startsWith("ar"));
  return nav ? "ar" : "en";
}
function applyStatic(root = document) {
  $$("[data-i18n]", root).forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-attr]", root).forEach(el => {
    el.dataset.i18nAttr.split(";").forEach(pair => {
      const [attr, key] = pair.split(":").map(s => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
}
function updateMeta() {
  const m = I18N[AA.LANG].meta[document.body.dataset.page];
  if (!m) return;
  document.title = m.title;
  const set = (sel, val) => { const el = $(sel); if (el) el.setAttribute("content", val); };
  set('meta[name="description"]', m.desc);
  set('meta[property="og:title"]', m.title);       set('meta[property="og:description"]', m.desc);
  set('meta[name="twitter:title"]', m.title);      set('meta[name="twitter:description"]', m.desc);
}
function setLang(lang, persist = true) {
  AA.LANG = lang === "ar" ? "ar" : "en";
  const html = document.documentElement;
  html.lang = AA.LANG;
  html.dir = AA.LANG === "ar" ? "rtl" : "ltr";
  if (persist) try { localStorage.setItem("aa_lang", AA.LANG); } catch (e) { /* private mode */ }

  const fade = () => {
    document.body.classList.add("lang-fading");
    setTimeout(() => {
      applyStatic();
      AA.renderers.forEach(fn => { try { fn(); } catch (err) { /* one bad section must not kill the rest */ } });
      updateMeta();
      $$(".lang-btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === AA.LANG)));
      document.body.classList.remove("lang-fading");
    }, REDUCED ? 0 : 160);
  };
  if (LANG_INIT && !REDUCED) fade(); else { LANG_INIT = true; applyStatic(); AA.renderers.forEach(fn => fn()); updateMeta(); $$(".lang-btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === AA.LANG))); }
}

/* ---- mobile nav --------------------------------------------- */
let lastFocus = null;
function initNav() {
  const toggle = $("#navToggle"), panel = $("#mobilePanel"), backdrop = $("#navBackdrop");
  const setOpen = open => {
    panel.classList.toggle("open", open);
    backdrop.classList.toggle("open", open);
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", t(open ? "a11y.closeMenu" : "a11y.openMenu"));
    panel.inert = !open; backdrop.inert = !open;
    document.body.classList.toggle("no-scroll", open);
  };
  toggle.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
  backdrop.addEventListener("click", () => setOpen(false));
  panel.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { setOpen(false); closeDialog(); }
  });
  addEventListener("scroll", () => {
    $("#siteHeader").classList.toggle("scrolled", scrollY > 8);
  }, { passive: true });
  panel.inert = true; backdrop.inert = true;
}

/* ---- overlays / dialogs ------------------------------------- */
const dialogRoot = () => $("#dialogRoot");
function openDialog(node) {
  const root = dialogRoot();
  root.innerHTML = ""; root.appendChild(node);
  root.classList.add("open"); root.inert = false;
  document.body.classList.add("no-scroll");
  lastFocus = document.activeElement;
  (node.querySelector("[data-autofocus]") || node.querySelector("button, a")).focus();
}
function closeDialog() {
  const root = dialogRoot();
  if (!root.classList.contains("open")) return;
  root.classList.remove("open"); root.inert = true; root.innerHTML = "";
  document.body.classList.remove("no-scroll");
  if (lastFocus) { lastFocus.focus(); lastFocus = null; }
}
function initDialogA11y() {
  const root = dialogRoot();
  root.inert = true;
  root.addEventListener("click", e => { if (e.target === root) closeDialog(); });
  root.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeDialog(); });
  root.addEventListener("keydown", e => {          // minimal focus wrap
    if (e.key !== "Tab" || !root.classList.contains("open")) return;
    const f = $$("button, [href], input, select, textarea", root).filter(el => !el.disabled && el.offsetParent);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  });
}

/* ---- toast --------------------------------------------------- */
let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}
AA.toast = toast;
AA.openDialog = openDialog;
AA.closeDialog = closeDialog;
AA.icon = icon;

/* ---- reveal on scroll + counters ----------------------------- */
function initReveal() {
  const els = $$(".reveal");
  if (REDUCED || !("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -36px" });
  els.forEach(el => io.observe(el));
}
function initCounters() {
  $$(".stat-num[data-count]").forEach(el => {
    const n = +el.dataset.count || 0;
    if (!n) { el.textContent = "—"; return; }
    if (REDUCED) { el.textContent = String(n); return; }
    const t0 = performance.now(), D = 1300;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / D);
      el.textContent = String(Math.round(n * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}

/* ---- hero canvas: live trace (static when reduced motion) ---- */
function initHeroCanvas() {
  const c = $("#heroCanvas");
  if (!c) return;
  const ctx = c.getContext("2d");
  let t = 0, raf = null, visible = true;
  function size() {
    const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    c.width = r.width * d; c.height = r.height * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  function y(x, w, h) {
    const mid = h * 0.55, a = h * 0.17;
    return mid + Math.sin(x * 0.022 + t) * a * Math.sin(x * 0.006 + t * 0.55)
               + Math.sin(x * 0.05 - t * 1.3) * a * 0.32;
  }
  function paint() {
    const w = c.clientWidth, h = c.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.045)"; ctx.lineWidth = 1;
    for (let gx = 24; gx < w; gx += 24) { ctx.beginPath(); ctx.moveTo(gx, 8); ctx.lineTo(gx, h - 8); ctx.stroke(); }
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) x === 0 ? ctx.moveTo(x, y(x, w, h)) : ctx.lineTo(x, y(x, w, h));
    ctx.strokeStyle = "#FF6600"; ctx.lineWidth = 1.6; ctx.stroke();
    if (!REDUCED) {
      const dx = (t * 46) % w;
      ctx.beginPath(); ctx.arc(dx, y(dx, w, h), 3, 0, Math.PI * 2);
      ctx.fillStyle = "#FF8534"; ctx.fill();
    }
  }
  function frame() { t += 0.014; paint(); raf = requestAnimationFrame(frame); }
  size(); paint();
  addEventListener("resize", () => { size(); if (REDUCED) paint(); });
  if (!REDUCED) {
    new IntersectionObserver(entries => entries.forEach(en => {
      visible = en.isIntersecting;
      if (visible && raf === null) frame();
      if (!visible && raf !== null) { cancelAnimationFrame(raf); raf = null; }
    })).observe(c);
    frame();
  }
}

/* ---- global click delegation ---------------------------------- */
function initDelegation() {
  document.addEventListener("click", e => {
    const req = e.target.closest("[data-request]");
    if (req && AA.openRequest) { AA.openRequest(req.dataset.request || ""); return; }
    const lang = e.target.closest("[data-lang]");
    if (lang) { setLang(lang.dataset.lang); return; }
    const cert = e.target.closest("[data-cert]");
    if (cert && AA.openCertificate) { AA.openCertificate(cert.dataset.cert); return; }
    const cs = e.target.closest("[data-case]");
    if (cs && AA.openCaseStudy) { AA.openCaseStudy(cs.dataset.case); return; }
    const cp = e.target.closest("[data-copy]");
    if (cp) {
      const txt = cp.dataset.copy || "";
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast(t("toast.copied")));
      else toast(t("toast.copied"));
    }
  });
}

/* ---- generated SVG placeholders (no missing images) ----------- */
AA.thumbSVG = (seed, label) => `
  <svg viewBox="0 0 640 400" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid slice">
    <rect width="640" height="400" fill="#121216"/>
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${(i + 1) * 64}" y1="0" x2="${(i + 1) * 64}" y2="400" stroke="rgba(255,255,255,0.05)"/>`).join("")}
    ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${(i + 1) * 57}" x2="640" y2="${(i + 1) * 57}" stroke="rgba(255,255,255,0.05)"/>`).join("")}
    <path d="M0 ${260 + (seed % 3) * 14} Q160 ${180 - (seed % 4) * 18} 320 ${235 + (seed % 2) * 20} T640 ${190 + (seed % 5) * 12}" fill="none" stroke="#FF6600" stroke-width="2.5"/>
    <text x="36" y="356" font-family="monospace" font-size="30" fill="rgba(255,255,255,0.22)">${String(seed + 1).padStart(2, "0")}</text>
  </svg>`;
AA.certSVG = () => `
  <svg viewBox="0 0 800 560" role="img" preserveAspectRatio="xMidYMid slice">
    <rect width="800" height="560" fill="#131317"/>
    <rect x="28" y="28" width="744" height="504" fill="none" stroke="rgba(255,102,0,0.5)" stroke-width="2"/>
    <circle cx="400" cy="220" r="58" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <path d="M388 240l12-44 12 44h-8l-4-16-4 16z" fill="rgba(255,255,255,0.35)"/>
    <rect x="250" y="320" width="300" height="12" rx="6" fill="rgba(255,255,255,0.14)"/>
    <rect x="310" y="352" width="180" height="10" rx="5" fill="rgba(255,255,255,0.09)"/>
  </svg>`;

/* ---- boot ------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  buildSprite();
  renderChrome();
  AA.LANG = detectLang();
  setLang(AA.LANG, false);
  initNav();
  initDialogA11y();
  initDelegation();
  initReveal();
  initCounters();
  initHeroCanvas();
  const y = $("#year"); if (y) y.textContent = String(new Date().getFullYear());
});
