/* ============================================================
   Abdallah Abas — content renderers: trust/stats, expertise,
   contact methods, articles, certificates, achievements,
   FAQ accordion, legal pages, about facts, CV & blog links.
   ============================================================ */
"use strict";

(() => {
  const { t, L, LL, esc: E } = window.AA;

  /* --- trust: stats + expertise (home & about) ---------------- */
  function renderTrust() {
    const s = SITE_CONFIG.stats, grid = $("#statsGrid");
    if (grid) {
      const items = [["projects", "trust.statProjects"], ["certificates", "trust.statCerts"],
                     ["years", "trust.statYears"], ["articles", "trust.statArticles"]];
      grid.innerHTML = items.map(([k, label]) =>
        `<div class="stat"><span class="stat-num num" data-count="${s[k] || 0}">${s[k] || "—"}</span>
         <span class="stat-label">${t(label)}</span></div>`).join("")
        + `<p class="stat-note">${t("trust.statNote")}</p>`;
    }
    const chips = LL(SITE_CONFIG.expertise).map(x =>
      `<li class="chip">${E(L(x))}</li>`).join("");
    const ec = $("#expertiseChips"); if (ec) ec.innerHTML = chips;
    const ae = $("#aboutExpertise"); if (ae) ae.innerHTML = chips;
  }

  /* --- about: profile facts + CV ------------------------------- */
  function renderAbout() {
    const dl = $("#profileFacts");
    if (dl) {
      dl.innerHTML = [
        ["about.fkFocus", "about.fvFocus"], ["about.fkPlatforms", "about.fvPlatforms"],
        ["about.fkTools", "about.fvTools"], ["about.fkLanguages", "about.fvLanguages"],
        ["about.fkEducation", "about.fvEducation"]
      ].map(([k, v]) => `<div class="fact"><dt>${t(k)}</dt><dd>${t(v)}</dd></div>`).join("");
    }
    const btn = $("#cvBtn");
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        if (SITE_CONFIG.cvUrl) {
          const a = document.createElement("a");
          a.href = SITE_CONFIG.cvUrl; a.download = ""; a.rel = "noopener"; a.click();
        } else toast(t("about.cvPending"));
      });
    }
  }

  /* --- contact methods ----------------------------------------- */
  function renderContact() {
    const wrap = $("#contactMethods");
    if (!wrap) return;
    const c = SITE_CONFIG, ext = 'target="_blank" rel="noopener noreferrer"';
    const items = [];
    if (c.whatsapp) items.push(["whatsapp", "WhatsApp", `https://wa.me/${c.whatsapp}`, "+" + c.whatsapp]);
    if (c.email) items.push(["mail", t("request.m1"), `mailto:${c.email}`, c.email]);
    if (c.social.telegram) items.push(["telegram", "Telegram", c.social.telegram, "Telegram"]);
    if (c.social.linkedin) items.push(["linkedin", "LinkedIn", c.social.linkedin, "LinkedIn"]);
    if (c.social.github) items.push(["github", "GitHub", c.social.github, "GitHub"]);
    if (c.social.facebook) items.push(["facebook", "Facebook", c.social.facebook, "Facebook"]);
    if (c.social.instagram) items.push(["instagram", "Instagram", c.social.instagram, "Instagram"]);
    wrap.innerHTML = items.map(([ic, name, href, val]) => `
      <a class="method" href="${E(href)}" ${href.startsWith("http") ? ext : ""}>
        ${window.AA.icon(ic)}
        <span class="method-body"><span class="method-name">${E(name)}</span>
        <span class="method-val num">${E(val)}</span></span>
        <span class="method-arrow">${window.AA.icon("external")}</span>
      </a>`).join("");
    const note = $("#contactEmptyNote");
    if (note) note.hidden = items.length > 0;

    /* footer contact + social reuse */
    const fc = $("#footerContact");
    if (fc) fc.innerHTML = (c.email ? `<li><a href="mailto:${E(c.email)}">${E(c.email)}</a></li>` : "")
      + (c.whatsapp ? `<li><a href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener noreferrer">+${E(c.whatsapp)}</a></li>` : "")
      + `<li><button type="button" class="linklike" data-request>${t("cta.request")}</button></li>`;
    const fs = $("#footerSocial");
    if (fs) fs.innerHTML = items.filter(i => i[2].startsWith("http")).map(([ic, name, href]) =>
      `<a class="social-btn" href="${E(href)}" target="_blank" rel="noopener noreferrer" aria-label="${E(name)}">${window.AA.icon(ic)}</a>`).join("");
  }

  /* --- articles gateway ---------------------------------------- */
  function renderArticles() {
    const grid = $("#articlesGrid");
    if (!grid) return;
    const base = SITE_CONFIG.blogUrl;
    const list = LL(SITE_CONFIG.articles);
    const catLabel = k => {
      const map = SITE_CONFIG.articleCategories;
      return map[k] ? (typeof map[k] === "string" ? map[k] : map[k]) : k;
    };
    grid.innerHTML = list.map(a => `
      <article class="article-card">
        <div class="card-meta">
          <span class="cat">${E(catLabel(a.category))}</span>
          <time class="num" datetime="${E(a.date)}">${fmtDate(a.date)}</time>
        </div>
        <h3>${E(L(a.title))}${a.sample ? sampleBadge() : ""}</h3>
        <p>${E(L(a.desc))}</p>
        <a class="btn-text ${base ? "" : "is-disabled"}" href="${base ? E(base + a.slug) : "#"}"
           ${base ? 'target="_blank" rel="noopener noreferrer"' : 'data-blocked="1"'}>
          <span>${t("cta.readArticle")}</span>${window.AA.icon("arrow", "icon-flip")}
        </a>
      </article>`).join("");
    const empty = $("#articlesEmpty");
    if (empty) empty.hidden = list.length > 0;
    const blog = $("#blogLink");
    if (blog) {
      if (base) blog.href = base;
      else blog.addEventListener("click", e => { e.preventDefault(); toast(t("toast.blogPending")); });
    }
    grid.addEventListener("click", e => {
      const bad = e.target.closest('[data-blocked]');
      if (bad) { e.preventDefault(); toast(t("toast.blogPending")); }
    });
  }

  /* --- certificates --------------------------------------------- */
  function renderCertificates() {
    const grid = $("#certGrid");
    if (!grid) return;
    const list = LL(SITE_CONFIG.certificates);
    grid.innerHTML = list.map((c, i) => `
      <figure class="cert-card">
        <button type="button" class="cert-thumb" data-cert="${i}" aria-label="${t("a11y.certView")}">
          ${c.image ? `<img src="${E(c.image)}" alt="${E(L(c.title))}" loading="lazy">` : window.AA.certSVG()}
        </button>
        <figcaption>
          <h3>${E(L(c.title))}</h3>
          <p class="cert-org">${E(L(c.org))} · <span class="num">${fmtDate(c.date)}</span></p>
          ${c.credentialId ? `<p class="cert-id mono">${t("cert.idLabel")}: <span class="num">${E(c.credentialId)}</span></p>` : ""}
          ${c.verifyUrl ? `<a class="btn-text" href="${E(c.verifyUrl)}" target="_blank" rel="noopener noreferrer">
            <span>${t("cert.verifyLabel")}</span>${window.AA.icon("external")}</a>` : ""}
        </figcaption>
      </figure>`).join("");
    const empty = $("#certEmpty");
    if (empty) empty.hidden = list.length > 0;
  }
  window.AA.openCertificate = i => {
    const c = LL(SITE_CONFIG.certificates)[i];
    if (!c) return;
    const node = document.createElement("div");
    node.className = "dialog dialog-cert"; node.setAttribute("role", "dialog");
    node.setAttribute("aria-modal", "true"); node.setAttribute("aria-label", L(c.title));
    node.innerHTML = `
      <button type="button" class="dialog-close" data-close aria-label="${t("a11y.closeDialog")}">${window.AA.icon("close")}</button>
      <div class="cert-view">${c.image ? `<img src="${E(c.image)}" alt="${E(L(c.title))}">` : window.AA.certSVG()}</div>
      <div class="dialog-body">
        <h3>${E(L(c.title))}</h3>
        <p>${E(L(c.org))} · <span class="num">${fmtDate(c.date)}</span></p>
        ${c.credentialId ? `<p class="mono">${t("cert.idLabel")}: <span class="num">${E(c.credentialId)}</span></p>` : ""}
        ${c.verifyUrl ? `<a class="btn btn-ghost btn-s" href="${E(c.verifyUrl)}" target="_blank" rel="noopener noreferrer">${t("cert.verifyLabel")}</a>` : ""}
      </div>`;
    window.AA.openDialog(node);
  };

  /* --- achievements --------------------------------------------- */
  function renderAchievements() {
    const wrap = $("#achievementsWrap");
    if (!wrap) return;
    const list = LL(SITE_CONFIG.achievements);
    wrap.innerHTML = list.map(a => `
      <article class="ach-row">
        <span class="ach-year num">${E(a.year || "")}</span>
        <div><h3>${E(L(a.title))}</h3>
          ${a.desc ? `<p>${E(L(a.desc))}</p>` : ""}
          ${a.org ? `<span class="ach-org">${E(L(a.org))}</span>` : ""}</div>
      </article>`).join("");
    const empty = $("#achievementsEmpty");
    if (empty) empty.hidden = list.length > 0;
  }

  /* --- FAQ accordion --------------------------------------------- */
  function renderFAQ() {
    const wrap = $("#faqList");
    if (!wrap) return;
    wrap.innerHTML = LL(I18N[AA.LANG].faq.items).map((it, i) => `
      <div class="acc-item">
        <h3 class="acc-heading">
          <button type="button" class="acc-btn" id="accb-${i}" aria-expanded="false" aria-controls="accp-${i}">
            <span>${E(it.q)}</span>${window.AA.icon("chevron", "acc-chev")}
          </button>
        </h3>
        <div class="acc-panel" id="accp-${i}" role="region" aria-labelledby="accb-${i}">
          <div class="acc-inner"><p>${E(it.a)}</p></div>
        </div>
      </div>`).join("");
    wrap.addEventListener("click", e => {
      const btn = e.target.closest(".acc-btn");
      if (!btn) return;
      const item = btn.closest(".acc-item");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  /* --- legal pages ----------------------------------------------- */
  function renderLegal() {
    const key = document.body.dataset.legal;
    if (!key) return;
    const data = I18N[AA.LANG].legal[key];
    const title = $("#legalTitle"), body = $("#legalBody");
    if (title) title.textContent = data.title;
    if (body) body.innerHTML = data.sections.map(s =>
      `<section><h2>${E(s.h)}</h2>${s.b.map(p => `<p>${E(p)}</p>`).join("")}</section>`).join("");
  }

  /* --- home: work preview ---------------------------------------- */
  function renderHomeWork() {
    const grid = $("#workGrid");
    if (grid && window.AA.renderProjectCard) {
      grid.innerHTML = LL(SITE_CONFIG.portfolio).slice(0, 3)
        .map((p, i) => window.AA.renderProjectCard(p, i)).join("");
    }
  }

  const fmtDate = d => {
    try { return new Date(d).toLocaleDateString(AA.LANG === "ar" ? "ar" : "en", { year: "numeric", month: "short", day: "numeric" }); }
    catch (e) { return d; }
  };
  const sampleBadge = () => `<span class="badge-sample">${t("misc.sample")}</span>`;
  window.AA.sampleBadge = sampleBadge;
  window.AA.fmtDate = fmtDate;

  AA.onRender(() => { renderTrust(); renderAbout(); renderContact(); renderArticles();
    renderCertificates(); renderAchievements(); renderFAQ(); renderLegal(); renderHomeWork(); });
})();
