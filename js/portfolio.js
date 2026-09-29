/* ============================================================
   Abdallah Abas — portfolio: filtering, cards, case studies
   ============================================================ */
"use strict";

(() => {
  const { t, L, LL, esc: E, icon } = window.AA;
  let activeFilter = "all";

  const filterKey = c => "f" + c.charAt(0).toUpperCase() + c.slice(1);

  function renderFilters() {
    const bar = $("#portfolioFilters");
    if (!bar) return;
    const cats = SITE_CONFIG.portfolioCategories;
    bar.innerHTML = [`<button type="button" class="filter-chip ${activeFilter === "all" ? "active" : ""}"
        data-filter="all">${t("pPage.fAll")}</button>`]
      .concat(cats.map(c =>
        `<button type="button" class="filter-chip ${activeFilter === c ? "active" : ""}" data-filter="${c}">
         ${t("pPage." + filterKey(c))}</button>`)).join("");
  }

  window.AA.renderProjectCard = (p, i) => `
    <article class="project-card">
      <a class="project-thumb" href="${p.link ? E(p.link) : "#"}" ${p.link ? 'target="_blank" rel="noopener noreferrer"' : 'data-blocked="1"'}>
        ${p.image ? `<img src="${E(p.image)}" alt="${E(L(p.title))}" loading="lazy">` : AA.thumbSVG(i, L(p.title))}
        ${p.sample ? `<span class="badge-sample thumb-badge">${t("misc.sample")}</span>` : ""}
      </a>
      <div class="project-body">
        <div class="card-meta"><span class="cat">${t("pPage." + filterKey(p.category))}</span>
          ${p.year ? `<span class="num year">${E(p.year)}</span>` : ""}</div>
        <h3>${E(L(p.title))}</h3>
        <p>${E(L(p.desc))}</p>
        ${p.tech && p.tech.length ? `<ul class="tag-row">${p.tech.map(x => `<li class="num">${E(x)}</li>`).join("")}</ul>` : ""}
        <div class="project-actions">
          ${p.link ? `<a class="btn-text" href="${E(p.link)}" target="_blank" rel="noopener noreferrer">
            <span>${t("cta.visitProject")}</span>${icon("external")}</a>` : ""}
          ${p.caseStudy ? `<button type="button" class="btn-text" data-case="${E(p.id)}">
            <span>${t("cta.caseStudy")}</span>${icon("arrow", "icon-flip")}</button>` : ""}
        </div>
      </div>
    </article>`;

  function renderGrid() {
    const grid = $("#portfolioGrid");
    if (!grid) return;
    const list = LL(SITE_CONFIG.portfolio)
      .filter(p => activeFilter === "all" || p.category === activeFilter);
    grid.innerHTML = list.map((p, i) => AA.renderProjectCard(p, i)).join("");
    const empty = $("#portfolioEmpty");
    if (empty) empty.hidden = list.length > 0;
  }

  window.AA.openCaseStudy = id => {
    const p = LL(SITE_CONFIG.portfolio).find(x => x.id === id);
    if (!p || !p.caseStudy) return;
    const cs = p.caseStudy;
    const row = (label, key) => cs[key] ? `
      <section><h4>${t("pPage.case" + key.charAt(0).toUpperCase() + key.slice(1))}</h4><p>${E(L(cs[key]))}</p></section>` : "";
    const node = document.createElement("div");
    node.className = "dialog dialog-case"; node.setAttribute("role", "dialog");
    node.setAttribute("aria-modal", "true"); node.setAttribute("aria-labelledby", "caseTitle");
    node.innerHTML = `
      <button type="button" class="dialog-close" data-close aria-label="${t("a11y.closeDialog")}">${icon("close")}</button>
      <div class="dialog-body">
        <p class="kicker">${t("cta.caseStudy")}</p>
        <h3 id="caseTitle">${E(L(p.title))}</h3>
        ${row(null, "challenge")}${row(null, "analysis")}${row(null, "solution")}
        ${row(null, "implementation")}${row(null, "result")}
      </div>`;
    AA.openDialog(node);
  };

  AA.onRender(() => {
    renderFilters();
    renderGrid();
    const bar = $("#portfolioFilters");
    if (bar && !bar.dataset.bound) {
      bar.dataset.bound = "1";
      bar.addEventListener("click", e => {
        const chip = e.target.closest(".filter-chip");
        if (!chip) return;
        activeFilter = chip.dataset.filter;
        $$(".filter-chip", bar).forEach(b => b.classList.toggle("active", b === chip));
        renderGrid();
      });
      const grid = $("#portfolioGrid");
      grid.addEventListener("click", e => {
        if (e.target.closest('[data-blocked]')) e.preventDefault();
      });
    }
  });
})();
